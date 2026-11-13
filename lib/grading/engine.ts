/**
 * Section 8 Contract: Pure Grading and Computation Engine
 * Deterministic calculation functions for ReportCard
 */

export interface CAComponentConfig {
  key: string;
  label: string;
  max: number;
}

export interface GradeBandConfig {
  min: number;
  max: number;
  grade: string;
  remark: string;
  points?: number;
}

export interface GradingSchemeConfig {
  scaleType: 'WAEC_9POINT' | 'LETTER_AF' | 'CUSTOM';
  caComponents: CAComponentConfig[];
  examMax: number;
  gradeBands: GradeBandConfig[];
}

export interface StudentScoreInput {
  studentId: string;
  caScores: Record<string, number | null | undefined>;
  examScore?: number | null;
}

export interface ComputedScoreRecord {
  studentId: string;
  caTotal: number;
  examScore: number | null;
  totalScore: number | null;
  grade: string | null;
  remark: string | null;
  points: number | null;
  subjectPosition?: number | null;
}

export interface StudentTermAggregate {
  studentId: string;
  classId: string;
  totalScore: number | null;
  average: number | null;
  subjectsCount: number;
  positionInClass: number | null;
  classSize: number;
  isIncomplete: boolean;
}

/**
 * Standard Nigerian WAEC 9-point default scale
 */
export const DEFAULT_WAEC_GRADE_BANDS: GradeBandConfig[] = [
  { min: 75, max: 100, grade: 'A1', remark: 'Excellent', points: 1 },
  { min: 70, max: 74, grade: 'B2', remark: 'Very Good', points: 2 },
  { min: 65, max: 69, grade: 'B3', remark: 'Good', points: 3 },
  { min: 60, max: 64, grade: 'C4', remark: 'Credit', points: 4 },
  { min: 55, max: 59, grade: 'C5', remark: 'Credit', points: 5 },
  { min: 50, max: 54, grade: 'C6', remark: 'Credit', points: 6 },
  { min: 45, max: 49, grade: 'D7', remark: 'Pass', points: 7 },
  { min: 40, max: 44, grade: 'E8', remark: 'Pass', points: 8 },
  { min: 0, max: 39, grade: 'F9', remark: 'Fail', points: 9 },
];

/**
 * Standard Letter A-F default scale
 */
export const DEFAULT_LETTER_GRADE_BANDS: GradeBandConfig[] = [
  { min: 70, max: 100, grade: 'A', remark: 'Excellent', points: 1 },
  { min: 60, max: 69, grade: 'B', remark: 'Very Good', points: 2 },
  { min: 50, max: 59, grade: 'C', remark: 'Good', points: 3 },
  { min: 45, max: 49, grade: 'D', remark: 'Fair', points: 4 },
  { min: 40, max: 44, grade: 'E', remark: 'Pass', points: 5 },
  { min: 0, max: 39, grade: 'F', remark: 'Fail', points: 6 },
];

export const DEFAULT_CA_COMPONENTS: CAComponentConfig[] = [
  { key: 'test1', label: '1st CA Test', max: 10 },
  { key: 'test2', label: '2nd CA Test', max: 10 },
  { key: 'assignment', label: 'Assignment / Project', max: 20 },
];

export const DEFAULT_EXAM_MAX = 60;

/**
 * Validates that CA component maximums + examMax = 100
 */
export function validateSchemeTotalMarks(caComponents: CAComponentConfig[], examMax: number): boolean {
  const caSum = caComponents.reduce((sum, c) => sum + (Number(c.max) || 0), 0);
  return caSum + examMax === 100;
}

/**
 * Determines grade band for a total score (0 - 100)
 */
export function matchGradeBand(score: number, bands: GradeBandConfig[]): GradeBandConfig | null {
  const clamped = Math.max(0, Math.min(100, Math.round(score)));
  for (const band of bands) {
    if (clamped >= band.min && clamped <= band.max) {
      return band;
    }
  }
  return null;
}

/**
 * Computes single student's score in a subject
 */
