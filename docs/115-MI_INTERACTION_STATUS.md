# 115-MI 課堂互動三項改善：本機交件

日期：2026-10-13。分支`codex/115-mi-assessments`，基底`d48aac87`。依教師指定規格`CODEX_TASK_115-MI_INTERACTION_STATUS_2026-10-13.md`實作；停在本機commit，等待Claude獨立驗收，不push、不部署。

## 完成行為

| 改善 | 行為 |
|---|---|
| 常駐狀態列 | 每頁簡報、全螢幕及歷次結果檢視均保留目前開放輪狀態；綠色開放、橘色時間到、灰色無互動。位於投影片下方右側專用區，不遮住主要內容；黑屏時隱藏。顯示名稱、輪次、已收／參與名冊人數、剩餘或已開時間及結束／加時按鈕。 |
| 投影片綁定 | 只有既有12個互動頁顯示本頁控制。未開放／開放中／已結束分別顯示對應狀態；翻頁不改開關。本頁歷次結果與全域開放輪分開，查看舊結果不會把常駐狀態改成舊輪。 |
| 跨頁開放 | 別頁仍開放時，顯示頁內「結束並開放本頁／取消」確認。使用預期舊輪ID，後端同一transaction關舊輪、建立新輪與更新current。重複確認或其他教師已切換時拒絕過期操作，不會同時開兩輪。 |
| 倒數與加時 | 可選不限時／30／60／90／120／180秒，畫面預設60秒。deadlineAt由後端時鐘建立；截止後3秒內寬限收件，超出回「時間到，作答已截止」。已成功送出的重送仍回原確認，不另計票。 |
| 到時統整 | 到零不自動closed；可由教師結束或按顯示結果收卷統整。＋30秒僅授權教師可操作目前open倒數輪；過期加時從較晚的截止／目前伺服器時間加30秒，恢復完整30秒。不限時與closed輪不能加時。 |
| 學生畫面 | 使用API serverNow與performance.now單調時鐘校正，不依手機壁鐘；顯示倒數、剩10秒提醒，到零禁止新送出並保留未送出的選項，顯示等待老師公布結果。加時後可繼續，已送出的仍鎖定。 |

名冊僅讀取已啟用、屬於本課程及所選班級的資料，開放時保存人數快照`eligibleCount`；不修改名冊，投影不回傳姓名／學號。舊open輪缺人數快照時報表只讀名冊補足；無deadlineAt舊輪視為不限時。沒有新增輪詢：教師仍2秒，學生open仍2秒、其他5秒；250ms tick只更新本機時間顯示。

## 程式與資料邊界

- 僅改MI worktree的`shared/classroom.ts`、`functions/src/classroom.ts`、`src/ClassroomInteraction.tsx`、互動樣式、相關預覽及測試。
- 既有互動題目／選項及計票規則不改；沒有答案鍵、自由填答或正式計分。
- 正式前後測、一般題庫、名冊、成績、一般進度、私有簡報來源、AP2程式與部署均未改。後端新增寫入只在本課程classroomState／classroomRounds／responses。
- 沿用五個互動API：control新增extend、open新增durationSeconds／replaceRoundId；report分回目前activeRound及本頁／選定round，三個時間相關回應帶serverNow。不新增函式入口或索引。
- 舊輪本頁查詢以單欄slideId查詢相容；新輪current保存latestBySlide指標。Functions入口仍49個。
- 沒有連線操作正式Firestore、開正式課堂輪次或執行Firebase／Git遠端寫入。本機fixture只用合成投影片與作答，沒有私有簡報或真實名冊。

## 驗證

`npm run check`：前端137＋Functions46＝183項全部通過，0失敗／0跳過。版本檢查、前端TypeScript與Vite build、後端runtime／TypeScript及49入口載入通過，版本維持1.7.1。

新增四項後端測試覆蓋截止前、截止後寬限、超過3秒拒絕、重送、舊輪不限時、加時權限與過期恢復、跨頁交易及兩教師競爭、過期確認、人數班級隔離與無效時長。原54人重送／收票競爭測試保留。

新增時間顯示單元測試及真實React回歸，1280／390寬、1.2字級、13張合成頁（12互動＋1一般頁），覆蓋三態、非互動頁無開放按鈕、跨頁取消／確認、學生10秒／到零／保留選項／加時／鎖定、時間到顯示結果收卷、歷次結果不改目前輪、全螢幕與黑屏。模擬手機壁鐘快一天，倒數仍依伺服器。pageerror及水平溢位均為0。

重跑：

```sh
npm run check
node scripts/interaction-status-verify.mjs
```

第二條產出截圖及`docs/interaction-status-screenshots/verification.json`。如果受限環境不能啟動測試Chrome，記錄受阻並於可啟動瀏覽器的環境重跑；不能略過算通過。本次未移除外部字型或停用任何測試。

## 截圖與Claude驗收

[截圖集](115-MI_INTERACTION_STATUS_SCREENSHOTS.html)，圖檔與驗證JSON位於`interaction-status-screenshots/`，只含本機合成資料。新增審查請寫`docs/115-MI_INTERACTION_STATUS_CLAUDE_REVIEW.md`。

請Claude依原交辦逐項覆核，尤其交易所有讀取先於寫入、預期輪ID的競爭保護、3秒寬限與重送順序、過期加時、全域active與歷次round隔離、學生時鐘校正，以及390／1.2／黑屏與投影隱私。舊`115-MI_CLASSROOM_CLAUDE_REVIEW.md`只涵蓋已上線d48aac8，不代表本次改善已PASS。

本輪是本機UI與fake Firestore交易回歸；沒有真實Google跨裝置／54人雲端併發、外接投影或正式課堂驗收，不能宣稱已完成。Claude核可後仍由教師另行授權MI後端與前端上線；這次不部署。
