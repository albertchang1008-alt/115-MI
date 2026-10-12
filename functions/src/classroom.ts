import { randomUUID } from 'node:crypto';
import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { Firestore } from 'firebase-admin/firestore';
import {
  interactions,
  MI_CLASSROOM_COURSE,
  PollRound,
  validateResponses,
  tally,
  visibleRound,
} from '../../shared/classroom';
export function createClassroomHandlers(
  db: Firestore,
  access: (req: any, id: string, teacher?: boolean) => Promise<any>,
  options: any,
) {
  const authorize = async (req: any, teacher = false) => {
    if (req.data?.courseId !== MI_CLASSROOM_COURSE)
      throw new HttpsError('permission-denied', '此課堂互動僅供115-MI課程');
    return access(req, req.data.courseId, teacher);
  };
  const state = () => db.doc(`courses/${MI_CLASSROOM_COURSE}/classroomState/current`);
  const rounds = () => db.collection(`courses/${MI_CLASSROOM_COURSE}/classroomRounds`);
  const ref = (id: unknown) => {
    if (typeof id !== 'string' || !/^[a-zA-Z0-9-]{1,80}$/.test(id))
      throw new HttpsError('invalid-argument', '互動場次無效');
    return rounds().doc(id);
  };
  return {
    controlClassroomInteraction: onCall(options, async (req) => {
      const { c } = await authorize(req, true);
      const { action } = req.data;
      if (!['open', 'close'].includes(action)) throw new HttpsError('invalid-argument', '操作無效');
      if (action === 'open') {
        const def = interactions.find((q) => q.slideId === req.data.slideId);
        const classes = req.data.classIds;
        if (
          !def ||
          !Array.isArray(classes) ||
          !classes.length ||
          classes.some((x) => typeof x !== 'string' || !c.classIds.includes(x))
        )
          throw new HttpsError('invalid-argument', '請選擇題目及參與班級');
        const id = randomUUID(),
          target = ref(id);
        return db.runTransaction(async (tx) => {
          const current = (await tx.get(state())).data();
          if (current?.openRoundId) throw new HttpsError('failed-precondition', '請先結束目前互動');
          const number = (current?.numbers?.[def.slideId] || 0) + 1;
          const round: PollRound = {
            id,
            ...def,
            classIds: [...new Set(classes)] as string[],
            number,
            status: 'open',
            openedAt: Date.now(),
            total: 0,
            counts: {},
          };
          tx.set(target, round);
          tx.set(state(), {
            openRoundId: id,
            latestRoundId: id,
            numbers: { ...(current?.numbers || {}), [def.slideId]: number },
          });
          return { round };
        });
      }
      const target = ref(req.data.roundId);
      return db.runTransaction(async (tx) => {
        const current = (await tx.get(state())).data();
        const round = (await tx.get(target)).data() as PollRound | undefined;
        if (!round) throw new HttpsError('not-found', '互動不存在');
        if (action === 'close') {
          if (round.status === 'closed') return { round };
          round.status = 'closed';
          round.closedAt = Date.now();
          if (current?.openRoundId === round.id) tx.set(state(), { ...current, openRoundId: '' });
        }
        tx.set(target, round);
        return { round: visibleRound(round) };
      });
    }),
    getClassroomInteraction: onCall(options, async (req) => {
      const { p } = await authorize(req);
      if (p.teacher) throw new HttpsError('permission-denied', '此入口供學生使用');
      const current = (await state().get()).data();
      if (!current?.latestRoundId) return { round: null };
      const target = ref(current.latestRoundId),
        round = (await target.get()).data() as PollRound;
      if (!round || !round.classIds.includes(p.classId)) return { round: null };
      const response = (await target.collection('responses').doc(p.uid).get()).data();
      const { counts, total, ...prompt } = round;
      return {
        round: prompt,
        submitted: !!response,
        answers: response?.answers || null,
        ...(round.status === 'closed' ? { results: visibleRound(round) } : {}),
      };
    }),
    submitClassroomInteraction: onCall(options, async (req) => {
      const { p } = await authorize(req);
      if (p.teacher) throw new HttpsError('permission-denied', '教師不建立學生作答');
      const target = ref(req.data.roundId),
        response = target.collection('responses').doc(p.uid);
      return db.runTransaction(async (tx) => {
        const round = (await tx.get(target)).data() as PollRound | undefined;
        const existing = (await tx.get(response)).data();
        if (!round || !round.classIds.includes(p.classId))
          throw new HttpsError('permission-denied', '不屬於此互動班級');
        if (existing) return { submitted: true, answers: existing.answers };
        if (round.status !== 'open') throw new HttpsError('failed-precondition', '教師已結束作答');
        // Bound a round document well below Firestore's 1MiB limit, using only fixed-choice statistics.
        if (round.total >= 200) throw new HttpsError('resource-exhausted', '此輪人數已達上限');
        let answers;
        try {
          answers = validateResponses(round, req.data.answers);
        } catch (e) {
          throw new HttpsError('invalid-argument', (e as Error).message);
        }
        tx.set(response, {
          answers,
          submittedAt: Date.now(),
          uid: p.uid,
          classId: p.classId,
          name: p.name || '',
          studentId: p.studentId || '',
        });
        tx.set(target, tally(round, answers));
        return { submitted: true, answers };
      });
    }),
    classroomInteractionReport: onCall(options, async (req) => {
      await authorize(req, true);
      const current = (await state().get()).data();
      const id = req.data.roundId || current?.latestRoundId;
      const selected = id ? ((await ref(id).get()).data() as PollRound) : undefined;
      const result: any = { round: selected ? visibleRound(selected) : null };
      if (req.data.history === true) {
        const list = await rounds().orderBy('openedAt', 'desc').limit(100).get();
        result.rounds = list.docs.map((d) => {
          const { id, title, slideId, number, status, classIds, total } = d.data();
          return { id, title, slideId, number, status, classIds, total };
        });
      }
      return result;
    }),
    classroomInteractionRecords: onCall(options, async (req) => {
      await authorize(req, true);
      const target = ref(req.data.roundId);
      const list = await target.collection('responses').get();
      return { rows: list.docs.map((d) => d.data()) };
    }),
  };
}
