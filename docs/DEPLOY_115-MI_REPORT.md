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

## 前端發布

後端全部成功後才推送mi/main，使用原課序pages.yml。Actions與六個正式網址結果於部署後補記。

## 停止點

等待教師在新站Google登入並提供UID。尚未設定教師claim、不代執行ADC登入、不匯入題庫／名冊。後續由教師完成ADC登入後，才針對mi-bd885設定教師權限。
