# 專案交接（MI 1.9.0 release）
目前版本：1.9.0

## 現況（2026-10-14）
- .worktrees/release-mi-1.9.0／release/mi-1.9.0；510b6ad已由Claude複驗通過，教師授權MI上線。
- 本輪停在步驟0：08:29:50台灣時間查到1個open正式後測，班級N551／N552／test；active session0、open互動輪次0。
- 場次posttest-6133c5c4-ecd4-4247-9ee2-85811b3f58e2仍開放；沒有修改／關閉，須教師結束後再重新檢查。
- 只讀狀態metadata，未讀作答內容／成績。備份、dry-run、apply、Firebase部署、Pages push均未開始。
- 指定備份路徑已加本機Git info/exclude，未匯出備份，不能提交將來的私有備份。
- MI正式1.9.0尚未發布；本輪沒有Git遠端操作，前次mi/main70354e0。
- 最新報告docs/DEPLOY_MI_1.9.0_REPORT.md與mi-prelaunch-blocked.json；本輪交接commit以git log -1查閱，僅本機。
- 本機準備150／54、0 skipped及dist兩教材＋三CHP已由Claude從510b6ad匯出複驗；共用回補178f862，不重新部署AP2。
- .firebaserc不改；所有MI Firebase指令必明確--project mi-bd885。不使用AP2 deploy.sh。
- GitHub VITE_SITE_ID依新交辦維持未設，由workflow fallback mi；不得修改變數。
- 未改Excel或正式學生資料、不在正式班建立輪次、不force push／no-verify／skip。

## 下一步
1. 教師結束後測後，重新檢查無open正式測驗／active session／open互動，不沿用舊檢查。
2. 唯讀備份＋dry-run比對→migration apply→確認寫入→MI Functions→規則／索引→普通push mi/main，順序不得換。
3. 舊路徑檢查擋下即停；CLI刪索引提示一律保留回報；任何失敗停下、不自行回退。
4. 上線後Actions／hash／索引READY／排程、test班驗證；N551／N552僅唯讀。
