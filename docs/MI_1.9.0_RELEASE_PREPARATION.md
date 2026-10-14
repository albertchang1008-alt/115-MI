# MI 1.9.0 本機 release 準備報告

2026-10-14，Codex。worktree `.worktrees/release-mi-1.9.0`，分支 `release/mi-1.9.0`。
本機準備完成，合併 commit 以 `git log -1` 查閱；待 Claude 複驗，不代表 MI 已上線。

## 合併範圍
- 基底 `mi/main@70354e0`（已包含 `d48aac8`）；合併共用 `7a6720e`，包含固定 MI 歷史測試資料與 SHA-256 驗證的 CI 修正。
- 24 個衝突已逐檔核對、無殘留標記并完成暫存；以共用程式保留 features、反思、前後測、控制台、互動與學生 guide。
- `d48aac8` 的雲端進度等待／失敗重試、測驗種類切換清補考與理由保留；兩份原回歸 fixture 與該 commit 逐位元一致。
- workflow 未設 `VITE_SITE_ID` 時 fallback `mi`；`.firebaserc` 依教師指示保持原樣。任何後續 MI Firebase 指令必須明確 `--project mi-bd885`，不使用 AP2 deploy.sh。
- MI GitHub `VITE_SITE_ID` 唯讀確認未設定，列為教師發布前待辦；本輪沒有修改任何遠端變數。

## 教材與分站測試
- 29 個未追蹤 AP2 公開教材資料夾已移到 repo 外保存，沒有提交；位置：
  `/Users/HHC/Documents/ChatGPT/_mi-merge-aside/release-mi-1.9.0-20261014-ayyc2fqa`
- 指定四檔還原至原暫存版本：ecg-model／material-kit／material 測試與 public/materials/README.md。保留 MI 原有測試內容，不帶回 AP2 公開快照。
- material-registration 的 AP2 分支維持原 physiologySlugs 五份斷言；MI 分支驗證 miMaterialSlugs 兩份 HTML／來源／節點和題目ID／目錄分母／標題／SDK／通關核心一致，並確認 AP2 生理公開檔不存在、公用目錄只有兩份 MI 教材。
- 兩站均有實質斷言，沒有 skip 或條件略過。相同測試回補共用分支 commit `178f862`；該分支 AP2 完整 check158／Functions54、0 fail／0 skipped。AP2不重新部署。

## 乾淨暫存內容 CI 模擬
- 用 `git checkout-index --all --prefix=<temp>/` 匯出，沒有 .git、node_modules 或未追蹤教材；依 lockfile npm ci／functions ci 後跑 `VITE_SITE_ID=mi npm run check`。
- **前端150／Functions54全部通過，0 failed、0 skipped**；版本一致1.9.0，前後端build與51入口通過。
- dist/materials 僅 `micro-bacteria-review-v1`、`immuno-concepts-review-v1`；dist僅三份CHP07／08／16，site.json為mi／115-MI網址。
- 完整輸出 `docs/unify-1.9.0/check-mi-release.txt`；結構證據 `docs/unify-1.9.0/mi-release-verification.json`。這些結果來自純暫存匯出，不使用工作目錄的未追蹤檔。
- 150與共用AP2的158項差異，來自依教師指示保留MI已暫存的站別測試版本；不是skip。兩站教材登錄測試各自有完整斷言。

## Migration 與資料保護
- 重跑 `node scripts/migrate-mi-1.9.0.mjs --project mi-bd885 --dry-run` 成功，輸出 `docs/unify-1.9.0/migration-mi-release-dry-run.json`。
- 12題互動與slideTransforms核對一致；只產生離線計畫，不載入真實Firebase SDK，不讀寫正式專案。
- **Excel引用Claude已完成稽核：暫存結果相對mi/main沒有任何.xlsx變動。** 本轮不修先前補充稽核工具，不修改Excel。
- 未push mi、migration apply、部署MI Functions／rules／indexes、讀寫正式學生資料或成績；不force push／no-verify／略過測試。

## 24個衝突處理紀錄
| 檔案 | 處理／理由 |
|---|---|
| `functions/scripts/check-entry.cjs` | 共用51入口清單，包含互動設定API。（已核對無標記並完成git add） |
| `functions/src/assessments.ts` | 共用features權限與每課來源、保留試卷私有性及旧路徑。（已核對無標記並完成git add） |
| `functions/src/classroom.ts` | 共用features與課程設定，保留輪次、倒數與加時。（已核對無標記並完成git add） |
| `functions/src/index.ts` | 保留反思／來源同步／features及共用exports。（已核對無標記並完成git add） |
| `functions/src/teaching.ts` | 按課程features讀取私有簡報、資料驅動文字轉換。（已核對無標記並完成git add） |
| `functions/tests/assessments.test.cjs` | 每課來源與私有試卷回歸。（已核對無標記並完成git add） |
| `functions/tests/classroom.test.cjs` | 資料驅動互動、倒數交易回歸。（已核對無標記並完成git add） |
| `functions/tests/teaching.test.cjs` | features与缺簡報回歸。（已核對無標記並完成git add） |
| `handoff.md` | 需重寫為MI release現況；目前只存停止交接。（已核對無標記並完成git add） |
| `scripts/classroom-preview-client.tsx` | 以測試記憶體資料供通用互動預覽。（已核對無標記並完成git add） |
| `shared/assessment.ts` | 移除MI固定題目ID，共用正式測驗模型。（已核對無標記並完成git add） |
| `shared/classroom.ts` | 移除MI固定課程／題目，共用模型與驗證。（已核對無標記並完成git add） |
| `shared/materials.ts` | 完整共用來源目錄與VITE_SITE_ID分站。（已核對無標記並完成git add） |
| `src/App.tsx` | 反思、features介面、來源提醒與教師設定。（已核對無標記並完成git add） |
| `src/Assessments.tsx` | 動態題數與課程CSV名稱；保留d48aac8種類切換重設。（已核對無標記並完成git add） |
| `src/ClassroomInteraction.tsx` | 通用設定編輯與資料驅動；MI題目仍在migration資料。（已核對無標記並完成git add） |
| `src/Student.tsx` | 首次提示／說明入口／反思／features。（已核對無標記並完成git add） |
| `src/TeachingControl.tsx` | 按開關顯示分頁、無簡報相容、資料驅動互動。（已核對無標記並完成git add） |
| `src/style.css` | 共用反思／首次提示與各功能樣式。（已核對無標記並完成git add） |
| `tests/activity-editing.test.ts` | 雙站教材名稱測試。（已核對無標記並完成git add） |
| `tests/classroom.test.ts` | 由MI測試資料驗證12題。（已核對無標記並完成git add） |
| `tests/fixtures/interaction-status.tsx` | 本機合成API提供共用互動設定。（已核對無標記並完成git add） |
| `tests/material-registration.test.ts` | 依站別核對：AP2保持原physiology斷言；MI兩份教材一致且AP2公開檔不存在。（已核對無標記並完成git add） |
| `tests/preview.test.ts` | 依網站設定驗證教材網址。（已核對無標記並完成git add） |



## 交 Claude 複驗
1. 核對本機merge的兩個parent、24檔處理、d48aac8相容與features路徑。
2. 核對MI只有兩份公開教材、三個CHP，無AP2未追蹤檔依賴，乾淨匯出check150／54、0 skipped。
3. 核對共用分站測試回補178f862與MI測試檔一致、離線dry-run內容。
4. MI VITE_SITE_ID未設保留教師待辦；本輪不改遠端。
5. 複驗通過後仍等教師另行授權；正式順序migration apply→MI Functions→Pages，本輪不執行。
