# 115-MI 即時課堂互動：全選項版本機交件

2026-10-13；版本1.7.1；分支codex/115-mi-assessments；基底a153408。尚未commit、push、部署或寫正式雲端。教師最新指示「先上線」，優先於先等Claude驗收；本輪發布結果見docs/115-MI_CLASSROOM_RELEASE.md，Claude尚未獨立驗收。

## 預覽與題目
- [截圖集](http://127.0.0.1:8771/docs/115-MI_CLASSROOM_PREVIEW.html)
- [教師預覽](http://127.0.0.1:8771/.classroom-preview/index.html?role=teacher)
- [學生預覽](http://127.0.0.1:8771/.classroom-preview/index.html?role=student&uid=student-1)
- 全部12頁逐題選項：`docs/115-MI_CLASSROOM_OPTIONS.md`；程式定義`shared/classroom.ts`。

12頁皆為單選、是非、配對或下拉排序，沒有自由填答。毒素理由、傳播／攔截、抗藥衛教、補體溫度、角色工作、HIV衛教及反思均改固定選項。新增選項包含干擾選項，須Claude按核可私有簡報醫學內容複驗；不新增答案鍵、不計分、不自動顯示正解。原核可教材、題庫及38頁私有資產不改，播放器僅轉換本頁活動指示；備註加註原書寫／分組操作已停用。

預覽只用同一瀏覽器localStorage模擬，v2鍵與舊短答預覽隔離，不連正式Firestore、不產生成績，不能代替真實Google登入／跨裝置驗收。私有簡報、截圖在`.classroom-preview/`，已忽略，不入Git或正式build。重啟可執行`node scripts/classroom-preview.mjs /tmp/115-mi-private-teaching-deck.json`（需保留本機私有JSON）。

## 教師與學生操作
1. 選投影片與班級，預設N551/N552；全螢幕手動開放／結束／再投一輪／顯示結果。不計分、不限時。
2. 約2秒更新已回覆人數與各項票數、百分比；排序依每一步呈現分布。投影沒有文字回覆、姓名、學號、UID。選項代表投票結果，不代表正解。
3. 學生只選答案；伺服器確認後鎖定，每人每輪一份。開放中只看本人作答，結束後才看統計；斷線保留選擇並可重試。
4. 同時只開一輪，翻頁不改開關。再投歸零，保留舊輪，歷次可讀最近100輪。私人參與紀錄限教師控制台，全螢幕隱藏；查看前先暫停投影。B黑屏隱藏結果與投影片。
5. 正式前後測、單元控制與完成度分開；學生入口在課程層，正式測驗介面不被互動打斷。

## API與隔離
- 教師`controlClassroomInteraction`僅接受open／close；已移除hide／show文字操作。
- 學生`getClassroomInteraction`只取本班當前題目與本人作答，開放時不取統計或教師簡報。
- `submitClassroomInteraction`交易同時驗證選項、排序、班級、收票狀態，寫作答與計票；重送回原確認。任意文字、額外欄位、舊text格式拒絕。
- 教師`classroomInteractionReport`及`classroomInteractionRecords`分別取匿名票數與私有名冊紀錄。
- 僅mi-bd885的MI課程；沿用登入／名冊，Client deny規則不改。資料僅classroomState及classroomRounds/responses，每輪最多200人；不儲存自由文字。
- 不寫正式前後測、一般成績／完成度、題庫Sheet或Excel；不動AP2。

## 本機驗證
完整`npm run check`通過：前端135、Functions42，共177項，0失敗／跳過；兩端build與49入口檢查通過。測試涵蓋12頁全選項、非法文字／舊格式拒絕、排序、54人所有題型票數總和及Functions併發重送27/27、收票競爭、權限、鎖定與兩輪隔離。

UI結果見`docs/deploy-115-MI-evidence/classroom-ui.json`：12頁教師1280／學生390、教師390與1.2字級；另確認零文字輸入框、送出鎖定、即時票數、斷線重試、再投、全螢幕隱私、延遲私人回覆丟棄與黑屏。截圖只存本機。

Claude交辦：`docs/CODEX_TASK_115-MI_CLASSROOM_CLAUDE_REVIEW_2026-10-13.md`。待獨立PASS；真實Google登入與Firestore跨裝置／承載仍未驗收，不以本機mock代替。
