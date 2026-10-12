# 專案交接（115-MI 現況）
目前版本：1.7.1

## 給接手的 AI agent
- 開工讀本檔、確認分支；commit 結尾 [Codex]，不略過測試。
- 本 worktree 是 115-MI，禁止向 origin（AP2）push 或部署 ap2-7ed91；不得執行 AP2 scripts/deploy.sh。
- 每段工作更新本檔與 DEVELOPMENT_LOG.md；部署流程見 docs/DEPLOY_115-MI.md。

## 目前狀態（2026-10-12）
- 教師授權今天獨立部署。分支 deploy/115-MI-site，目錄 .worktrees/site-115-MI；基底 a593796，合入題庫分離54a1d3c與既有mi/main，保留兩邊歷史。
- mi-bd885 可見、Blaze、Firestore Native asia-east1、Sheets API enabled；Google登入及Pages網域設定存在。教師設定的四個GitHub variables已比對符合，Pages來源為Actions。
- 兩份微免與三份CHP沿用核可內容；僅替換兩份SDK網址為MI站。AP2公開教材移除，catalog僅兩筆MI；SDK及教材判定不改。README保留作materials:sync目錄資料。
- npm ci、functions ci、materials:sync、完整check成功：前端132／Functions29，0fail／skipped，版本1.7.1與兩端build通過。AP2公開檔測試調整逐條列於部署文件。
- SHEETS_SYNC_KEY新版本2已設定且sheetsPublish使用；40個函式全部ACTIVE（asia-east1），Firestore規則與索引部署成功。服務帳戶：62416037569-compute@developer.gserviceaccount.com。
- 已一般push mi/main（網站合併a2d2a24、正式紀錄d9895be），Actions build/deploy全部success；六個正式網址200，登入畫面Google按鈕可用、v1.7.1、0 pageerror；正式JS設定確認mi-bd885。檢查證據與網址見docs/DEPLOY_115-MI_REPORT.md。
- .env.local忽略不提交；.firebaserc default、pages.yml、SDK、AP2 deploy.sh未改；AP2題庫與e8805f8逐位元相同227題；115-MI題庫在repo外獨立檔。原目錄與其他worktree未改。

## 固定決策（精簡版；細節見各 docs）


**資料與架構**
1. 學生入口 GitHub Pages，資料 Firebase（各課程獨立專案，asia-east1）；舊題庫系統資料完全隔離。
2. 成績一律由後端以私有答案表重批，前端分數不採信。完整作答才更新最高分；錯題複習、抽題、綜合練習不更新最高分與完成度。
3. 題庫改版時錯題依題目 ID 延續；正解文字／選項數／題型改變或刪除的題目重置；教師可勾選全部重新計算；同步時讀舊版題庫比對（僅教師操作）；複習考與部署前的同步不延續。已發布快照不可變、最高分跨版沿用。所有錯題經 effectiveWrong；rm保留n，再錯累加；同日ok，Asia/Taipei隔日答對才移除。
4. 代碼（課程／單元／班級）由教師自訂，可中文、英數、`-`、`_`，不可空白標點，≤50 字，建立後不改。題目 ID 等仍限英數。
5. 時間欄位（datetime-local 無時區）一律以台灣 +08:00 解讀（`parseCourseTime`）。
6. Firestore 不接受 undefined 欄位：要清除的欄位直接省略。

**單元模型（1.4.0，`docs/UNIT_MODEL_1.4.0.md`）**
7. Sheet「單元」＝`Chapter`：開放、期限、門檻、必做、班級覆寫、活動、看板移動、完成度計數都在此層。Sheet「次單元」＝`Unit`（題目分類）：題庫版本、進度、錯題、完整測驗範圍。
8. 單元完成＝底下每個已發布題目分類的完整測驗最高分 ≥ 單元門檻，且必做活動完成。題目分類一律必做（沒有選做分類）；「選做／選看」只在單元（`Chapter.required`，可班級覆寫）與活動（`Activity.required` 覆寫，未設定沿用類型推導）兩個層級，不計完成度。1.7.0 閃卡＝翻卡、不寫入任何資料（含 attempted），舊閃卡分數保留。錯題複習＝逐題重做，只出昨天以前待複習，選10／20／30／50／≤50非檔位全部題數；時間範圍已移除，今天剛錯先看閃卡（複習考仍無閃卡）。完成度公式版本 3（`CURRENT_COMPLETION_FORMULA_VERSION`）。
9. 單元活動進度鍵 `chapter:<單元名>_<activityId>`。綜合練習只含看板「目前」、已發布的分類（含選看／已達標），不含複習考；可按單元／分類勾範圍，預設全選、以courseId＋uid本機存排除ID；閃卡／抽題／錯題複習全部不計分，題庫只在按練習後載所選。

**複習考（1.5.0，`docs/REVIEW_EXAM_1.5.0.md`）**
10. 複習考＝教師選多個分類組成的獨立 `Unit`（`unit.review`），題目複製成快照題目池；每次依比例隨機抽 N 題（未考過優先），抽滿配額才算完整作答；最高分 ≥ 門檻完成；逾期仍完成但標「逾期完成」（`progress.units[id].passedAt`）。來源更新需教師按「重新組卷」。一般單元不放題目練習活動。

