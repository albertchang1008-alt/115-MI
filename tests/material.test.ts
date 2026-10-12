import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { materialUrl } from '../shared/model';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { HtmlMaterial } from '../src/Player';
import type { API } from '../src/service';

test('教材接受 Pages 子路徑、自訂網域與版本參數，拒絕非 HTTPS 與帳密網址', () => {
  for (const url of [
    'https://teacher.github.io/course/materials/v1/index.html?v=1#start',
    'https://learn.example.edu/教材/index.html',
  ]) {
    assert.equal(materialUrl(url), new URL(url).href);
  }
  for (const value of [
    undefined,
    '',
    '/index.html',
    'http://example.com',
    'javascript:alert(1)',
    'data:text/html,test',
    'https://user:password@example.com/',
    'https://',
  ]) {
    assert.equal(materialUrl(value), null);
  }
});

test('學生與預覽共用教材元件直接嵌入 Pages，無效網址不呈現 iframe', () => {
  const activity = {
    id: 'html-1',
    title: '教材',
    description: '',
    type: 'html' as const,
    phase: 'before' as const,
    url: 'https://teacher.github.io/materials/v1/index.html',
  };
  const render = (url: string) =>
    renderToStaticMarkup(
      createElement(HtmlMaterial, {
        api: {} as API,
        courseId: 'course-1',
        unitId: 'unit-1',
        uid: 'student-1',
        activity: { ...activity, url },
        onSave: () => {},
      }),
    );
  const html = render(activity.url);
  assert.ok(html.includes(`src="${activity.url}"`));
  assert.ok(html.includes('sandbox="allow-scripts"'));
  assert.ok(!html.includes('allow-same-origin'));
  const invalid = render('javascript:alert(1)');
  assert.ok(!invalid.includes('<iframe'));
  assert.ok(invalid.includes('disabled=""'));
});

test('course-learning.js 的 trackScrollNodes 是可重用的捲動節點追蹤方法', async () => {
  const js = await readFile(new URL('../public/materials/course-learning.js', import.meta.url), 'utf8');
  assert.match(js, /trackScrollNodes\(selector = '\[data-node-id\]', threshold = 0\.4\)/);
  assert.match(js, /new IntersectionObserver/);
  assert.match(js, /this\.explore\(nodeId\)/);
  assert.match(js, /this\.nodeTime\(nodeId, seconds\)/);
  assert.match(js, /Number\.isFinite\(seconds\)/);
  assert.match(js, /whole > 0/);
});

test('新增心臟與紅血球教材含情境實驗室、穩定事件與兩階段通關追蹤', async () => {
  const cases = [
    ['../html/心臟血液供應.html', 'coronary-circulation'],
    ['../html/紅血球的恆定機制.html', 'rbc-homeostasis'],
  ] as const;
  for (const [file, prefix] of cases) {
    const html = await readFile(new URL(file, import.meta.url), 'utf8');
    assert.match(html, /情境實驗室/);
    assert.match(html, /先猜一猜/);
    assert.match(html, /prefers-reduced-motion/);
    assert.match(html, /materials\/course-learning\.js/);
    assert.match(html, new RegExp(`const MATERIAL_ID = '${prefix}'`));
    assert.equal((html.match(new RegExp(`id: '${prefix}-foundation-q\\d\\d'`, 'g')) || []).length, 6);
    assert.equal((html.match(new RegExp(`id: '${prefix}-case-q\\d\\d'`, 'g')) || []).length, 5);
    assert.match(html, /trackComplete\(\)/);
    assert.match(html, /grid-template-columns:minmax\(0,1fr\) auto/);
    assert.match(html, /\.sim-arrow \{ display:none; \}/);
    assert.match(html, /const shuffledOptions = shuffleArray\(q\.options\.map\(\(text, index\) => \(\{ text, isCorrect: index === q\.answer \}\)\)\)/);
    assert.match(html, /shuffledOptions\.forEach\(\(\{ text: optText, isCorrect \}\) =>/);
    assert.match(html, /trackAnswer\(q\.id, isCorrect\)/);
    assert.match(html, /visual-flow-card/);
    assert.match(html, /CASE_REVIEW_NODE_IDS/);
    assert.match(html, /前往對應圖卡複習/);
    assert.match(html, /s2ReviewRequired && !s2ReviewReady/);
    assert.doesNotMatch(html, /答錯了！正解解析/);
  }
});

test('紅血球教材以 HbA 四聚體與全流程圖呈現恆定機制', async () => {
  const html = await readFile(new URL('../html/紅血球的恆定機制.html', import.meta.url), 'utf8');
  assert.match(html, /紅血球恆定全流程/);
  assert.match(html, /HbA：α₂β₂（四聚體）/);
  assert.match(html, /每個珠蛋白次單元包覆 1 個 heme/);
  assert.match(html, /heme 中心 Fe²⁺ 可逆結合 1 個 O₂/);
  assert.match(html, /合計最多攜帶 4 個 O₂ 分子/);
  assert.match(html, /網狀內皮系統/);
  assert.match(html, /攜氧恢復 → 缺氧刺激下降/);
  assert.match(html, /rbc-overview-mobile/);
  assert.match(html, /viewBox="0 0 360 850"/);
  assert.match(html, /\.rbc-overview \{[^}]*overflow:hidden/);
  assert.match(html, /\.rbc-overview \.rbc-overview-mobile \{ display:block !important; min-width:0; \}/);
  assert.doesNotMatch(html, /\.rbc-overview \{[^}]*overflow-x:auto/);
  assert.match(html, /assets\/rbc-epo-feedback-strip-v1\.png/);
});

test('情境實驗室的四卡醫學插圖已隨三份教材提供', async () => {
  const assets = [
    '../html/assets/heart-valve-flow-strip-v1.png',
    '../html/assets/coronary-perfusion-flow-strip-v1.png',
    '../html/assets/rbc-epo-feedback-strip-v1.png',
  ];
  for (const asset of assets) {
    const image = await readFile(new URL(asset, import.meta.url));
    assert.deepEqual([...image.subarray(1, 4)], [80, 78, 71]);
  }
});
