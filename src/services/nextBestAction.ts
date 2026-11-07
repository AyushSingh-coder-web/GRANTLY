import { Application, VaultDocument, StudentProfile } from '../types';
import { calculateDaysRemaining } from './deadlineRisk';
import { evaluateDocumentReadiness } from './documentIntelligence';

export interface NextBestActionResult {
  actionText: string;
  actionSubtext: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  category: 'document' | 'profile' | 'submission' | 'verification' | 'review';
  ctaText: string;
  targetRoute: string;
}

export function determineNextBestAction(
  app: Application,
  vaultDocs: VaultDocument[],
  profile: StudentProfile
): NextBestActionResult {
  const days = calculateDaysRemaining(app.scholarship.deadline);
  const docReadiness = evaluateDocumentReadiness(app.scholarship, vaultDocs);

  // 1. If profile is incomplete
  if (!profile.annualFamilyIncome || !profile.academicScore) {
    return {
      actionText: 'Complete Required Profile Details',
      actionSubtext: 'Your student profile is missing critical income or academic score fields needed for verification.',
      priority: 'high',
      category: 'profile',
      ctaText: 'Edit Profile',
      targetRoute: '/dashboard/profile',
    };
  }

  // 2. If already submitted
  if (app.status === 'Submitted') {
    if (!app.referenceNumber) {
      return {
        actionText: 'Record Application Reference Number',
        actionSubtext: 'Keep your official portal registration/acknowledgment number stored for quick tracking.',
        priority: 'medium',
        category: 'verification',
        ctaText: 'Add Reference Number',
        targetRoute: '/dashboard/applications',
      };
    }
    return {
      actionText: 'Track Institutional Review Status',
      actionSubtext: `Application submitted on ${app.submittedAt ? new Date(app.submittedAt).toLocaleDateString() : 'portal'}. Watch for college Nodal Officer verification.`,
      priority: 'low',
      category: 'verification',
      ctaText: 'View Timeline',
      targetRoute: '/dashboard/applications',
    };
  }

  // 3. If missing mandatory documents
  if (docReadiness.missingCount > 0) {
    const firstMissing = docReadiness.missingTypes[0]?.documentType || 'document';
    const isCritical = days <= 5;
    return {
      actionText: `Upload Missing ${firstMissing}`,
      actionSubtext: `This scholarship requires ${docReadiness.totalRequired} documents. You have ${docReadiness.availableCount} ready (${docReadiness.missingCount} remaining).`,
      priority: isCritical ? 'critical' : 'high',
      category: 'document',
      ctaText: 'Open Document Vault',
      targetRoute: '/dashboard/documents',
    };
  }

  // 4. If all documents ready and deadline is imminent
  if (app.status === 'Ready to Apply' || docReadiness.readinessPercentage === 100) {
    if (days <= 5) {
      return {
        actionText: `Urgent: Submit on Official Portal (${days} Days Left)`,
        actionSubtext: `All requirements are 100% prepared! Submit your verified form directly on ${app.scholarship.provider}'s portal.`,
        priority: 'critical',
        category: 'submission',
        ctaText: 'Submit & Record Application',
        targetRoute: '/dashboard/applications',
      };
    }
    return {
      actionText: 'Finalize & Submit Application',
      actionSubtext: 'Your document vault is 100% ready for this opportunity. Review application checklist and apply.',
      priority: 'high',
      category: 'submission',
      ctaText: 'View Application Checklist',
      targetRoute: '/dashboard/applications',
    };
  }

  // 5. Default preparing action
  return {
    actionText: 'Advance Application Preparation',
    actionSubtext: 'Verify eligibility conditions, check required documents, and mark application as Ready.',
    priority: 'medium',
    category: 'review',
    ctaText: 'Open Workspace',
    targetRoute: '/dashboard/applications',
  };
}
