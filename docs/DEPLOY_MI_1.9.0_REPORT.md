# MI 1.9.0 上線交接（2026-10-14）

## 2026-10-14 13:09 Codex：MI續上線，停在雜湊驗證
- 13:04:08重新查MI open測驗／active session／open互動均0；未沿用09:03。
- deleteCourse唯讀查ACTIVE／deletecourse-00004-zac／updateTime 2026-10-13T11:48:34.464920870Z；單獨重試一次成功，新ACTIVE／deletecourse-00005-xis／updateTime 2026-10-14T05:06:06.501867296Z，未重試整批。
- 規則索引部署成功，無刪索引提示；一般push mi/main到b64217d。Actions38514907129 build/deploy全綠；assessmentSessions索引READY；05:07UTC新排程HTTP200、查得日誌無缺索引錯誤。
- **步驟4失敗停止**：線上JS index-Dbnb149l.js，本機MI build index-C4gGzaUt.js；比對腳本找不到線上同名本機檔ENOENT／exit1，SHA未比對，原因未核對。不重建、不重新部署、不回退。
- test班互動／前後測／影片與guide驗證、N551／N552唯讀確認尚未完成；只登入既有test帳號，未新建輪次或作答。
- 未重跑migration apply、未改Excel／學生資料／GitHub variables；主畫面guide尚未合併。報告docs/DEPLOY_MI_1.9.0_REPORT.md與unify-1.9.0/mi-resume-*證據；後續需教師指示。

## 停止點與驗證限制
Pages已發布1.9.0，但完整上線驗證未通過。這輪gcloud不存在，改用Firebase CLI既有登入對Cloud Functions v2 GET（describe相同來源）取得state／revision／updateTime，沒有使用任何刪除課程功能。
Actions：https://github.com/albertchang1008-alt/115-MI/actions/runs/38514907129 。CI的check與build/deploy皆成功；本機VITE_SITE_ID=mi build也exit0、site.json為mi，但產物名稱與線上不同。只記錄現象，未推定原因；不可將未完成的比對視為雜湊一致。
本次未合併共用guide主畫面說明；另一項guide任務的交接衝突記錄保留。本輪交接commit只本機，不再次push觸發Pages。

## 先前migration與備份（保留紀錄）
## 步驟0：已完成
- 09:03:07台灣時間重新唯讀檢查：6場前後測、19輪互動，open測驗0、active session0、open互動0。
- 四份指定備份已唯讀匯出：課程根文件、classroomConfig、teacherAssets/presentation、classroomState/current。
- 私有備份只在本機且被Git info/exclude排除；沒有提交備份內容。備份位置：
  `/Users/HHC/Documents/ChatGPT/課程平台1.0/.worktrees/release-mi-1.9.0/docs/unify-1.9.0/mi-prelaunch-backup/2026-10-14T01-03-07-715Z`
- 重跑dry-run與docs/unify-1.9.0/migration-mi-release-dry-run.json逐位元一致。

## 步驟1：已完成，不可重新apply
- 執行原腳本--project mi-bd885 --apply --confirm-mi-only，exit0；舊路徑檢查通過，沒有修改／繞過腳本。
- 唯讀驗證09:04:53：features／draft.features／published.features三處一致，assessments／teachingConsole／classroomInteraction皆true。
- classroomConfig/interactions有12題，連同slideTransforms／interactionNotesPrefix與migration JSON完全一致；沒有exists、_ref、_fieldsProto等snapshot欄位。
- 未改作答／成績／輪次／私有簡報／既有題庫來源，資料仍原路徑。

