# Claude交辦：115-MI全選項課堂互動驗收

2026-10-13最新：教師另授權「先上線」，發布順序已變更；此交辦保留作為上線後獨立驗收，不能宣稱已PASS。本版selection-only-v2取代舊短答規格，舊PASS不適用。

## 工作位置與限制
只在`/Users/HHC/Documents/ChatGPT/課程平台1.0/.worktrees/site-115-MI`；先讀handoff、確認分支codex/115-mi-assessments、HEAD a1534089cafd32404a1098e6ed54d09677c26c36、版本1.7.1。
驗收含未提交及untracked新檔，不只HEAD；以`git status --short`與指紋JSON辨識實際版本。本交辦僅獨立檢視與寫驗收報告，不代部署、不commit／push。不要動主目錄／其他worktree／AP2／Excel／Sheets／正式場次或雲端資料，.firebaserc default不改。

## 必讀
- `docs/115-MI_CLASSROOM_INTERACTION.md`、`docs/115-MI_CLASSROOM_OPTIONS.md`：完整題意及選項。
- `shared/classroom.ts`、`src/ClassroomInteraction.tsx`、`src/TeachingControl.tsx`、`src/App.tsx`、`src/style.css`。
- `functions/src/classroom.ts`、index及既有登入access／identity；不可只相信mock權限。
- `tests/classroom.test.ts`、`functions/tests/classroom.test.cjs`、`scripts/classroom-ui-check.mjs`。
- `docs/deploy-115-MI-evidence/classroom-review-snapshot.json`與classroom-ui.json。
- 本機私有核可簡報`.classroom-preview/teacher-deck.json`（不入Git）。新增理由／衛教／角色功能選項按相關原頁、答案頁與備註逐項核對；干擾選項不得造成醫學歧義。此為內容複驗重點。

## 驗收要求
1. 全12頁學生只選，零textarea、文字input或可編輯內容；所有欄位必選。保留單選／是非／配對／排序，理由與反思也是選項。API拒絕任意文字／額外欄位／舊text格式；沒有匿名文字儲存或投影、hide/show文字API。
2. 傳播途徑與攔截、反思屬個人看法，不宣稱單一正解。角色／工作為兩個獨立選擇，逐欄呈現分布，不假稱配對正確率。新選項必要時提出精確修訂建議，先交Codex修正。
3. 原四選一、是非、藥物配對、抗體與排序沿用核可文字；無答案鍵或自動正解揭示。學生不得取得教師38頁簡報／備註／未公開答案。教師答案頁仍私有，由教師另切。
4. 教師單螢幕全螢幕可開／關／再投／看結果，操作不退出。約2秒更新總人數與各項票數百分比；翻頁不改狀態、單輪開放；新輪0票保留舊輪。
5. 每UID每輪一次、確認後鎖定、重送不改答／重計票；收票競爭無新票，既有提交仍回確認；斷線不假稱成功。54人併發與全部題型票數吻合。
6. 班級與課程隔離、教師權限在後端；公開統計無姓名／學號／UID。全螢幕無備註／私人紀錄，延遲回覆不重現；黑屏同步隱藏投影。
7. 題庫、正式前後測、成績、完成度、Client deny規則、AP2不受影響。私有資產與截圖gitignored，不打包。
8. 1280／390及1.2字級零越界／頁面例外；完整npm run check重跑。Node22；check177項、兩端build／49入口為Codex結果，請獨立確認。

## 操作與證據
啟動中的預覽：`http://127.0.0.1:8771/docs/115-MI_CLASSROOM_PREVIEW.html`；教師`/.classroom-preview/index.html?role=teacher`，學生`?role=student&uid=student-1`及student-2。同瀏覽器localStorage v2模擬；無Google登入、不連正式雲端，不能宣稱跨裝置／真實承載通過。

執行`npm run check`及`node scripts/classroom-ui-check.mjs`。截圖只在`.classroom-preview/shots/`；不可提交私有JSON或截圖。需重啟預覽見交件報告。

## 交付結論
寫`docs/115-MI_CLASSROOM_CLAUDE_REVIEW.md`，包含分支／HEAD／未提交指紋、逐項內容和程式驗收、重跑結果、問題清單、正式環境尚待驗證、最終PASS／需修正／受阻。不要以Codex報告冒充獨立驗收。若指紋不符先列新增改動。

需修正或受阻不發布。本輪教師已授權先發布；獨立驗收問題須交回MI修正流程（mi remote、mi-bd885），正式跨裝置測試另列，不操作真實學生場次。完成驗收更新本worktree handoff與DEVELOPMENT_LOG。
