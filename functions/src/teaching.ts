import { onCall, HttpsError } from 'firebase-functions/v2/https';
import { forClass } from '../../shared/model';
import { Firestore } from 'firebase-admin/firestore';
export const MI_TEACHING_COURSE = '115-1-MI-國考精準對焦';
export function createTeachingHandlers(
  db: Firestore,
  access: (req: any, id: string, teacher?: boolean) => Promise<any>,
  options: any,
) {
  const check = (req: any) => {
    if (req.data?.courseId !== MI_TEACHING_COURSE)
      throw new HttpsError('failed-precondition', '此授課簡報僅供115-MI課程使用');
  };
  return {
    getTeachingDeck: onCall(options, async (req) => {
      check(req);
      await access(req, req.data.courseId, true);
      const asset = (await db.doc(`courses/${req.data.courseId}/teacherAssets/presentation`).get()).data();
      if (!asset) throw new HttpsError('failed-precondition', '教師簡報尚未匯入');
      return { title: asset.title, slides: asset.slides };
    }),
    getClassroomCourse: onCall(options, async (req) => {
      check(req);
      const { p, c } = await access(req, req.data.courseId);
      if (p.teacher) throw new HttpsError('permission-denied', '此入口供學生更新課堂進度');
      return {
        ...forClass(c.published, p.classId),
        id: req.data.courseId,
        enrollmentClassId: p.classId,
        studentName: p.name || '',
      };
    }),
  };
}
