# MI 1.9.0 上線交接（2026-10-14）

## 現況：migration完成，Functions部分成功；停在步驟2
教師已結束後測，授權重新從步驟0開始；Claude複驗510b6ad通過，執行目錄release/mi-1.9.0@5dd7058（之後僅文件變更，程式仍為已驗收版本）。
依CODEX_TASK_DEPLOY_MI_1.9.0_2026-10-14.md指定順序執行；Functions CLI失敗後停止，沒有重跑apply／回退／繼續規則索引或Pages。

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

## 步驟2：Functions失敗，後續未執行
執行firebase deploy --only functions --project mi-bd885 --non-interactive（未加force）。
- predeploy build與51入口檢查通過。
- CLI回報59個成功操作（5 create／54 update）；包括反思、互動設定及既有測驗／互動／進度等函式。
- **platform:deleteCourse(asia-east1)更新失敗**，CLI顯示「Failed to make request」「failed to update function」，最終exit2／There was an error deploying functions。
- 尚未另外核對deleteCourse的服務端最終revision，不能把部分成功當成完整部署或已回復。此時不自行修程式／重試部署／回退。
- 完整CLI stdout見docs/unify-1.9.0/mi-functions-deploy-failure.txt；狀態摘要mi-deployment-status.json。
- 規則／索引部署未開始，沒有刪除索引操作或force。
- Pages push未開始，本輪沒有改mi/main或GitHub variables；舊Pages未由本輪更動。
- Actions／hash／索引READY／排程／上線test班驗證尚未執行，不能宣稱MI1.9.0上線完成。

## 下一步
1. 教師指示後，核對／處理Functions的deleteCourse失敗，再完成Functions部署；**migration已成功，不重跑apply**。
2. Functions完全成功後，規則／索引（明確mi-bd885，不force、不刪其他索引）→普通push mi/main，順序不變。
3. 再做Actions／線上hash／索引READY／排程與test班驗證；N551／N552僅唯讀，正式班不建輪、不作答。
4. 開始續作前重新確認無進行中的正式場次／互動，不沿用09:03的過期檢查；不關閉正式場次替代教師。
5. 所有MI Firebase指令明確--project mi-bd885；VITE_SITE_ID維持未設、workflow fallback mi，不改變數。

Excel與正式學生作答／成績未改。不force push、no-verify或略過測試；先前Claude乾淨複驗150／54、0 skipped仍為程式驗收依據，本輪Functions predeploy也成功。
本輪交接只本機commit，私有備份永不提交。
