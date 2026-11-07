export type EducationLevel = 'High School (10th/12th)' | 'Undergraduate' | 'Postgraduate' | 'Doctorate (Ph.D.)' | 'Diploma / Vocational';

export type Category = 'General' | 'OBC' | 'SC' | 'ST' | 'EWS' | 'Minority' | 'Person with Disability (PwD)';

export type Gender = 'All' | 'Male' | 'Female' | 'Transgender' | 'Non-Binary';

export interface StudentProfile {
  id: string;
  fullName: string;
  email: string;
  dateOfBirth: string;
  state: string;
  district: string;
  gender: string;
  category: Category;
  educationLevel: EducationLevel;
  institution: string;
  institutionType: 'Government / State' | 'Central University' | 'Private' | 'Deemed / Autonomous';
  course: string;
  degree: string;
  academicYear: string;
  enrollmentYear: number;
  expectedGraduationYear: number;
  institutionLocation: string;
  academicScore: number; // percentage (e.g. 84.5)
  scoreType: 'Percentage' | 'CGPA';
  previousAcademicScore?: number;
  currentSemester?: string;
  academicAchievements?: string;
  annualFamilyIncome: number; // in INR
  incomeRange: 'Below ₹1,50,000' | '₹1,50,000 - ₹3,00,000' | '₹3,00,000 - ₹6,00,000' | '₹6,00,000 - ₹8,00,000' | 'Above ₹8,00,000';
  financialCircumstances?: string;
  preferences: {
    government: boolean;
    private: boolean;
    institutional: boolean;
    meritBased: boolean;
    needBased: boolean;
    researchGrants: boolean;
    international: boolean;
  };
  isOnboarded: boolean;
  updatedAt: string;
}

export type ScholarshipCategory = 'Government' | 'Private' | 'Institutional' | 'Corporate CSR' | 'Research' | 'International';

export type FundingType = 'Full Tuition' | 'Partial Tuition' | 'Fixed Annual Grant' | 'Monthly Stipend' | 'One-Time Award';

export type VerificationStatus = 'Verified Official' | 'Curated Demonstration' | 'Community Reported';

export interface ScholarshipRule {
  id: string;
  ruleType: 'min_academic_score' | 'max_family_income' | 'education_level' | 'eligible_states' | 'eligible_courses' | 'category' | 'gender' | 'institution_type';
  operator: 'gte' | 'lte' | 'eq' | 'in' | 'contains';
  requiredValue: any;
  isMandatory: boolean;
  explanation: string;
}

export interface RequiredDocumentDef {
  documentType: DocumentType;
  description: string;
  isMandatory: boolean;
  validityNote?: string;
}

export interface Scholarship {
  id: string;
  title: string;
  slug: string;
  provider: string;
  description: string;
  category: ScholarshipCategory;
  fundingAmount: number;
  fundingAmountDisplay: string;
  fundingType: FundingType;
  educationLevel: EducationLevel[];
  eligibleStates: string[]; // empty or ['All India'] means nationwide
  officialUrl: string;
  sourceUrl: string;
  deadline: string; // YYYY-MM-DD
  applicationStartDate: string;
  verificationStatus: VerificationStatus;
  lastVerifiedAt: string;
  tags: string[];
  rules: ScholarshipRule[];
  requiredDocuments: RequiredDocumentDef[];
  applicationProcedure: string[];
  selectionCriteria: string;
  contactEmail?: string;
}

export type RuleStatus = 'passed' | 'failed' | 'missing_info';

export interface RuleEvaluationResult {
  ruleId: string;
  ruleName: string;
  studentValue: string;
  requiredValue: string;
  status: RuleStatus;
  isMandatory: boolean;
  explanation: string;
}

export type EligibilityStatus = 'eligible' | 'potentially_eligible' | 'not_eligible';

export interface EligibilityAssessment {
  scholarshipId: string;
  overallStatus: EligibilityStatus;
  matchScore: number; // 0 to 100
  results: RuleEvaluationResult[];
  passedCount: number;
  failedMandatoryCount: number;
  missingInfoCount: number;
  aiExplanation?: string;
  isCustomSimulation?: boolean;
}

export type ApplicationStatus =
  | 'Saved'
  | 'Preparing'
  | 'Ready to Apply'
  | 'Submitted'
  | 'Under Review'
  | 'Approved'
  | 'Rejected'
  | 'Withdrawn';

export interface ActivityLog {
  id: string;
  timestamp: string;
  action: string;
  description: string;
}

export interface Application {
  id: string;
  scholarshipId: string;
  scholarship: Scholarship;
  status: ApplicationStatus;
  referenceNumber?: string;
  savedAt: string;
  submittedAt?: string;
  notes?: string;
  nextAction: string;
  updatedAt: string;
  history: ActivityLog[];
}

export type DocumentType =
  | 'Identity Proof'
  | 'Income Certificate'
  | 'Academic Marksheets'
  | 'Bonafide Certificate'
  | 'Caste Certificate'
  | 'Bank Proof'
  | 'Photograph'
  | 'Fee Receipt'
  | 'Other';

export type DocumentVerificationStatus =
  | 'Uploaded'
  | 'Pending Review'
  | 'Verified'
  | 'Requires Renewal'
  | 'Expired';

export interface VaultDocument {
  id: string;
  userId: string;
  documentType: DocumentType;
  customTitle: string;
  fileName: string;
  fileSize: number; // in bytes
  fileType: string;
  fileDataUrl?: string;
  uploadedAt: string;
  expiryDate?: string;
  verificationStatus: DocumentVerificationStatus;
  issuingAuthority?: string;
  notes?: string;
}

export type DeadlineUrgency = 'critical' | 'urgent' | 'upcoming' | 'passed';

export interface DeadlineItem {
  id: string;
  scholarshipId: string;
  scholarshipTitle: string;
  provider: string;
  deadlineDate: string;
  daysRemaining: number;
  urgency: DeadlineUrgency;
  riskScore: number; // 0 to 100
  applicationStatus?: ApplicationStatus;
  documentReadinessPercent: number;
  missingDocumentsCount: number;
  nextRecommendedAction: string;
}

export type NotificationType = 'deadline' | 'document' | 'profile' | 'application' | 'system';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  type: 'deadline' | 'document_prep' | 'submission_reminder' | 'personal_task';
  scholarshipId?: string;
  scholarshipTitle?: string;
  urgency: DeadlineUrgency;
  notes?: string;
  isCompleted?: boolean;
}