**題庫同步與題目**
11. 同步只讀與課程代碼同名的分頁；「單元」欄是分組、「次單元」欄是分類；「啟用」欄 FALSE 的列略過；同步只新增／更新，不自動刪除（舊分類以 `staleUnits` 提示教師清理）。分類名稱跟隨 Sheet 次單元。
12. 選項每次洗牌；測驗選項不顯示 A/B/C/D。完整測驗作答中不揭曉正解，交卷後才看；翻卡翻面顯示，抽題／錯題複習送出單題後顯示。
13. 解析五段鍵 `keyword/chain/decide/memory/trace`（保留舊鍵相容）；畫面稱「引導式解析」，一律展開；學生看①～④，教師另看⑤。傳統解析預設收合。

**前端**
14. 所有 `font-size` 寫成 `calc(Npx * var(--font-scale, 1))`；色系／字級選單在頂端 `.prefs-bar`。
15. 登入固定 `prompt: 'select_account'`；「切換帳號」沿用 `doSwitchAccount()`。
16. 教材卡：一般閱讀 HTML 標「閱讀教材」，只有 `tracking === 'interactive'` 標「互動資訊圖表」。
**互動教材與研究資料**
17. 教材以公開 SDK `materials/course-learning.js` 回報探索、節點停留、每次作答、通關；不傳姓名／學號／信箱。發布路徑 `public/materials/<slug>-vN/index.html`，登錄於 `shared/materials.ts`，內容重大變更開新版本不覆寫。教師後台填節點／題目分母（寫入時快照，事後不回溯）。
18. 教材格式：六個固定節點＋教學圖；卡片內「圖→概念→重點→臨床」；第一關 6 題先備逐題解鎖、第二關 5 題病例全對通關（答錯只給提示並要求回讀）。節點／題目 ID 固定英數。NotebookLM 只產初稿，不含追蹤；流程見 `docs/NOTEBOOKLM_HTML_WORKFLOW.md`。
19. 教材工作室（`教材工作室.app`／`npm run materials:studio`）只做本機匯入與稽核，不跑 git、不部署；規則與 `scripts/materials.mjs` 共用。
20. 診斷與研究資料只作教學線索：不得判定「猜題／認真」，Mastery 不是正式成績；GA4 只送去識別事件。研究設計見 Project 文件「教學實踐研究設計與平台資料蒐集評估」。
21. 測試學生帳號用 `config/testStudents` 白名單，只放寬信箱網域，放專屬測試班。
22. 教材建置流程：agent 先用 `npm run materials:preview <slug>`（只產生教材檔、不登錄教材目錄）＋`npm run materials:shots <slug>`，**停下來請教師看畫面**；教師滿意後才執行 `npm run materials:build <slug>` 完成登錄並 commit。不要直接改 `public/materials/` 的 HTML，也不要用教材工作室重複匯入元件庫建置的教材。 **教師決定（2026-10-11更正）：每份新資訊圖表定稿後，必須把6先備＋5情境題寫入該課程自己的題庫；`html/資訊圖表題庫_上傳用.xlsx`僅屬115-2-AP2，115-MI題庫另存教學知識庫，不納入平台repo**（欄位同既有列：題目 ID 與教材一致、單選四選一、正確答案代碼與 Zuvio 序號、解析＋①～④引導式解析、講義標題與教材連結；選項打散；「說明」分頁更新次單元來源與合計題數），未寫入題庫不算完成。**只能在最後增列新列，既有列一律不得修改、刪除或重新排序（已上傳平台、學生已在作答；改動會讓該分類產生新題庫版本）。**
23. **用語（教師決定 2026-10-03）：一律使用台灣課本用語，不用大陸用語**（例：心搏量非每搏量、紅血球非紅細胞、微血管非毛細血管、受器非感受器、黏度非粘度、點選非點擊）。新教材與修改都要掃描用語；學生看得到的地方不得留下「⚠️」「請教師決定」等草稿註記。
24. **藥物與疾病（教師決定 2026-10-07）：Q1–Q8 任何題目內容和藥物或疾病有關，一律納入「國考延伸」補充教材**（9/25「正式教材不放疾病藥物」的配套）；出處第一順位指定課本、第二順位其他課本並逐句註明。規格見 Project 文件「期中考國考延伸補充教材規格」第 5 節。
25. **課程題庫分離（教師2026-10-11更正）**：115-MI 與 115-2-AP2 共用主程式，課程內容與題庫完全分開；任何課程的題目只寫入該課程自己的題庫檔，不得寫入 html/資訊圖表題庫_上傳用.xlsx（該檔僅屬 115-2-AP2）。

26. **115-MI 獨立部署**：網站 `albertchang1008-alt/115-MI`、Firebase `mi-bd885`；115-2-AP2 維持 `115-1-AP2`／`ap2-7ed91`。兩邊共用程式碼，但部署、資料、教材、題庫各自分開；部署前必確認目標專案與 remote。

## 現況與下一步（教師權限已設定，2026-10-12）
- 教師已提供UID並完成gcloud ADC登入；已執行scripts/set-teacher.cjs，明確project=mi-bd885，保留既有claims新增teacher:true。讀回確認UID一致、teacher:true、disabled:false；沒有操作AP2。
- 教師確認115-MI Google Sheet已分享給MI服務帳戶；實際讀寫與題庫／名冊匯入尚未代操作。
- 請教師在新站登出再登入，更新登入token並進入教師後台，再建立／匯入115-MI課程自己的題庫與名冊。
- gcloud官方588.0.0暫存於/tmp/115-MI-gcloud，SHA256與官方相同；憑證只在本機，不納入repo。這次僅設定Auth claim與更新紀錄，未再推送或部署網站。
- 網站正式版本d9895be，Actions 38197847642成功；本機後續交接提交以git log -1為準。
- Apps Script若使用SHEETS_SYNC_KEY，採相同Secret Manager版本；值不得寫入聊天或repo。
