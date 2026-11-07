import {
  StudentProfile,
  Scholarship,
  ScholarshipRule,
  RuleEvaluationResult,
  EligibilityAssessment,
  EligibilityStatus,
} from '../types';
import { SCHOLARSHIPS_DATA } from '../data/scholarshipsData';

export function evaluateRule(
  rule: ScholarshipRule,
  profile: Partial<StudentProfile>
): RuleEvaluationResult {
  switch (rule.ruleType) {
    case 'min_academic_score': {
      const minScore = Number(rule.requiredValue);
      const studentScore = profile.academicScore;

      if (studentScore === undefined || studentScore === null || isNaN(studentScore)) {
        return {
          ruleId: rule.id,
          ruleName: 'Minimum Academic Performance',
          studentValue: 'Not specified in profile',
          requiredValue: `>= ${minScore}%`,
          status: 'missing_info',
          isMandatory: rule.isMandatory,
          explanation: 'Your profile is missing academic score. Add it to evaluate this rule.',
        };
      }

      const passed = studentScore >= minScore;
      return {
        ruleId: rule.id,
        ruleName: 'Minimum Academic Performance',
        studentValue: `${studentScore}%`,
        requiredValue: `>= ${minScore}%`,
        status: passed ? 'passed' : 'failed',
        isMandatory: rule.isMandatory,
        explanation: passed
          ? `Your academic score (${studentScore}%) meets or exceeds the required minimum (${minScore}%).`
          : `Your academic score (${studentScore}%) is below the minimum required threshold of ${minScore}%.`,
      };
    }

    case 'max_family_income': {
      const maxIncome = Number(rule.requiredValue);
      const studentIncome = profile.annualFamilyIncome;

      if (studentIncome === undefined || studentIncome === null || isNaN(studentIncome)) {
        return {
          ruleId: rule.id,
          ruleName: 'Maximum Annual Family Income',
          studentValue: 'Not specified in profile',
          requiredValue: `≤ ₹${maxIncome.toLocaleString('en-IN')}`,
          status: 'missing_info',
          isMandatory: rule.isMandatory,
          explanation: 'Family annual income is not filled in your profile.',
        };
      }

      const passed = studentIncome <= maxIncome;
      return {
        ruleId: rule.id,
        ruleName: 'Maximum Annual Family Income',
        studentValue: `₹${studentIncome.toLocaleString('en-IN')}`,
        requiredValue: `≤ ₹${maxIncome.toLocaleString('en-IN')}`,
        status: passed ? 'passed' : 'failed',
        isMandatory: rule.isMandatory,
        explanation: passed
          ? `Your annual family income (₹${studentIncome.toLocaleString('en-IN')}) satisfies the income ceiling (≤ ₹${maxIncome.toLocaleString('en-IN')}).`
          : `Your annual family income (₹${studentIncome.toLocaleString('en-IN')}) exceeds the maximum eligibility limit of ₹${maxIncome.toLocaleString('en-IN')}.`,
      };
    }

    case 'education_level': {
      const requiredLevels: string[] = Array.isArray(rule.requiredValue)
        ? rule.requiredValue
        : [rule.requiredValue];
      const studentLevel = profile.educationLevel;

      if (!studentLevel) {
        return {
          ruleId: rule.id,
          ruleName: 'Eligible Education Level',
          studentValue: 'Not specified in profile',
          requiredValue: requiredLevels.join(', '),
          status: 'missing_info',
          isMandatory: rule.isMandatory,
          explanation: 'Education level not found in student profile.',
        };
      }

      const passed = requiredLevels.some(
        (lvl) => lvl.toLowerCase() === studentLevel.toLowerCase()
      );
      return {
        ruleId: rule.id,
        ruleName: 'Eligible Education Level',
        studentValue: studentLevel,
        requiredValue: requiredLevels.join(' or '),
        status: passed ? 'passed' : 'failed',
        isMandatory: rule.isMandatory,
        explanation: passed
          ? `Your current level (${studentLevel}) matches the accepted degrees.`
          : `This opportunity is restricted to ${requiredLevels.join(' or ')}. Your profile indicates ${studentLevel}.`,
      };
    }

    case 'eligible_states': {
      const eligibleStates: string[] = Array.isArray(rule.requiredValue)
        ? rule.requiredValue
        : [rule.requiredValue];
      const studentState = profile.state;

      if (eligibleStates.includes('All India') || eligibleStates.length === 0) {
        return {
          ruleId: rule.id,
          ruleName: 'Geographic Domicile / State',
          studentValue: studentState || 'All India Citizen',
          requiredValue: 'All India (Any State / UT)',
          status: 'passed',
          isMandatory: rule.isMandatory,
          explanation: 'This scheme is open to eligible citizens across all Indian States and Union Territories.',
        };
      }

      if (!studentState) {
        return {
          ruleId: rule.id,
          ruleName: 'Geographic Domicile / State',
          studentValue: 'Not specified in profile',
          requiredValue: eligibleStates.join(', '),
          status: 'missing_info',
          isMandatory: rule.isMandatory,
          explanation: 'State domicile is missing from your profile.',
        };
      }

      const passed = eligibleStates.some(
        (st) => st.toLowerCase() === studentState.toLowerCase()
      );
      return {
        ruleId: rule.id,
        ruleName: 'Geographic Domicile / State',
        studentValue: studentState,
        requiredValue: eligibleStates.join(', '),
        status: passed ? 'passed' : 'failed',
        isMandatory: rule.isMandatory,
        explanation: passed
          ? `Your domicile state (${studentState}) matches the eligible state list.`
          : `Limited to domiciles of ${eligibleStates.join(', ')}. Your profile states ${studentState}.`,
      };
    }

    case 'eligible_courses': {
      const keywords: string[] = Array.isArray(rule.requiredValue)
        ? rule.requiredValue
        : [rule.requiredValue];
      const studentCourse = `${profile.course || ''} ${profile.degree || ''}`.toLowerCase();

      if (!profile.course && !profile.degree) {
        return {
          ruleId: rule.id,
          ruleName: 'Academic Stream / Course',
          studentValue: 'Not specified in profile',
          requiredValue: keywords.join(', '),
          status: 'missing_info',
          isMandatory: rule.isMandatory,
          explanation: 'Course / degree information missing from profile.',
        };
      }

      const passed = keywords.some((kw) => studentCourse.includes(kw.toLowerCase()));
      return {
        ruleId: rule.id,
        ruleName: 'Academic Stream / Course',
        studentValue: `${profile.degree || ''} ${profile.course || ''}`.trim(),
        requiredValue: keywords.join(', '),
        status: passed ? 'passed' : 'failed',
        isMandatory: rule.isMandatory,
        explanation: passed
          ? `Your enrolled course (${profile.course}) qualifies under the designated target disciplines.`
          : `This funding is reserved for ${keywords.join(', ')}. Your current program is ${profile.course}.`,
      };
    }

    case 'gender': {
      const requiredGender = String(rule.requiredValue);
      const studentGender = profile.gender;

      if (requiredGender.toLowerCase() === 'all') {
        return {
          ruleId: rule.id,
          ruleName: 'Gender Eligibility',
          studentValue: studentGender || 'Any',
          requiredValue: 'Open to All Genders',
          status: 'passed',
          isMandatory: rule.isMandatory,
          explanation: 'Open to all applicants regardless of gender.',
        };
      }

      if (!studentGender) {
        return {
          ruleId: rule.id,
          ruleName: 'Gender Eligibility',
          studentValue: 'Not specified in profile',
          requiredValue: requiredGender,
          status: 'missing_info',
          isMandatory: rule.isMandatory,
          explanation: 'Gender is not specified in profile.',
        };
      }

      const passed = studentGender.toLowerCase() === requiredGender.toLowerCase();
      return {
        ruleId: rule.id,
        ruleName: 'Gender Eligibility',
        studentValue: studentGender,
        requiredValue: requiredGender,
        status: passed ? 'passed' : 'failed',
        isMandatory: rule.isMandatory,
        explanation: passed
          ? `Applicant gender (${studentGender}) meets the scheme specification.`
          : `Reserved specifically for ${requiredGender} students. Your profile indicates ${studentGender}.`,
      };
    }

    case 'category': {
      const acceptedCategories: string[] = Array.isArray(rule.requiredValue)
        ? rule.requiredValue
        : [rule.requiredValue];
      const studentCat = profile.category;

      if (!studentCat) {
        return {
          ruleId: rule.id,
          ruleName: 'Social / Reservation Category',
          studentValue: 'Not specified in profile',
          requiredValue: acceptedCategories.join(', '),
          status: 'missing_info',
          isMandatory: rule.isMandatory,
          explanation: 'Social category not specified in profile.',
        };
      }

      const passed = acceptedCategories.some(
        (cat) => cat.toLowerCase() === studentCat.toLowerCase()
      );
      return {
        ruleId: rule.id,
        ruleName: 'Social / Reservation Category',
        studentValue: studentCat,
        requiredValue: acceptedCategories.join(', '),
        status: passed ? 'passed' : 'failed',
        isMandatory: rule.isMandatory,
        explanation: passed
          ? `Your category (${studentCat}) is eligible under this affirmative opportunity.`
          : `This affirmative grant requires ${acceptedCategories.join(' or ')}. Profile category is ${studentCat}.`,
      };
    }

    default:
      return {
        ruleId: rule.id,
        ruleName: 'General Requirement',
        studentValue: 'Standard Profile',
        requiredValue: 'Standard Guideline',
        status: 'passed',
        isMandatory: rule.isMandatory,
        explanation: rule.explanation || 'Verified general requirement.',
      };
  }
}

