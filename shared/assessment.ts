import { Question } from './model';
export type ExamKind = 'pretest' | 'posttest';
export const MI_EXAM_IDS = {
  pretest: [
    '110-2-r0247',
    '106-2-r0061',
    '106-2-r0085',
    '106-1-r0036',
    '105-2-r0021',
    '109-1-r0192',
    '106-1-r0042',
  ].map((x) => `micro-${x}`),
  posttest: [
    '113-2-r0351',
    '107-2-r0129',
    '113-3-r0364',
    '110-2-r0257',
    '106-2-r0086',
    '110-2-r0254',
    '107-1-r0110',
  ].map((x) => `micro-${x}`),
};
export type ExamQuestion = Pick<Question, 'id' | 'text' | 'options'> & { image?: string };
export function publicExamQuestion(q: Question): ExamQuestion {
  return {
    id: q.id,
    text: q.text,
    options: q.options.map((o) => ({ id: o.id, text: o.text })),
    ...(q.image ? { image: q.image } : {}),
  };
}
export function examAnswers(questions: Question[], raw: unknown): Record<string, string> {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw Error('選答格式錯誤');
  const answers = raw as Record<string, unknown>,
    out: Record<string, string> = {};
  for (const [qid, value] of Object.entries(answers)) {
    const q = questions.find((q) => q.id === qid);
    if (!q || typeof value !== 'string' || !q.options.some((o) => o.id === value))
      throw Error('題目或選項不屬於本試卷');
    out[qid] = value;
  }
  return out;
}
export function examGrade(questions: Question[], answers: Record<string, string>) {
  const correct = questions.filter((q) => answers[q.id] === q.answer).length;
  return {
    correct,
    total: questions.length,
    score: Math.round((correct / questions.length) * 100),
  };
}
