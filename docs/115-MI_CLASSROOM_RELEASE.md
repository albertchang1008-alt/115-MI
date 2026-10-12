# 115-MI全選項課堂互動發布（2026-10-13）

教師最新授權「先上線」，取代先等Claude獨立PASS的發布順序；Claude未驗收，交辦保留供上線後複驗。

目標：mi-bd885／albertchang1008-alt/115-MI；分支codex/115-mi-assessments，基底a153408；版本1.7.1。只部署platform codebase的五個課堂互動API，再一般push mi HEAD:main觸發Pages。未更動AP2、.firebaserc default、正式前後測／班級名冊／題庫Sheet及Excel，未代開投票。

完整check177項（135前端＋42Functions）、兩端build／49入口通過；UI12頁、1280/390／1.2字級、零自由輸入、鎖定／再投／斷線／隱私／黑屏通過。私有JSON、截圖及.env.local忽略，不進Git或公開build。

後端指令使用--project mi-bd885及functions:platform:<函式>篩選。初次未寫codebase的篩選被CLI拒絕，未執行雲端變更；已改用platform。五個名稱：controlClassroomInteraction、getClassroomInteraction、submitClassroomInteraction、classroomInteractionReport、classroomInteractionRecords。既有規則不改，不輪換SHEETS_SYNC_KEY。

五個新API已全部成功部署到mi-bd885（asia-east1）；前端待一般push與Actions，發布後檢查補入本文件。真實學生Google登入／跨裝置承載尚待測試班驗收，不以本機mock宣稱通過。

使用：教師重新整理MI站，進授課控制台，選互動頁／班級，進全螢幕後按開放作答。學生登入自己的課序，進目前課堂互動，逐項選擇並送出。教師看票數後結束或再投一輪；前後測維持獨立控制。