export function assessEligibility(
  scholarship: Scholarship,
  profile: Partial<StudentProfile>,
  isCustomSimulation = false
): EligibilityAssessment {
  const results: RuleEvaluationResult[] = [];

  for (const rule of scholarship.rules) {
    results.push(evaluateRule(rule, profile));
  }

  // Also verify education level against scholarship.educationLevel
  if (scholarship.educationLevel && scholarship.educationLevel.length > 0) {
    const hasEducationRule = scholarship.rules.some((r) => r.ruleType === 'education_level');
    if (!hasEducationRule) {
      const studentLevel = profile.educationLevel;
      if (!studentLevel) {
        results.push({
          ruleId: 'global_edu_level',
          ruleName: 'Target Education Level',
          studentValue: 'Not specified',
          requiredValue: scholarship.educationLevel.join(', '),
          status: 'missing_info',
          isMandatory: true,
          explanation: 'Education level missing from profile.',
        });
      } else {
        const passed = scholarship.educationLevel.includes(studentLevel as any);
        results.push({
          ruleId: 'global_edu_level',
          ruleName: 'Target Education Level',
          studentValue: studentLevel,
          requiredValue: scholarship.educationLevel.join(' or '),
          status: passed ? 'passed' : 'failed',
          isMandatory: true,
          explanation: passed
            ? `Your education level (${studentLevel}) matches the opportunity.`
            : `Opportunity is meant for ${scholarship.educationLevel.join(' or ')}. You are enrolled in ${studentLevel}.`,
        });
      }
    }
  }

  // Also verify State Domicile if not in rules
  if (
    scholarship.eligibleStates &&
    scholarship.eligibleStates.length > 0 &&
    !scholarship.eligibleStates.includes('All India')
  ) {
    const hasStateRule = scholarship.rules.some((r) => r.ruleType === 'eligible_states');
    if (!hasStateRule) {
      const studentState = profile.state;
      if (!studentState) {
        results.push({
          ruleId: 'global_state_domicile',
          ruleName: 'State Domicile Requirement',
          studentValue: 'Not specified',
          requiredValue: scholarship.eligibleStates.join(', '),
          status: 'missing_info',
          isMandatory: true,
          explanation: 'State domicile missing from student profile.',
        });
      } else {
        const passed = scholarship.eligibleStates.some(
          (st) => st.toLowerCase() === studentState.toLowerCase()
        );
        results.push({
          ruleId: 'global_state_domicile',
          ruleName: 'State Domicile Requirement',
          studentValue: studentState,
          requiredValue: scholarship.eligibleStates.join(', '),
          status: passed ? 'passed' : 'failed',
          isMandatory: true,
          explanation: passed
            ? `Domicile state (${studentState}) meets state guideline.`
            : `Restricted to ${scholarship.eligibleStates.join(', ')}.`,
        });
      }
    }
  }

  const passedCount = results.filter((r) => r.status === 'passed').length;
  const failedMandatoryCount = results.filter((r) => r.status === 'failed' && r.isMandatory).length;
  const missingInfoCount = results.filter((r) => r.status === 'missing_info').length;

  let overallStatus: EligibilityStatus = 'eligible';
  if (failedMandatoryCount > 0) {
    overallStatus = 'not_eligible';
  } else if (missingInfoCount > 0) {
    overallStatus = 'potentially_eligible';
  } else {
    overallStatus = 'eligible';
  }

  // Transparent match score calculation
  // Separate eligibility from match score as strictly required:
  // If mandatory rule failed, score is calculated but penalized/capped so students never think they qualify with a high %
  const totalCriteria = results.length || 1;
  const baseRatio = passedCount / totalCriteria;
  let matchScore = Math.round(baseRatio * 90);

  // Bonus for preference alignment
  if (profile.preferences) {
    if (scholarship.category === 'Government' && profile.preferences.government) matchScore += 5;
    if (scholarship.category === 'Private' && profile.preferences.private) matchScore += 5;
    if (scholarship.category === 'Corporate CSR' && profile.preferences.needBased) matchScore += 5;
    if (scholarship.category === 'Research' && profile.preferences.researchGrants) matchScore += 10;
  }

  if (overallStatus === 'not_eligible') {
    matchScore = Math.min(matchScore, 42); // Cap score if mandatory failed
  } else if (overallStatus === 'potentially_eligible') {
    matchScore = Math.min(matchScore, 75);
  } else {
    matchScore = Math.min(Math.max(matchScore, 85), 98);
  }

  return {
    scholarshipId: scholarship.id,
    overallStatus,
    matchScore,
    results,
    passedCount,
    failedMandatoryCount,
    missingInfoCount,
    isCustomSimulation,
  };
}

