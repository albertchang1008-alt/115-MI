import { useEffect, useState, useRef } from 'react';
import { API } from './service';
import { Course } from '../shared/model';
import {
  Interaction,
  MI_CLASSROOM_COURSE,
  PollRound,
  Responses,
  interactions,
  validateResponses,
} from '../shared/classroom';
/** Serial polling: never overlap requests or apply a late response after unmount/course change. */
function usePoll(
  task: (alive: () => boolean) => Promise<void>,
  dependencies: unknown[],
  delay: number,
) {
  useEffect(() => {
    let disposed = false,
      timer: ReturnType<typeof setTimeout>;
    const run = async () => {
      try {
        if (!disposed) await task(() => !disposed);
      } finally {
        if (!disposed) timer = setTimeout(run, delay);
      }
    };
    void run();
    return () => {
      disposed = true;
      clearTimeout(timer);
    };
  }, dependencies);
}
type StudentRound = Omit<PollRound, 'counts' | 'total'>;
type StudentState = {
  round: StudentRound | null;
  submitted?: boolean;
  answers?: Responses | null;
  results?: PollRound;
};
export function StudentInteraction({ api, course }: { api: API; course: Course }) {
  const [state, setState] = useState<StudentState>({ round: null }),
    [expanded, setExpanded] = useState(false),
    [failure, setFailure] = useState('');
  useEffect(() => {
    setState({ round: null });
    setExpanded(false);
    setFailure('');
  }, [api, course.id]);
  usePoll(
    async (alive) => {
      if (course.id !== MI_CLASSROOM_COURSE || api.preview) return;
      try {
        const r = await api.call<StudentState>('getClassroomInteraction', { courseId: course.id });
        if (alive()) {
          setState((old) =>
            old.round?.id === r.round?.id && old.submitted && !r.submitted
              ? { ...r, submitted: true, answers: old.answers }
              : r,
          );
          setFailure('');
        }
      } catch {
        if (alive()) setFailure('連線中斷，正在重新連線…');
      }
    },
    [api, course.id, state.round?.status],
    state.round?.status === 'open' ? 2000 : 5000,
  );
  if (course.id !== MI_CLASSROOM_COURSE || api.preview) return null;
  return (
    <section className="panel classroom-student" aria-label="目前課堂互動">
      <div className="classroom-heading">
        <div>
          <span className="eyebrow">個人作答 · 不計分</span>
          <h2>目前課堂互動</h2>
        </div>
        {state.round && (
          <button onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
            {expanded ? '收合' : state.submitted ? '查看我的作答' : '進入互動'}
          </button>
        )}
      </div>
      {failure && <p role="alert">{failure}</p>}
      {state.round ? (
        <>
          <p>
            {state.round.title} · 第{state.round.number}輪 ·{' '}
            {state.round.status === 'open'
              ? state.submitted
                ? '已送出，作答已鎖定'
                : '開放作答中'
              : '已結束'}
          </p>
          {expanded && (
            <InteractionForm
              key={state.round.id}
              round={state.round}
              api={api}
              courseId={course.id}
              submitted={!!state.submitted}
              saved={state.answers || undefined}
              onSaved={(answers) =>
                setState((v) =>
                  v.round?.id === state.round?.id ? { ...v, submitted: true, answers } : v,
                )
              }
            />
          )}
          {expanded && state.results && <PollResults round={state.results} />}
        </>
      ) : (
        <p>等待教師開放互動。登入自己的課序即可參加。</p>
      )}
    </section>
  );
}
export function InteractionForm({
  round,
  api,
  courseId,
  submitted,
  saved,
  onSaved,
}: {
  round: StudentRound;
  api: API;
  courseId: string;
  submitted: boolean;
  saved?: Responses;
  onSaved: (answers: Responses) => void;
}) {
  const [answers, setAnswers] = useState<Responses>({}),
    [busy, setBusy] = useState(false),
    [failure, setFailure] = useState('');
  const locked = submitted || round.status === 'closed' || busy;
  const values = submitted ? saved || {} : answers;
  const set = (key: string, value: string | string[]) =>
    setAnswers((old) => ({ ...old, [key]: value }));
  async function send() {
    if (locked) return;
    setFailure('');
    try {
      const input = validateResponses(round, answers);
      setBusy(true);
      const r = await api.call<{ submitted: boolean; answers: Responses }>(
        'submitClassroomInteraction',
        { courseId, roundId: round.id, answers: input },
      );
      if (!r.submitted) throw Error('尚未收到送出確認，請重試');
      onSaved(r.answers);
    } catch (e) {
      setFailure((e as Error).message + '；未確認成功時，請重試送出。');
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="interaction-form">
      <p>請逐項選擇答案，排序題使用下拉選單。送出後不能修改，每人每輪只計一次。</p>
      {round.fields.map((f) => (
        <fieldset key={f.id} disabled={locked} className="interaction-field">
          <legend>{f.label}</legend>
          {f.kind === 'choice' ? (
            <div className="interaction-options">
              {f.options!.map((o, i) => (
                <label key={o}>
                  <input
                    type="radio"
                    name={round.id + '-' + f.id}
                    checked={values[f.id] === o}
                    onChange={() => set(f.id, o)}
                  />
                  <span>
                    {String.fromCharCode(65 + i)}　{o}
                  </span>
                </label>
              ))}
            </div>
          ) : (
            <div>
              {f.options!.map((_, i) => (
                <label className="order-position" key={i}>
                  第{i + 1}步
                  <select
                    aria-label={`第${i + 1}步`}
                    value={((values[f.id] as string[]) || [])[i] || ''}
                    onChange={(e) => {
                      const next = [...((values[f.id] as string[]) || f.options!.map(() => ''))];
                      next[i] = e.target.value;
                      set(f.id, next);
                    }}
                  >
                    <option value="">選擇事件</option>
                    {f.options!.map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          )}
        </fieldset>
      ))}
      {failure && <p role="alert">{failure}</p>}
      {submitted ? (
        <p role="status">已送出，作答已鎖定。等待教師統整。</p>
      ) : round.status === 'closed' ? (
        <p>教師已結束作答，未送出的內容不列入統計。</p>
      ) : (
        <button className="primary" disabled={busy} onClick={() => void send()}>
          {busy ? '正在送出…' : '確認送出並鎖定'}
        </button>
      )}
    </div>
  );
}
export function PollResults({ round }: { round: PollRound }) {
  return (
    <div className="poll-results">
      <div className="poll-results-head">
        <h2>
          {round.title} · 第{round.number}輪
        </h2>
        <p className="poll-total">
          已回覆 <strong>{round.total}</strong> 人 ·{' '}
          {round.status === 'open' ? '即時收票中' : '已結束'} · 每人每輪一份作答
        </p>
      </div>
      <div className="poll-stat-grid">
        {round.fields.map((f) => (
          <section key={f.id} className="poll-stat">
            <h3>{f.label}</h3>
            {(f.kind === 'order' ? f.options!.map((_, i) => i) : [0]).map((position) => (
              <div key={position}>
                {f.kind === 'order' && <h4>第{position + 1}步</h4>}
                {f.options!.map((o, i) => {
                  const n =
                      round.counts[f.kind === 'order' ? f.id + '-' + position : f.id]?.[i] || 0,
                    percent = round.total ? Math.round((n * 100) / round.total) : 0;
                  return (
                    <div className="poll-option" key={o}>
                      <div>
                        <span>{o}</span>
                        <strong>
                          {n}票 · {percent}%
                        </strong>
                      </div>
                      <div className="poll-bar-track">
                        <div style={{ width: percent + '%' }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </section>
        ))}
      </div>
    </div>
  );
}
export function TeacherInteraction({
  api,
  course,
  slideId,
  black,
  privateRecords = false,
}: {
  api: API;
  course: Course;
  slideId: string;
  black: boolean;
  privateRecords?: boolean;
}) {
  const def = interactions.find((d) => d.slideId === slideId),
    [round, setRound] = useState<PollRound | null>(null),
    [history, setHistory] = useState<PollRound[]>([]),
    [selected, setSelected] = useState(''),
    [classes, setClasses] = useState<string[]>(
      course.classIds.filter((id) => id === 'N551' || id === 'N552'),
    ),
    [show, setShow] = useState(false),
    [failure, setFailure] = useState(''),
    [busy, setBusy] = useState(false),
    [records, setRecords] = useState<any[] | null>(null);
  const epoch = useRef(0),
    controls = useRef<HTMLDivElement>(null),
    recordRequest = useRef(0),
    privateAllowed = useRef(privateRecords);
  privateAllowed.current = privateRecords;
  const [footerHeight, setFooterHeight] = useState(220);
  useEffect(() => {
    const root = controls.current,
      playback = root?.parentElement?.querySelector('.teaching-playback');
    if (!root || !playback) return;
    const resize = () =>
      setFooterHeight(
        root.getBoundingClientRect().height + playback.getBoundingClientRect().height,
      );
    const observer = new ResizeObserver(resize);
    observer.observe(root);
    observer.observe(playback);
    resize();
    return () => observer.disconnect();
  }, [privateRecords, api, course.id]);
  useEffect(() => {
    recordRequest.current++;
    setRecords(null);
  }, [privateRecords, round?.id, api, course.id]);
  useEffect(() => {
    setRound(null);
    setHistory([]);
    setSelected('');
    setShow(false);
  }, [api, course.id]);
  usePoll(
    async (alive) => {
      if (api.preview || course.id !== MI_CLASSROOM_COURSE) return;
      const version = epoch.current;
      try {
        const r = await api.call<{ round: PollRound | null; rounds?: PollRound[] }>(
          'classroomInteractionReport',
          { courseId: course.id, ...(selected ? { roundId: selected } : {}) },
        );
        if (alive() && version === epoch.current) {
          setRound(r.round);
          if (r.rounds) setHistory(r.rounds);
          setFailure('');
        }
      } catch {
        if (alive()) setFailure('連線中斷，正在重新連線…');
      }
    },
    [api, course.id, selected],
    2000,
  );
  async function action(action: string) {
    if (busy) return;
    epoch.current++;
    setBusy(true);
    setFailure('');
    try {
      const r = await api.call<{ round: PollRound }>('controlClassroomInteraction', {
        courseId: course.id,
        action,
        slideId,
        classIds: classes,
        roundId: round?.id,
      });
      setRound(r.round);
      setSelected(r.round.id);
      if (action === 'open') setShow(true);
    } catch (e) {
      setFailure((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  async function loadRecords() {
    const version = ++recordRequest.current;
    try {
      const r = await api.call<{ rows: any[] }>('classroomInteractionRecords', {
        courseId: course.id,
        roundId: round?.id,
      });
      if (privateAllowed.current && version === recordRequest.current) setRecords(r.rows);
    } catch (e) {
      setFailure((e as Error).message);
    }
  }
  async function refreshHistory() {
    try {
      const r = await api.call<{ rounds: PollRound[] }>('classroomInteractionReport', {
        courseId: course.id,
        history: true,
      });
      setHistory(r.rounds);
    } catch (e) {
      setFailure((e as Error).message);
    }
  }
  if (course.id !== MI_CLASSROOM_COURSE || api.preview) return null;
  return (
    <div className="teacher-interaction" ref={controls}>
      <div className="interaction-control" aria-label="課堂互動控制">
        <span>{def ? '互動：' + def.title : '本頁無互動題'}</span>
        <details>
          <summary>參與班級（{classes.length}）</summary>
          {course.classIds.map((id) => (
            <label key={id}>
              <input
                type="checkbox"
                disabled={busy || round?.status === 'open'}
                checked={classes.includes(id)}
                onChange={(e) =>
                  setClasses((old) =>
                    e.target.checked ? [...old, id] : old.filter((x) => x !== id),
                  )
                }
              />
              {id}
            </label>
          ))}
        </details>
        <button
          disabled={busy || !def || !classes.length || round?.status === 'open'}
          onClick={() => void action('open')}
        >
          開放作答
        </button>
        <button disabled={busy || round?.status !== 'open'} onClick={() => void action('close')}>
          結束作答
        </button>
        <button
          disabled={
            busy ||
            !def ||
            !classes.length ||
            round?.status !== 'closed' ||
            round.slideId !== slideId
          }
          onClick={() => void action('open')}
        >
          再投一輪
        </button>
        <button disabled={!round} onClick={() => setShow((v) => !v)}>
          {show ? '回投影片' : '顯示結果'}
        </button>
        {round && (
          <span>
            第{round.number}輪 · 已回覆{round.total}人
            {round.slideId !== slideId ? '（其他投影片的互動）' : ''}
          </span>
        )}
        <details
          onToggle={(e) => {
            if (e.currentTarget.open) void refreshHistory();
          }}
        >
          <summary>歷次結果</summary>
          <select
            aria-label="歷次互動"
            value={selected}
            onChange={(e) => {
              setSelected(e.target.value);
              setShow(true);
            }}
          >
            <option value="">最新互動</option>
            {history.map((r) => (
              <option key={r.id} value={r.id}>
                {r.title} · 第{r.number}輪 · {r.total}人
              </option>
            ))}
          </select>
        </details>
      </div>
      {privateRecords && round && (
        <div className="classroom-private">
          <button onClick={() => (records ? setRecords(null) : void loadRecords())}>
            {records ? '隱藏私人紀錄' : '私人參與紀錄（請先暫停投影）'}
          </button>
          {records && (
            <div>
              <p>僅教師可見；全螢幕時隱藏。</p>
              {records.map((r) => (
                <p key={r.uid}>
                  {r.classId} · {r.studentId} · {r.name} · 已送出
                </p>
              ))}
            </div>
          )}
        </div>
      )}
      {failure && (
        <p className="interaction-failure" role="alert">
          {failure}
        </p>
      )}
      {show && round && !black && (
        <div
          className="interaction-projection"
          style={{ bottom: footerHeight }}
          aria-label="即時投票結果"
        >
          <PollResults round={round} />
        </div>
      )}
    </div>
  );
}
/** Only presentation instructions change; the approved private source asset stays intact. */
export function interactiveSlideHTML(html: string, slideId: string) {
  const replacements: Record<string, [string, string][]> = {
    'c1-spread': [
      [
        '在紙上畫出細菌從 A 床走到 B 床的所有可能路徑，再<b>圈出你會攔截的那一步</b>。',
        '在自己的課序選擇可能的傳播途徑，以及你會優先加強的攔截步驟。',
      ],
      ['個人任務｜4 分鐘', '個人任務｜選擇途徑與攔截步驟'],
    ],
    'c1-resist': [
      ['30 秒，寫下一句衛教說明', '個別選擇衛教說明'],
      [
        '一人當王先生，一人當護理師：用上面的機制解釋為什麼不能自己停藥，以及醫院可以怎麼減少抗藥菌。',
        '在自己的課序選擇適當的衛教說明、基因傳遞方式，以及醫院減少抗藥菌的做法。',
      ],
    ],
    'c2-tcell': [
      [
        '每人選一張角色卡，用一句話自我介紹：「我是＿＿，在醫院負責＿＿。」',
        '每人選一張角色卡，再於課序選擇該角色負責的工作。',
      ],
      ['負責：＿＿＿＿', '在課序選擇角色的工作'],
    ],
    'c2-hiv': [['30 秒，寫下衛教重點', '個別選擇受器與衛教說明']],
    'c2-first': [['加碼：補體加熱到幾度就失效？', '加碼：在課序選擇補體失效的溫度。']],
    reflect: [
      ['原本我以為＿＿＿＿＿＿＿＿，', '選擇今天最需要加強的概念，'],
      ['現在我知道＿＿＿＿＿＿＿＿。', '再選擇目前的掌握情形。'],
      ['寫在 [Zuvio 開放題／小卡] 上，一兩句就好。', '在自己的課序「目前課堂互動」選擇後送出。'],
    ],
    'c1-sterile': [
      ['每題舉手：對的舉一隻手，錯的舉兩隻手。', '在自己的課序逐題選擇對或錯，完成後送出。'],
    ],
  };
  for (const [before, after] of replacements[slideId] || []) html = html.split(before).join(after);
  if (slideId === 'c1-toxin')
    html = html.replace(
      /<table\b[\s\S]*?<\/table>/i,
      '<div style="display:flex;gap:40px;margin-top:60px"><div style="flex:1;border:3px solid #ba4609;border-radius:20px;padding:65px;font-size:54px">A　內毒素</div><div style="flex:1;border:3px solid #ba4609;border-radius:20px;padding:65px;font-size:54px">B　外毒素</div></div>',
    );
  return html;
}
export function interactiveSlideNotes(notes: string, slideId: string) {
  if (!interactions.some((d) => d.slideId === slideId)) return notes;
  return (
    '本頁操作：學生在自己的課序選擇作答，沒有自由填答、不分組。教師手動開放、結束，查看票數後統整；不計分。\n原教材醫學講解參考（原有書寫／分組操作指示不適用）：\n' +
    notes
  );
}