export function computeStudentScore(
  input: StudentScoreInput,
  scheme: GradingSchemeConfig
): ComputedScoreRecord {
  let caTotal = 0;
  let hasAnyInput = false;

  for (const comp of scheme.caComponents) {
    const val = input.caScores?.[comp.key];
    if (val !== null && val !== undefined && !isNaN(Number(val))) {
      const num = Math.min(comp.max, Math.max(0, Number(val)));
      caTotal += num;
      hasAnyInput = true;
    }
  }

  const examVal = input.examScore;
  const hasExam = examVal !== null && examVal !== undefined && !isNaN(Number(examVal));
  const validExam = hasExam ? Math.min(scheme.examMax, Math.max(0, Number(examVal))) : null;

  if (hasExam) {
    hasAnyInput = true;
  }

  if (!hasAnyInput) {
    return {
      studentId: input.studentId,
      caTotal: 0,
      examScore: null,
      totalScore: null,
      grade: null,
      remark: null,
      points: null,
      subjectPosition: null,
    };
  }

  const total = caTotal + (validExam ?? 0);
  const matched = matchGradeBand(total, scheme.gradeBands);

  return {
    studentId: input.studentId,
    caTotal: Math.round(caTotal * 10) / 10,
    examScore: validExam,
    totalScore: Math.round(total),
    grade: matched ? matched.grade : null,
    remark: matched ? matched.remark : null,
    points: matched?.points ?? null,
  };
}

/**
 * Computes subject positions using standard competition ranking (1224)
 */
export function computeSubjectPositions(records: ComputedScoreRecord[]): ComputedScoreRecord[] {
  // Filter scored vs unscored
  const scored = records.filter(r => r.totalScore !== null);
  const unscored = records.filter(r => r.totalScore === null);

  // Sort scored descending
  scored.sort((a, b) => (b.totalScore ?? 0) - (a.totalScore ?? 0));

  let currentRank = 1;
  for (let i = 0; i < scored.length; i++) {
    if (i > 0 && scored[i].totalScore === scored[i - 1].totalScore) {
      scored[i].subjectPosition = scored[i - 1].subjectPosition;
    } else {
      scored[i].subjectPosition = currentRank;
    }
    currentRank++;
  }

  // Unscored students receive null position
  for (const u of unscored) {
    u.subjectPosition = null;
  }

  return [...scored, ...unscored];
}

/**
 * Computes class-wide term results and student positions
 * Competition ranking (1224) based on student average score
 */
export function computeClassTermResults(
  classId: string,
  termId: string,
  scoresByStudent: Map<string, ComputedScoreRecord[]>,
  expectedSubjectCount?: number
): StudentTermAggregate[] {
  const completeList: StudentTermAggregate[] = [];
  const incompleteList: StudentTermAggregate[] = [];
  const classSize = scoresByStudent.size;

  scoresByStudent.forEach((scores: ComputedScoreRecord[], studentId: string) => {
    const hasAnyMissing = scores.some((s: ComputedScoreRecord) => s.totalScore === null || s.totalScore === undefined);
    const validScores = scores.filter((s: ComputedScoreRecord) => s.totalScore !== null && s.totalScore !== undefined);
    const count = validScores.length;
    const isUnderCount = expectedSubjectCount !== undefined && count < expectedSubjectCount;

    if (hasAnyMissing || isUnderCount || count === 0) {
      incompleteList.push({
        studentId,
        classId,
        totalScore: count > 0 ? validScores.reduce((sum: number, s: ComputedScoreRecord) => sum + (s.totalScore ?? 0), 0) : null,
        average: null,
        subjectsCount: count,
        positionInClass: null,
        classSize,
        isIncomplete: true,
      });
    } else {
      const total = validScores.reduce((sum: number, s: ComputedScoreRecord) => sum + (s.totalScore ?? 0), 0);
      const average = Math.round((total / count) * 100) / 100;

      completeList.push({
        studentId,
        classId,
        totalScore: total,
        average,
        subjectsCount: count,
        positionInClass: null,
        classSize,
        isIncomplete: false,
      });
    }
  });

  // Sort complete students descending by average, then totalScore
  completeList.sort((a, b) => {
    if ((b.average ?? 0) !== (a.average ?? 0)) {
      return (b.average ?? 0) - (a.average ?? 0);
    }
    return (b.totalScore ?? 0) - (a.totalScore ?? 0);
  });

  // Assign standard competition rank (1224)
  let currentRank = 1;
  for (let i = 0; i < completeList.length; i++) {
    if (
      i > 0 &&
      completeList[i].average === completeList[i - 1].average &&
      completeList[i].totalScore === completeList[i - 1].totalScore
    ) {
      completeList[i].positionInClass = completeList[i - 1].positionInClass;
    } else {
      completeList[i].positionInClass = currentRank;
    }
    currentRank++;
  }

  return [...completeList, ...incompleteList];
}

/**
 * Format position number with ordinal suffix (e.g. 1st, 2nd, 3rd, 4th)
 */
export function formatOrdinal(n: number | null | undefined): string {
  if (!n || n < 1) return '-';
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