/**
 * Opportunity Recovery Engine:
 * When student fails eligibility for a scholarship, find the best alternatives that they ARE eligible for!
 */
export function getOpportunityRecovery(
  failedScholarshipId: string,
  profile: Partial<StudentProfile>
): { scholarship: Scholarship; assessment: EligibilityAssessment }[] {
  const alternatives: { scholarship: Scholarship; assessment: EligibilityAssessment }[] = [];

  for (const item of SCHOLARSHIPS_DATA) {
    if (item.id === failedScholarshipId) continue;
    const assessment = assessEligibility(item, profile);
    if (assessment.overallStatus === 'eligible' || assessment.overallStatus === 'potentially_eligible') {
      alternatives.push({ scholarship: item, assessment });
    }
  }

  return alternatives.sort((a, b) => b.assessment.matchScore - a.assessment.matchScore).slice(0, 3);
}

/**
 * Calculate profile completeness percentage (0 - 100%)
 */
export function calculateProfileCompleteness(profile: Partial<StudentProfile>): {
  score: number;
  missingFields: string[];
} {
  const fieldsToCheck: { key: keyof StudentProfile; label: string; weight: number }[] = [
    { key: 'fullName', label: 'Full Legal Name', weight: 10 },
    { key: 'dateOfBirth', label: 'Date of Birth', weight: 5 },
    { key: 'state', label: 'Domicile State', weight: 10 },
    { key: 'district', label: 'District', weight: 5 },
    { key: 'educationLevel', label: 'Current Education Level', weight: 15 },
    { key: 'institution', label: 'College / University Name', weight: 10 },
    { key: 'course', label: 'Degree / Course Stream', weight: 10 },
    { key: 'academicScore', label: 'Latest Academic Score (%)', weight: 15 },
    { key: 'annualFamilyIncome', label: 'Annual Household Income', weight: 15 },
    { key: 'category', label: 'Social Category', weight: 5 },
  ];

  let totalScore = 0;
  const missingFields: string[] = [];

  for (const f of fieldsToCheck) {
    const val = profile[f.key];
    if (val !== undefined && val !== null && val !== '') {
      totalScore += f.weight;
    } else {
      missingFields.push(f.label);
    }
  }

  return {
    score: Math.min(100, Math.round(totalScore)),
    missingFields,
  };
}
