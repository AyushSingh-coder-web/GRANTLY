import {
  DeadlineItem,
  DeadlineUrgency,
  Application,
  VaultDocument,
  Scholarship,
} from '../types';
import { evaluateDocumentReadiness } from './documentIntelligence';

export function calculateDaysRemaining(deadlineStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const deadline = new Date(deadlineStr);
  deadline.setHours(0, 0, 0, 0);

  const diffTime = deadline.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getDeadlineUrgency(daysRemaining: number): DeadlineUrgency {
  if (daysRemaining < 0) return 'passed';
  if (daysRemaining <= 5) return 'critical';
  if (daysRemaining <= 14) return 'urgent';
  return 'upcoming';
}

/**
 * Calculate Deadline Risk Score (0-100)
 * Combines remaining days, application workflow stage, and document vault gaps.
 */
export function calculateDeadlineRiskScore(
  daysRemaining: number,
  appStatus?: string,
  missingDocsCount = 0
): number {
  if (daysRemaining < 0) return 0; // Already passed
  if (appStatus === 'Submitted' || appStatus === 'Approved') return 5; // Minimal risk

  // Days pressure (50% max)
  let timeScore = 0;
  if (daysRemaining <= 3) timeScore = 50;
  else if (daysRemaining <= 7) timeScore = 40;
  else if (daysRemaining <= 14) timeScore = 25;
  else if (daysRemaining <= 30) timeScore = 15;
  else timeScore = 5;

  // Status penalty (30% max)
  let statusPenalty = 0;
  if (!appStatus || appStatus === 'Saved') {
    statusPenalty = 30; // Not even started preparing!
  } else if (appStatus === 'Preparing') {
    statusPenalty = 20;
  } else if (appStatus === 'Ready to Apply') {
    statusPenalty = 10;
  }

  // Missing documents penalty (20% max)
  const docPenalty = Math.min(20, missingDocsCount * 7);

  const total = timeScore + statusPenalty + docPenalty;
  return Math.min(100, Math.max(0, total));
}

export function generateDeadlineItems(
  scholarships: Scholarship[],
  applications: Application[],
  vaultDocs: VaultDocument[]
): DeadlineItem[] {
  const items: DeadlineItem[] = [];

  for (const s of scholarships) {
    const app = applications.find((a) => a.scholarshipId === s.id);
    const docReadiness = evaluateDocumentReadiness(s, vaultDocs);
    const days = calculateDaysRemaining(s.deadline);
    const urgency = getDeadlineUrgency(days);
    const riskScore = calculateDeadlineRiskScore(days, app?.status, docReadiness.missingCount);

    let nextRecommendedAction = 'Review eligibility and save to workspace.';
    if (app) {
      if (app.status === 'Submitted') {
        nextRecommendedAction = 'Track portal verification updates and reference number.';
      } else if (docReadiness.missingCount > 0) {
        nextRecommendedAction = `Upload missing ${docReadiness.missingTypes[0]?.documentType || 'documents'} to reach 100% readiness.`;
      } else if (app.status === 'Ready to Apply') {
        nextRecommendedAction = `Submit application on official portal (${s.provider}) before ${s.deadline}.`;
      } else {
        nextRecommendedAction = 'Review requirements and advance application to Ready.';
      }
    } else if (days <= 7) {
      nextRecommendedAction = `High priority opportunity closing in ${days} days! Check eligibility now.`;
    }

    items.push({
      id: `dl-${s.id}`,
      scholarshipId: s.id,
      scholarshipTitle: s.title,
      provider: s.provider,
      deadlineDate: s.deadline,
      daysRemaining: days,
      urgency,
      riskScore,
      applicationStatus: app?.status,
      documentReadinessPercent: docReadiness.readinessPercentage,
      missingDocumentsCount: docReadiness.missingCount,
      nextRecommendedAction,
    });
  }

  return items.sort((a, b) => b.riskScore - a.riskScore);
}

export interface GrantlyBriefing {
  highRiskCount: number;
  criticalDeadlines: DeadlineItem[];
  missingDocumentsOverview: { docType: string; countNeeded: number }[];
  urgentAction: string;
  actionType: 'deadline' | 'document' | 'submission';
}

export function generateGrantlyBriefing(deadlineItems: DeadlineItem[]): GrantlyBriefing {
  const critical = deadlineItems.filter((i) => i.riskScore >= 60 && i.urgency !== 'passed');
  const highRiskCount = critical.length;

  let urgentAction = 'All saved applications are on track. Discover new verified grants today.';
  let actionType: 'deadline' | 'document' | 'submission' = 'submission';

  if (critical.length > 0) {
    const topItem = critical[0];
    if (topItem.missingDocumentsCount > 0) {
      urgentAction = `Upload missing documents for "${topItem.scholarshipTitle}" (Closing in ${topItem.daysRemaining} days).`;
      actionType = 'document';
    } else if (topItem.applicationStatus === 'Ready to Apply') {
      urgentAction = `Finalize and submit "${topItem.scholarshipTitle}" on official portal before deadline.`;
      actionType = 'submission';
    } else {
      urgentAction = `Action needed on "${topItem.scholarshipTitle}": Deadline is in ${topItem.daysRemaining} days!`;
      actionType = 'deadline';
    }
  }

  return {
    highRiskCount,
    criticalDeadlines: critical.slice(0, 3),
    missingDocumentsOverview: [
      { docType: 'Income Certificate', countNeeded: 2 },
      { docType: 'Fee Receipt', countNeeded: 1 },
    ],
    urgentAction,
    actionType,
  };
}
