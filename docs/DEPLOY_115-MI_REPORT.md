# 115-MI 獨立網站部署報告（2026-10-12）

版本1.7.1；分支deploy/115-MI-site；Firebase mi-bd885，GitHub albertchang1008-alt/115-MI。教師已授權部署。a593796＋54a1d3c＋既有mi/main合併，保留歷史，一般push不force。

## 前置條件與後端結果

- projects:list確認115-MI／mi-bd885可見；Blaze billingEnabled=true。
- Firestore (default) 已存在，Native／asia-east1；Sheets API ENABLED。
- Google登入已啟用，authorizedDomains含albertchang1008-alt.github.io；四個教師設定的GitHub variables與本機設定一致，Pages來源workflow。
- 所有Firebase命令均明確 --project mi-bd885。新SHEETS_SYNC_KEY版本2直接stdin寫入Secret Manager，未打印或存入repo；sheetsPublish已引用版本2。
- functions＋firestore部署exit0；40個Node22 Gen2函式全部ACTIVE／asia-east1；Firestore規則與索引成功。
- 實際Cloud Run執行階段服務帳戶：`62416037569-compute@developer.gserviceaccount.com`。請教師分享115-MI課程Google Sheet給它。

部署函式（全部platform codebase）：

archiveCourse, bootstrap, buildReviewExam, createSnapshot, dailyReports, deleteCourse, deleteReviewExam, endCurrentExam, getBank, getCompletion, getExplanationResearchEvidence, getHistory, getLearningDiagnostics, getProgress, getPublished, getReports, getRoster, getSnapshots, getSyncStatus, importRoster, mergeChapter, migrateRoster, publishCourse, publishQuestions, questionStudents, renameArchiveLabel, saveActivity, saveCourse, saveExplanationResearchEvents, saveLearningEvents, saveSheetConfig, setSchedule, setStudentNotice, setUnitVisibility, sheetsPublish, submitAttempt, submitMixedAttempts, syncRoster, syncSheet, updateReports

## 內容、隔離與測試

- 兩份微免HTML逐位元確認僅一行SDK網址替換；SDK檔案及判定邏輯未改。三份CHP逐位元沿用舊mi/main，只搬到public，網址不變。
- public/materials與dist/materials僅SDK、兩份微免及README；README為materials:sync必要目錄資料。catalog僅兩笔MI，MATERIALS_BASE_URL改MI站，生成網址函式不改。
- .firebaserc仍default ap2-7ed91且位元未改；pages.yml、AP2 deploy.sh、SDK位元未改；.env.local被忽略未提交；AP2題庫與e8805f8完全相同227題。沒有呼吸／血流未核可教材發布。
- npm ci與functions ci成功；materials:sync成功；npm run check成功：前端132/132、Functions29/29，0失敗／跳過，版本及兩端build成功。
- 移除AP2公開HTML的8個快照測試；新增MI核可內容、36個ID、SDK、catalog與白名單驗證；兩個fixtures改為MI目錄。完整逐條清單與理由見 [部署文件](DEPLOY_115-MI.md#測試調整)，沒有修改應用判定邏輯。

## 前端發布（已完成）

首次推送因本機PAT缺workflow scope被GitHub拒絕；教師於2026-10-12更新既有token權限後，一般push成功，沒有force。網站合併提交a2d2a2493d0262ba1ff2c46b16f2c17668746c02，首次發布d26763e3d9847ea80de847a8153152ed8f899190。保留既有mi/main歷史。

[Actions 38197681330](https://github.com/albertchang1008-alt/115-MI/actions/runs/38197681330) build與deploy全部success，包括GitHub上的npm ci、functions ci、完整npm run check。前端發布後才驗證下表：

| 網址 | HTTP |
|---|---|
| [https://albertchang1008-alt.github.io/115-MI/](https://albertchang1008-alt.github.io/115-MI/) | 200 |
| [https://albertchang1008-alt.github.io/115-MI/materials/micro-bacteria-review-v1/index.html](https://albertchang1008-alt.github.io/115-MI/materials/micro-bacteria-review-v1/index.html) | 200 |
| [https://albertchang1008-alt.github.io/115-MI/materials/immuno-concepts-review-v1/index.html](https://albertchang1008-alt.github.io/115-MI/materials/immuno-concepts-review-v1/index.html) | 200 |
| [https://albertchang1008-alt.github.io/115-MI/CHP07_immune_infographic.html](https://albertchang1008-alt.github.io/115-MI/CHP07_immune_infographic.html) | 200 |
| [https://albertchang1008-alt.github.io/115-MI/CHP08_hypersensitivity_infographic.html](https://albertchang1008-alt.github.io/115-MI/CHP08_hypersensitivity_infographic.html) | 200 |
| [https://albertchang1008-alt.github.io/115-MI/CHP16_mycology_infographic.html](https://albertchang1008-alt.github.io/115-MI/CHP16_mycology_infographic.html) | 200 |

Headless Chrome確認登入頁顯示v1.7.1、「使用Google帳號登入」按鈕可用、未出現未設定Firebase提示、0 pageerror。正式載入的JS中VITE_FIREBASE_PROJECT_ID=mi-bd885與authDomain=mi-bd885.firebaseapp.com；登入前畫面本身沒有專案名稱欄，專案名稱顯示位於登入後「平台設定」，尚待教師登入核看。兩份教材皆使用MI站SDK。

網址與執行階段證據見deploy-115-MI-evidence/*.json；登入截圖只存本機/tmp，不納入版控。本次最後的紀錄提交只更新文件及驗證證據，不改應用程式；仍由pages.yml執行check與發布。

## 教師權限（2026-10-12 接續完成）

教師已登入新站提供UID，並親自完成gcloud ADC登入。已執行scripts/set-teacher.cjs，指定mi-bd885，保留既有claims新增teacher:true。獨立getUser讀回驗證：projectId=mi-bd885、UID一致、teacher=true、disabled=false。教師須登出再登入讓token更新。

教師已確認Sheet分享MI服務帳戶，尚未代匯入題庫／名冊或實測Sheet讀寫。最後網站提交d9895be之[Actions 38197847642](https://github.com/albertchang1008-alt/115-MI/actions/runs/38197847642)全部成功。這次Auth設定不需網站重新部署；紀錄只在本機提交，未再push。ADC與UID不寫入公開證據檔，沒有服務帳戶金鑰檔。
