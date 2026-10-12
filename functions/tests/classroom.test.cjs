const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createClassroomHandlers } = require('../lib/functions/src/classroom.js');
const { MI_CLASSROOM_COURSE, interactions } = require('../lib/shared/classroom.js');
function setup() {
  const docs = new Map();
  let queue = Promise.resolve();
  const snap = (path) => ({
    data: () => (docs.has(path) ? structuredClone(docs.get(path)) : undefined),
  });
  const collection = (path) => ({
    doc: (id) => ref(path + '/' + id),
    orderBy: () => ({
      limit: () => ({
        get: async () => ({
          docs: [...docs.keys()]
            .filter((k) => k.startsWith(path + '/') && !k.slice(path.length + 1).includes('/'))
            .map((k) => snap(k))
            .sort((a, b) => b.data().openedAt - a.data().openedAt)
            .slice(0, 100),
        }),
      }),
    }),
    get: async () => ({
      docs: [...docs.keys()]
        .filter((k) => k.startsWith(path + '/') && !k.slice(path.length + 1).includes('/'))
        .map((k) => snap(k)),
    }),
  });
  const ref = (path) => ({
    path,
    get: async () => snap(path),
    collection: (name) => collection(path + '/' + name),
  });
  const db = {
    doc: ref,
    collection,
    runTransaction: async (fn) => {
      let release;
      const prior = queue;
      queue = new Promise((r) => (release = r));
      await prior;
      const writes = [];
      try {
        const out = await fn({
          get: async (r) => {
            assert.equal(writes.length, 0, 'all reads before writes');
            return snap(r.path);
          },
          set: (r, v) => writes.push([r.path, structuredClone(v)]),
        });
        writes.forEach(([k, v]) => docs.set(k, v));
        return out;
      } finally {
        release();
      }
    },
  };
  const access = async (req, id, teacher) => {
    if (!req.auth) throw Error('unauthenticated');
    if (teacher && (!req.auth.teacher || req.auth.uid !== 'owner')) throw Error('permission');
    return { p: req.auth, c: { classIds: ['A', 'B'] } };
  };
  const h = createClassroomHandlers(db, access, { region: 'asia-east1' });
  const call = (name, data = {}, auth = { uid: 'owner', teacher: true }) =>
    h[name].run({ data: { courseId: MI_CLASSROOM_COURSE, ...data }, auth });
  const student = (i) => ({ uid: 's' + i, classId: 'A', name: '學生' + i, studentId: 'ID' + i });
  return { docs, call, student };
}
test('教師限定操作；學生跨班／跨課程／未登入被拒絕，未公布不含統計或私有答案', async () => {
  const { call, student } = setup();
  const open = { action: 'open', slideId: 'c1-toxin', classIds: ['A'] };
  for (const auth of [null, student(1), { uid: 'other', teacher: true }])
    await assert.rejects(call('controlClassroomInteraction', open, auth));
  await assert.rejects(call('controlClassroomInteraction', { ...open, courseId: 'AP2' }));
  await assert.rejects(call('controlClassroomInteraction', { ...open, classIds: ['C'] }));
  const { round } = await call('controlClassroomInteraction', open);
  const a = await call('getClassroomInteraction', {}, student(1));
  assert.equal(a.round.id, round.id);
  for (const key of ['counts', 'texts', 'total', 'notes', 'html', 'answer', 'results'])
    assert(!JSON.stringify(a).includes('"' + key + '"'));
  assert.equal(
    (await call('getClassroomInteraction', {}, { ...student(2), classId: 'B' })).round,
    null,
  );
  await assert.rejects(
    call(
      'submitClassroomInteraction',
      { roundId: round.id, answers: { pick: '內毒素' } },
      { ...student(2), classId: 'B' },
    ),
  );
  for (const name of ['classroomInteractionReport', 'classroomInteractionRecords'])
    await assert.rejects(call(name, { roundId: round.id }, student(1)));
  await assert.rejects(call('getClassroomInteraction', {}, null));
});
test('54人併發提交／重送只計一份、答案鎖定、關閉阻止新提交，兩輪與私人紀錄分開', async () => {
  const { call, student, docs } = setup();
  const { round } = await call('controlClassroomInteraction', {
    action: 'open',
    slideId: 'c1-toxin',
    classIds: ['A'],
  });
  await assert.rejects(
    call('controlClassroomInteraction', { action: 'open', slideId: 'c2-predict', classIds: ['A'] }),
  );
  await assert.rejects(
    call(
      'submitClassroomInteraction',
      { roundId: round.id, answers: { pick: '內毒素', reason: '自由文字' } },
      student(99),
    ),
  );
  assert.equal((await call('classroomInteractionReport')).round.total, 0);
  const submit = (i) =>
    call(
      'submitClassroomInteraction',
      {
        roundId: round.id,
        answers: { pick: i % 2 ? '內毒素' : '外毒素', reason: round.fields[1].options[0] },
      },
      student(i),
    );
  await Promise.all(Array.from({ length: 54 }, (_, i) => Promise.all([submit(i), submit(i)])));
  const locked = await call(
    'submitClassroomInteraction',
    { roundId: round.id, answers: { pick: '內毒素', reason: round.fields[1].options[1] } },
    student(0),
  );
  assert.equal(locked.answers.pick, '外毒素');
  const result = await call('classroomInteractionReport');
  assert.equal(result.round.total, 54);
  assert.deepEqual(result.round.counts.pick, [27, 27]);
  assert(!('texts' in result.round));
  assert.deepEqual(result.round.counts.reason, [54, 0, 0, 0]);
  assert(!JSON.stringify(result).includes('學生0'));
  assert(!JSON.stringify(result).includes('s0'));
  await assert.rejects(call('controlClassroomInteraction', { action: 'hide', roundId: round.id }));
  await call('controlClassroomInteraction', { action: 'close', roundId: round.id });
  await assert.rejects(submit(60));
  assert.equal((await submit(0)).submitted, true);
  assert.equal((await call('getClassroomInteraction', {}, student(0))).results.total, 54);
  const rows = (await call('classroomInteractionRecords', { roundId: round.id })).rows;
  assert.equal(rows.length, 54);
  assert(rows.some((r) => r.name === '學生0'));
  const next = await call('controlClassroomInteraction', {
    action: 'open',
    slideId: 'c1-toxin',
    classIds: ['A'],
  });
  assert.equal(next.round.number, 2);
  assert.equal(next.round.total, 0);
  assert.equal((await call('getClassroomInteraction', {}, student(0))).submitted, false);
  assert.equal((await call('classroomInteractionReport', { roundId: round.id })).round.total, 54);
  assert(
    [...docs.keys()].every((p) => p.includes('/classroom')),
    'no exam/progress writes',
  );
});
test('收票與提交競爭序列化；無效作答不計票', async () => {
  const { call, student } = setup();
  const { round } = await call('controlClassroomInteraction', {
    action: 'open',
    slideId: 'c1-predict',
    classIds: ['A'],
  });
  await assert.rejects(
    call(
      'submitClassroomInteraction',
      { roundId: round.id, answers: { pick: '假選項' } },
      student(1),
    ),
  );
  await assert.rejects(call('controlClassroomInteraction', { action: 'bogus', roundId: round.id }));
  await Promise.all([
    call('controlClassroomInteraction', { action: 'close', roundId: round.id }),
    assert.rejects(
      call(
        'submitClassroomInteraction',
        { roundId: round.id, answers: { pick: round.fields[0].options[0] } },
        student(1),
      ),
    ),
  ]);
  assert.equal((await call('classroomInteractionReport')).round.total, 0);
});
