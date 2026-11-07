import { VaultDocument, RequiredDocumentDef, Scholarship } from '../types';

export interface DocumentMatchResult {
  requirement: RequiredDocumentDef;
  status: 'available' | 'missing' | 'expired';
  matchedDocument?: VaultDocument;
}

export interface ScholarshipDocumentReadiness {
  scholarshipId: string;
  totalRequired: number;
  availableCount: number;
  missingCount: number;
  readinessPercentage: number;
  matches: DocumentMatchResult[];
  missingTypes: RequiredDocumentDef[];
}

/**
 * Compare student vault documents against a scholarship's required document specifications
 */
export function evaluateDocumentReadiness(
  scholarship: Scholarship,
  vaultDocs: VaultDocument[]
): ScholarshipDocumentReadiness {
  const requirements = scholarship.requiredDocuments || [];
  const matches: DocumentMatchResult[] = [];
  const missingTypes: RequiredDocumentDef[] = [];

  for (const req of requirements) {
    // Find matching document in vault by type
    const matched = vaultDocs.find((doc) => doc.documentType === req.documentType);

    if (matched) {
      // Check if expired
      const isExpired = matched.expiryDate && new Date(matched.expiryDate) < new Date();
      if (isExpired) {
        matches.push({
          requirement: req,
          status: 'expired',
          matchedDocument: matched,
        });
        missingTypes.push(req);
      } else {
        matches.push({
          requirement: req,
          status: 'available',
          matchedDocument: matched,
        });
      }
    } else {
      matches.push({
        requirement: req,
        status: 'missing',
      });
      missingTypes.push(req);
    }
  }

  const mandatoryReqs = requirements.filter((r) => r.isMandatory);
  const totalWeight = mandatoryReqs.length || requirements.length || 1;
  const satisfiedMandatory = matches.filter(
    (m) => m.requirement.isMandatory && m.status === 'available'
  ).length;

  const readinessPercentage = Math.round((satisfiedMandatory / totalWeight) * 100);
  const availableCount = matches.filter((m) => m.status === 'available').length;
  const missingCount = matches.filter((m) => m.status !== 'available').length;

  return {
    scholarshipId: scholarship.id,
    totalRequired: requirements.length,
    availableCount,
    missingCount,
    readinessPercentage,
    matches,
    missingTypes,
  };
}

/**
 * Document Reuse Intelligence:
 * Calculate across ALL scholarships how many scholarships an uploaded document can satisfy
 */
export function calculateDocumentReuseStats(
  vaultDocs: VaultDocument[],
  allScholarships: Scholarship[]
): {
  documentId: string;
  documentTitle: string;
  documentType: string;
  usedInCount: number;
  satisfiedScholarshipTitles: string[];
}[] {
  return vaultDocs.map((doc) => {
    const satisfiedScholarships: string[] = [];

    for (const s of allScholarships) {
      const needsThisType = s.requiredDocuments.some((req) => req.documentType === doc.documentType);
      if (needsThisType) {
        satisfiedScholarships.push(s.title);
      }
    }

    return {
      documentId: doc.id,
      documentTitle: doc.customTitle,
      documentType: doc.documentType,
      usedInCount: satisfiedScholarships.length,
      satisfiedScholarshipTitles: satisfiedScholarships,
    };
  });
}
