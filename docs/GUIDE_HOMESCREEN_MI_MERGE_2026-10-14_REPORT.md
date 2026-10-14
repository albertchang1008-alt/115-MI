# MI主畫面說明合併完成（2026-10-14）

## 結果
A段依教師最新指示完成，**教師端項目由教師親自驗證**：test報表／CSV、互動題目、倒數、加時、送出、結束及統計正常，正式班未操作。詳見MI_1.9.0_A_VALIDATION_STATUS_2026-10-14.md。Codex沒有下載教師CSV，不將教師親驗記為自動驗證。

B：feature/1.9.0-unify@8e61f58（含e2dd36c主畫面說明）合併進release/mi-1.9.0。MI父commit efeb1e7；最終merge commit以git log -1為準。沒有push或部署，線上仍b64217d。

## 保留兩邊紀錄
以MI handoff現況為主，補入共用guide內容與固定決策。兩邊合併前handoff和DEVELOPMENT_LOG（含未提交紀錄）逐字保存在archive/guide-homescreen-2026-10-14/。DEVELOPMENT_LOG以MI全文為主，加入共用分支尚未包含的6個區塊；驗證每個來源區塊都完整存在。證據unify-1.9.0/guide-homescreen-merge-preservation.json。沒有刪除任一方歷史。

## 修改範圍
實際程式差異只有public/guide/index.html、public/guide/guide.css、scripts/guide-verify.mjs：登入後逐字加入「2. 加到手機主畫面」，原2–10改3–11與id，手機清單／h3與列印樣式、11節驗證。HTML已逐字比對原交辦，無截圖放入新節。
登入、正式前後測、互動後端、題庫、名冊、成績、Excel、MI專屬教材／CHP、workflow和AP2部署均未改。

## 合併後驗證
- VITE_SITE_ID=mi npm run check：exit0，前端150/150、Functions54/54，0失敗／0 skipped；版本一致1.9.0，前端TypeScript／Vite與後端build通過。
- VITE_SITE_ID=mi node scripts/guide-verify.mjs --guide-only --dist --shots：exit0；1280／390共11節，兩份5步清單及5注意，最小字級16px，預設／特大無水平溢位，0 pageerror，列印正常。
- dist/site.json=mi，只有兩份微免教材與3份CHP；manifest standalone、Apple／192／512圖示在/115-MI/子路徑HTTP200。
- 1280及390全頁截圖已人工檢視；本機合成資料，無真實學生CSV或個資。

證據：unify-1.9.0/guide-homescreen-mi-merged-check.txt、guide-homescreen-mi-merged-verify.txt、guide-homescreen-mi/verification.json。
截圖集：GUIDE_HOMESCREEN_MI_MERGE_SCREENSHOTS.html（含1280／390及列印PDF）。

## 交Claude複驗與待辦
請依CLAUDE_REVIEW_GUIDE_HOMESCREEN_MI_2026-10-14.md複驗，檢查文字逐字、章節／id、手機／列印、紀錄保留及MI保護檔。本輪停本機commit，不push／部署；不得以Claude PASS自行發布。
教師iPhone／Android主畫面Google登入／保存練習／關閉重開保持登入仍待真機驗證，不能以test課堂互動驗收代替；本輪保留原交辦注意第3點，不改signInWithPopup。最高管理者班級委派仍僅規畫。原生工具的教師登出未能確認，不虛報完成；本輪B完全本機，不操作網站登入。
