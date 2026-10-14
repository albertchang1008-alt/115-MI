# 專案交接（MI 1.9.0 release）
目前版本：1.9.0

## 現況（2026-10-14）
- worktree=.worktrees/release-mi-1.9.0，分支release/mi-1.9.0；MI remote=mi，Firebase=mi-bd885；不碰origin／ap2-7ed91。所有Firebase指令必帶專案，但本輪不執行Firebase／migration／部署。
- **A段完成：教師端項目由教師親自驗證。** 教師在test班確認報表／CSV、互動題目／倒數／加時／送出／結束／統計正常，正式班未操作。報告docs/MI_1.9.0_A_VALIDATION_STATUS_2026-10-14.md。不把教師回報稱Codex親測；未提供的裝置／影片明細不額外宣稱通過。
- 70354e0之後MI 1.9.0已發布b64217d；Functions單項重試／規則索引成功、Actions38514907129全綠，索引READY／排程HTTP200。migration已apply成功，不可重跑。
- b64217d以相同GitHub公開variables＋workflow有效SITE_ID=mi乾淨重建，線上／本機index-Dbnb149l.js SHA256一致。證據docs/unify-1.9.0/mi-b64217d-hash-verification.json；未改variables。
- **本輪B完成，待Claude複驗**：合併feature/1.9.0-unify（e2dd36c／8e61f58）之主畫面說明，保留MI交接為主並補齊guide紀錄；合併後MI check150＋54全過、0失敗／skipped，guide1280／390、11節／最小16px／無溢位／列印／資源200全過。隨本文本機merge commit（git log -1）保存，MI父efeb1e7／來源8e61f58；不push／部署。
- guide來源：登入後逐字新增「2. 加到手機主畫面」，原2–10改3–11與id；手機字級及列印、guide-verify同步。原AP2 check158／54、MI匯出150／54及兩站1280／390 guide通過；這些不代替合併後MI檢查。
- 先前兩次合併停止點（權限exit128／文件衝突exit1）、全部MI發布／A驗證歷史，以及unify既有固定決策與未提交交接，均逐字保存docs/archive/guide-homescreen-2026-10-14/，不刪除任一方紀錄。DEVELOPMENT_LOG合併時保留雙方每一歷史區塊。
- 課程教師／每輪班級選擇已有；最高管理者／班級委派與多班並行僅新規畫docs/CLASSROOM_CLASS_ADMIN_PLAN_2026-10-14.md，未實作。
- 報表可只讀整份但僅核對test，CSV只能留repo外；Codex未下載或提交CSV。先前原生工具的教師登出未能確認，未宣稱登出成功；最新教師授權先完成B，不再操作網站。

## 固定決策
- MI與AP2程式共用1.9.0，features按課程開關，建置VITE_SITE_ID分站；MI只發布兩教材＋三CHP，.firebaserc預設不改。
- 課堂互動定義為課程classroomConfig/interactions；歷史state／rounds原路徑保留；互動不計成績或完成度。正式前後測採私有凍結來源、延後公布。
- 不改登入signInWithPopup、Excel、學生作答／成績或功能開關；不用force／no-verify，不略過測試。完成工作更新handoff與DEVELOPMENT_LOG，commit結尾[Codex]。

## 下一步
1. Claude複驗：docs/CLAUDE_REVIEW_GUIDE_HOMESCREEN_MI_2026-10-14.md；報告docs/GUIDE_HOMESCREEN_MI_MERGE_2026-10-14_REPORT.md，截圖集GUIDE_HOMESCREEN_MI_MERGE_SCREENSHOTS.html。複驗PASS後仍等教師發布授權。
2. 教師用test帳號在iPhone／Android真機測：加主畫面→圖示開啟→Google登入→練習保存→關閉重開維持登入。若iPhone失敗依交辦改注意第3點、另評估redirect；本輪不改登入。
3. 本輪停止本機commit，Claude PASS後仍需教師另行授權才可push或部署（AP2亦同）。
