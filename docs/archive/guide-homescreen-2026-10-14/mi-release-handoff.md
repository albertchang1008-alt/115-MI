# 專案交接（MI 1.9.0 release）
目前版本：1.9.0

## 現況（2026-10-14）
- **報表讀取範圍已授權**：可只讀載入整門課程作答報表／下載整份前後測配對CSV，只核對test；CSV留repo外、不提交、不公布或修改結果。此授權持續有效，不再詢問；尚未下載，原生操作工具阻塞仍在。
- **最新阻塞（教師已提供登入後）**：已於Brave學校設定檔確認1.9.0教師控制台／38頁簡報／無開放互動，但原生操作工具有視窗與AX／畫面不同步、元素無frame／改選無反應，不能可靠完成test驗證；不列確認的平台缺陷。尚未開輪／新作答或下載CSV，A未完成、B未開始。登出操作未能確認，最後畫面仍教師已登入，需本人手動登出。報告docs/MI_1.9.0_A_VALIDATION_STATUS_2026-10-14.md；後續改用工具連線的Chrome教師分頁，原授權有效。
- **最新續作（10/14）**：已只讀gh variable list，git archive b64217d使用相同公開值＋workflow有效SITE_ID=mi乾淨build成功；線上／本機index-Dbnb149l.js SHA256完全一致，證據unify-1.9.0/mi-b64217d-hash-verification.json。取代先前雜湊未比對的停止點。
- test首頁1.9.0、兩筆既有一般測驗100可讀，前後測顯示已結束，TB影片src start=24；完整A驗證仍未完成。教師已授權用既有教師帳號僅操作test班，尚未開輪次或新作答。A完成後才合併guide；此前不得push／部署。
- **教師新規畫要求**：本人為最高管理者，可控制哪些教師及特定班級使用互動。文件docs/CLASSROOM_CLASS_ADMIN_PLAN_2026-10-14.md；現有每輪班級選擇與課程教師授權，尚無最高管理者委派／同課多班並行。僅規畫，不改權限資料或程式。

- **最新停止點**：教師續作授權後，以提升權限merge-tree預檢exit1；handoff.md／DEVELOPMENT_LOG.md內容衝突。未實際merge，未跑合併後MI check，分支HEAD不變。不可沿用先前權限失敗原因；本次只有交接更新未提交，待教師續作指示。
- 共用guide主畫面說明已提交e2dd36c；AP2 check158／54、MI乾淨匯出check150／54及兩站guide1280／390通過、0 skipped。合併前git merge-tree預檢以預設sandbox執行，因Git中繼資料暫存檔權限失敗（exit128）；依教師指示停止，未實際merge、未跑合併後MI check。應使用已授權提升權限，待教師續作指示後合併；不push／部署。
## 先前停止紀錄（13:09；雜湊阻塞已於本輪解除）
- 13:04:08重新查MI open測驗／active session／open互動均0；未沿用09:03。
- deleteCourse唯讀查ACTIVE／deletecourse-00004-zac／updateTime 2026-10-13T11:48:34.464920870Z；單獨重試一次成功，新ACTIVE／deletecourse-00005-xis／updateTime 2026-10-14T05:06:06.501867296Z，未重試整批。
- 規則索引部署成功，無刪索引提示；一般push mi/main到b64217d。Actions38514907129 build/deploy全綠；assessmentSessions索引READY；05:07UTC新排程HTTP200、查得日誌無缺索引錯誤。
- **步驟4失敗停止**：線上JS index-Dbnb149l.js，本機MI build index-C4gGzaUt.js；比對腳本找不到線上同名本機檔ENOENT／exit1，SHA未比對，原因未核對。不重建、不重新部署、不回退。
- test班互動／前後測／影片與guide驗證、N551／N552唯讀確認尚未完成；只登入既有test帳號，未新建輪次或作答。
- 未重跑migration apply、未改Excel／學生資料／GitHub variables；主畫面guide尚未合併。報告docs/DEPLOY_MI_1.9.0_REPORT.md與unify-1.9.0/mi-resume-*證據；後續需教師指示。

## 下一步
1. MI 1.9.0程式已發布b64217d，Functions／規則索引／Pages成功；Actions成功、線上JS與同參數乾淨build雜湊一致。部署完成，但完整上線驗收尚未完成，不能宣稱全功能實測通過。
2. 補A：test舊前後測明細／報表、12題互動文字、倒數／加時／手機作答、完整影片續播、guide；N551／N552首頁與既有紀錄只讀。教師帳號只操作test已授權，不再詢問同項授權。
3. A全部通過後才做B：以MI文件為主保留雙方紀錄，解決handoff／DEVELOPMENT_LOG衝突，合併unify；MI check及guide零失敗零跳過，提交後交Claude複驗。不push／部署。
4. 教師真機驗主畫面iPhone／Android登入與紀錄保存尚待；最高管理者／班級委派是新規畫，未實作，不屬已上線1.9.0功能。
5. 本輪文件與雜湊證據未提交；不重migration、不改variables／Excel／正式學生資料。
