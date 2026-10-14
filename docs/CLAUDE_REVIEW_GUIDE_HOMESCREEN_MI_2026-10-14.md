# Claude複驗交辦：MI手機主畫面說明合併

請複驗 .worktrees/release-mi-1.9.0／release/mi-1.9.0 最新本機merge commit（git log -1），MI父efeb1e7，來源feature/1.9.0-unify@8e61f58（含e2dd36c）。先讀handoff.md與GUIDE_HOMESCREEN_MI_MERGE_2026-10-14_REPORT.md。

1. 原交辦在root CODEX_TASK_GUIDE_HOMESCREEN_2026-10-14.md，核對新增HTML逐字相同，放在登入後；原2–10改3–11，id無重複，新節不用截圖。
2. 手機ol／h3字級≥16px，1280／390、預設／特大無水平溢位，列印顯示步驟；manifest／圖示仍為MI子路徑資源。截圖集GUIDE_HOMESCREEN_MI_MERGE_SCREENSHOTS.html。
3. 確認合併以MI交接為主，archive/guide-homescreen-2026-10-14/完整保存雙方，DEVELOPMENT_LOG每個來源區塊存在；guide-homescreen-merge-preservation.json。
4. 差異只含3個guide程式檔＋文件／合成截圖；不得改登入、Excel、正式前後測、題庫、名冊、成績、互動後端、AP2或網站／Firebase設定。
5. 獨立跑VITE_SITE_ID=mi npm run check（Codex150＋54全過、0 skipped），再跑VITE_SITE_ID=mi node scripts/guide-verify.mjs --guide-only --dist --shots；證據檔guide-homescreen-mi-merged-check.txt／verify.txt與verification.json。
6. A段教師端報表／CSV與test互動由教師本人驗證，不是CodexUI自動化通過；不重開正式場次、不公布結果、不連雲端重測、不取得學生CSV。

請將PASS／需修項與驗證限制寫入docs/GUIDE_HOMESCREEN_MI_CLAUDE_REVIEW_2026-10-14.md。iPhone／Android主畫面登入仍待教師真機，不宣稱已驗證；本輪不改登入。不push、不部署，不重migration。若需修程式請列明交Codex，不自行上線。
