# MI 1.9.0 上線交接（2026-10-14）

## 結論：停在步驟0，未執行migration／部署

Claude已複驗release/mi-1.9.0@510b6ad通過，教師已授權MI1.9.0上線。
完整依根目錄CODEX_TASK_DEPLOY_MI_1.9.0_2026-10-14.md開工；發現開放中的正式後測，依指示停止。

## 唯讀開工檢查
- 專案mi-bd885，課程115-1-MI-國考精準對焦。
- 2026-10-14 08:29:50（台灣時間）查核：6個前後測場次、19個互動輪次。
- open測驗1個、active session 0、open互動輪次0；僅讀狀態metadata，不讀作答內容或成績。
- 開放場次：後測（posttest），ID `posttest-6133c5c4-ecd4-4247-9ee2-85811b3f58e2`。
- 班級N551、N552、test；state=open，非testArchived場次。
- active session為0不代表場次已結束；正式班仍可進入作答，不能繼續上線流程。

## 本輪執行範圍
- 讀交接、完整部署交辦與Git狀態，確認分支release/mi-1.9.0／510b6ad、開工工作目錄乾淨。
- 將指定私有備份路徑加入本機Git info/exclude，確保未來備份不提交；沒有匯出任何正式備份資料。
- 唯讀確認场次／輪次狀態後停止；備份、dry-run比對、migration apply、Functions、規則／索引、push mi/main與線上test驗證均未開始。
- 未修改或關閉場次、未建立輪次、未讀寫學生作答或成績、未改Excel／GitHub variables；未force push／no-verify／skip。
- 本輪交接commit只存本機，不push。正式mi/main仍是上次核對的70354e0，尚未發布1.9.0；本輪沒有重新查遠端。

## 下一步（教師結束正式後測後再續）
1. 重新從步驟0檢查沒有open正式測驗／active session／open互動；不能沿用這次已過期的檢查。
2. 唯讀備份課程、classroomConfig、私有presentation、state到被Git排除的本機目錄；重跑dry-run與保存結果一致。
3. migration apply（舊路徑擋下即停，不繞過）→確認寫入→MI Functions→規則／索引→一般push mi/main。
4. 所有MI Firebase指令必明確--project mi-bd885，不force、不刪既有索引；VITE_SITE_ID維持未設、workflow fallback mi。
5. Actions、hash、索引READY／排程與test班驗證；N551／N552只讀確認。任何一步失敗停下，不自行回退。

前次準備證據見MI_1.9.0_RELEASE_PREPARATION.md；此次狀態摘要見docs/unify-1.9.0/mi-prelaunch-blocked.json。沒有正式備份提交到Git。
