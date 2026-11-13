import { describe, it, expect } from 'vitest';
import {
  computeStudentScore,
  computeSubjectPositions,
  computeClassTermResults,
  validateSchemeTotalMarks,
  matchGradeBand,
  formatOrdinal,
  DEFAULT_WAEC_GRADE_BANDS,
  DEFAULT_LETTER_GRADE_BANDS,
  DEFAULT_CA_COMPONENTS,
  GradingSchemeConfig,
} from '../../lib/grading/engine';
import fixtureData from '../fixtures/grading.json';

describe('Grading Engine Contract (Section 8)', () => {
  const sampleScheme: GradingSchemeConfig = fixtureData.scheme as GradingSchemeConfig;

  describe('8.1 Scheme Validation Rules', () => {
    it('sum(caComponents[].max) + examMax === 100. Reject scheme save otherwise.', () => {
      expect(validateSchemeTotalMarks(sampleScheme.caComponents, sampleScheme.examMax)).toBe(true);
      expect(validateSchemeTotalMarks(sampleScheme.caComponents, 55)).toBe(false);
      expect(validateSchemeTotalMarks(sampleScheme.caComponents, 65)).toBe(false);
    });
  });

  describe('8.2 & 8.3 Grade Band Matching & Presets', () => {
    it('matches WAEC 9-point scale bands accurately', () => {
      expect(matchGradeBand(100, DEFAULT_WAEC_GRADE_BANDS)?.grade).toBe('A1');
      expect(matchGradeBand(75, DEFAULT_WAEC_GRADE_BANDS)?.grade).toBe('A1');
      expect(matchGradeBand(74, DEFAULT_WAEC_GRADE_BANDS)?.grade).toBe('B2');
      expect(matchGradeBand(70, DEFAULT_WAEC_GRADE_BANDS)?.grade).toBe('B2');
      expect(matchGradeBand(69, DEFAULT_WAEC_GRADE_BANDS)?.grade).toBe('B3');
      expect(matchGradeBand(65, DEFAULT_WAEC_GRADE_BANDS)?.grade).toBe('B3');
      expect(matchGradeBand(64, DEFAULT_WAEC_GRADE_BANDS)?.grade).toBe('C4');
      expect(matchGradeBand(60, DEFAULT_WAEC_GRADE_BANDS)?.grade).toBe('C4');
      expect(matchGradeBand(59, DEFAULT_WAEC_GRADE_BANDS)?.grade).toBe('C5');
      expect(matchGradeBand(55, DEFAULT_WAEC_GRADE_BANDS)?.grade).toBe('C5');
      expect(matchGradeBand(54, DEFAULT_WAEC_GRADE_BANDS)?.grade).toBe('C6');
      expect(matchGradeBand(50, DEFAULT_WAEC_GRADE_BANDS)?.grade).toBe('C6');
      expect(matchGradeBand(49, DEFAULT_WAEC_GRADE_BANDS)?.grade).toBe('D7');
      expect(matchGradeBand(45, DEFAULT_WAEC_GRADE_BANDS)?.grade).toBe('D7');
      expect(matchGradeBand(44, DEFAULT_WAEC_GRADE_BANDS)?.grade).toBe('E8');
      expect(matchGradeBand(40, DEFAULT_WAEC_GRADE_BANDS)?.grade).toBe('E8');
      expect(matchGradeBand(39, DEFAULT_WAEC_GRADE_BANDS)?.grade).toBe('F9');
      expect(matchGradeBand(0, DEFAULT_WAEC_GRADE_BANDS)?.grade).toBe('F9');
    });

    it('matches Letter A-F scale bands with Section 8.3 remarks (E is Pass)', () => {
      expect(matchGradeBand(85, DEFAULT_LETTER_GRADE_BANDS)).toEqual({
        min: 70, max: 100, grade: 'A', remark: 'Excellent', points: 1,
      });
      expect(matchGradeBand(65, DEFAULT_LETTER_GRADE_BANDS)).toEqual({
        min: 60, max: 69, grade: 'B', remark: 'Very Good', points: 2,
      });
      expect(matchGradeBand(55, DEFAULT_LETTER_GRADE_BANDS)).toEqual({
        min: 50, max: 59, grade: 'C', remark: 'Good', points: 3,
      });
      expect(matchGradeBand(48, DEFAULT_LETTER_GRADE_BANDS)).toEqual({
        min: 45, max: 49, grade: 'D', remark: 'Fair', points: 4,
      });
      expect(matchGradeBand(42, DEFAULT_LETTER_GRADE_BANDS)).toEqual({
        min: 40, max: 44, grade: 'E', remark: 'Pass', points: 5,
      });
      expect(matchGradeBand(25, DEFAULT_LETTER_GRADE_BANDS)).toEqual({
        min: 0, max: 39, grade: 'F', remark: 'Fail', points: 6,
      });
    });
  });

  describe('8.2 Score Computation & Score Bounds', () => {
    it('computes subjectTotal = sum(caScores) + examScore and clamps to component.max', () => {
      const studentInput = {
        studentId: 'stud-1',
        caScores: { test1: 8, test2: 9, assignment: 18 },
        examScore: 50,
      };
      const result = computeStudentScore(studentInput, sampleScheme);
      expect(result.caTotal).toBe(35);
      expect(result.examScore).toBe(50);
      expect(result.totalScore).toBe(85);
      expect(result.grade).toBe('A1');
      expect(result.points).toBe(1);
    });

    it('enforces score boundaries (0 <= CA <= max, 0 <= exam <= examMax)', () => {
      const overInput = {
        studentId: 'stud-over',
        caScores: { test1: 20, test2: 15, assignment: 30 }, // max are 10, 10, 20
        examScore: 80, // examMax is 60
      };
      const result = computeStudentScore(overInput, sampleScheme);
      expect(result.caTotal).toBe(40);
      expect(result.examScore).toBe(60);
      expect(result.totalScore).toBe(100);
      expect(result.grade).toBe('A1');
    });

    it('handles negative inputs by clamping to 0', () => {
      const negInput = {
        studentId: 'stud-neg',
        caScores: { test1: -5, test2: 0, assignment: -2 },
        examScore: -10,
      };
      const result = computeStudentScore(negInput, sampleScheme);
      expect(result.caTotal).toBe(0);
      expect(result.examScore).toBe(0);
      expect(result.totalScore).toBe(0);
      expect(result.grade).toBe('F9');
    });

    it('returns null totals and grades for unentered students', () => {
      const emptyInput = {
        studentId: 'stud-none',
        caScores: {},
        examScore: null,
      };
      const result = computeStudentScore(emptyInput, sampleScheme);
      expect(result.totalScore).toBeNull();
      expect(result.grade).toBeNull();
      expect(result.points).toBeNull();
    });
  });

  describe('8.4 Position Computation with Fixture [95, 90, 90, 85] -> [1, 2, 2, 4]', () => {
    it('verifies subject competition ranking against json fixture', () => {
      const inputs = fixtureData.subjectTieFixture.map(item => ({
        studentId: item.studentId,
        caScores: item.caScores,
        examScore: item.examScore,
      }));

      const computed = inputs.map(input => computeStudentScore(input, sampleScheme));
      const ranked = computeSubjectPositions(computed);

      for (const expected of fixtureData.subjectTieFixture) {
        const student = ranked.find(r => r.studentId === expected.studentId);
        expect(student).toBeDefined();
        expect(student?.totalScore).toBe(expected.expectedTotal);
        expect(student?.grade).toBe(expected.expectedGrade);
        expect(student?.subjectPosition).toBe(expected.expectedPosition);
      }
    });

    it('verifies class positions exclude incomplete students (Section 8.4 contract)', () => {
      const fixtureStudents = fixtureData.classRankingFixture.students;
      const studentMap = new Map();

      for (const s of fixtureStudents) {
        studentMap.set(
          s.studentId,
          s.scores.map(sc => ({
            studentId: s.studentId,
            totalScore: sc.total,
            grade: sc.total !== null ? matchGradeBand(sc.total, sampleScheme.gradeBands)?.grade : null,
          }))
        );
      }

      const results = computeClassTermResults('class-jss1a', 'term-1', studentMap as any, 2);

      // Total students evaluated
      expect(results.length).toBe(5);

      for (const expected of fixtureStudents) {
        const studentResult = results.find(r => r.studentId === expected.studentId);
        expect(studentResult).toBeDefined();
        expect(studentResult?.isIncomplete).toBe(expected.isIncomplete);

        if (expected.isIncomplete) {
          expect(studentResult?.average).toBeNull();
          expect(studentResult?.positionInClass).toBeNull();
        } else {
          expect(studentResult?.average).toBe(expected.expectedAverage);
          expect(studentResult?.positionInClass).toBe(expected.expectedPosition);
        }
      }
    });
  });

  describe('Ordinal Formatter', () => {
    it('formats positions with standard English suffixes', () => {
      expect(formatOrdinal(1)).toBe('1st');
      expect(formatOrdinal(2)).toBe('2nd');
      expect(formatOrdinal(3)).toBe('3rd');
      expect(formatOrdinal(4)).toBe('4th');
      expect(formatOrdinal(11)).toBe('11th');
      expect(formatOrdinal(21)).toBe('21st');
      expect(formatOrdinal(null)).toBe('-');
    });
  });
});
