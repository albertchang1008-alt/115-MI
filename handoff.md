# 專案交接（MI 1.9.0 release）
目前版本：1.9.0

## 現況（2026-10-14）
- .worktrees/release-mi-1.9.0／release/mi-1.9.0；510b6ad程式已由Claude複驗通過，教師授權MI上線。此次部署使用5dd7058（僅文件新增）。
- 教師結束後測後，09:03:07台灣時間重新唯讀確認open測驗0／active session0／open互動0。
- 四份備份本機匯出，Git info/exclude排除、不得提交；dry-run與保存版逐位元一致。路徑見部署報告。
- **migration apply已成功，不可重跑**；features／draft.features／published.features一致全true，12互動＋簡報轉換與JSON一致，無snapshot欄位。
- **停在步驟2 Functions**：59操作成功（5create／54update），platform:deleteCourse(asia-east1)更新失敗，CLI exit2。沒有自行重試或回退。
- 規則／索引、push mi/main與上線驗證均未開始，本輪未改GitHub variables或mi/main；不能視為MI1.9.0已上線完成。
- deleteCourse服務端最終revision尚未另外核對；舊Pages未由本輪更動，其他已成功Functions不回退。
- docs/DEPLOY_MI_1.9.0_REPORT.md；狀態與stdout見mi-deployment-status.json／mi-functions-deploy-failure.txt；本輪交接commit以git log -1查閱。
- .firebaserc不改；所有MI Firebase指令必明確--project mi-bd885，不使用AP2 deploy.sh。
- VITE_SITE_ID維持未設、workflow fallback mi，不改變數。
- 未改Excel或正式學生作答／成績，不在正式班建立輪次、不force push／no-verify／skip。

## 下一步
1. 教師指示後重新確認無正式活動，核對／處理Functions失敗的deleteCourse；不重apply、不自行回退。
2. Functions完全成功後→規則索引→普通push mi/main；不能換序，刪索引提示保留回報。
3. 再驗證Actions／hash／READY／排程與test班；N551／N552只讀、不建立輪次或作答。
