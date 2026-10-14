# 專案交接（MI 1.9.0 release）
目前版本：1.9.0

## 現況（2026-10-14）
- 共用guide主畫面說明已提交e2dd36c；AP2 check158／54、MI乾淨匯出check150／54及兩站guide1280／390通過、0 skipped。合併前git merge-tree預檢以預設sandbox執行，因Git中繼資料暫存檔權限失敗（exit128）；依教師指示停止，未實際merge、未跑合併後MI check。應使用已授權提升權限，待教師續作指示後合併；不push／部署。
## 2026-10-14 13:09 Codex：MI續上線，停在雜湊驗證
- 13:04:08重新查MI open測驗／active session／open互動均0；未沿用09:03。
- deleteCourse唯讀查ACTIVE／deletecourse-00004-zac／updateTime 2026-10-13T11:48:34.464920870Z；單獨重試一次成功，新ACTIVE／deletecourse-00005-xis／updateTime 2026-10-14T05:06:06.501867296Z，未重試整批。
- 規則索引部署成功，無刪索引提示；一般push mi/main到b64217d。Actions38514907129 build/deploy全綠；assessmentSessions索引READY；05:07UTC新排程HTTP200、查得日誌無缺索引錯誤。
- **步驟4失敗停止**：線上JS index-Dbnb149l.js，本機MI build index-C4gGzaUt.js；比對腳本找不到線上同名本機檔ENOENT／exit1，SHA未比對，原因未核對。不重建、不重新部署、不回退。
- test班互動／前後測／影片與guide驗證、N551／N552唯讀確認尚未完成；只登入既有test帳號，未新建輪次或作答。
- 未重跑migration apply、未改Excel／學生資料／GitHub variables；主畫面guide尚未合併。報告docs/DEPLOY_MI_1.9.0_REPORT.md與unify-1.9.0/mi-resume-*證據；後續需教師指示。

## 下一步
1. 教師指示後核對線上／本機產物差異，再補步驟4測試；deleteCourse已成功，不重apply、不自行回退。
2. Firebase與Pages已發布b64217d；Actions成功，但雜湊驗證未完成，不自行重新部署。
3. 再驗證Actions／hash／READY／排程與test班；N551／N552只讀、不建立輪次或作答。
