# 微免正式交件與課程題庫分離（2026-10-11教師更正）

115-MI 與 115-2-AP2 共用主程式，課程內容與題庫完全分開；任何課程的題目只寫入該課程自己的題庫檔，不得寫入 html/資訊圖表題庫_上傳用.xlsx（該檔僅屬 115-2-AP2）。

## Excel最新交件

- 平台repo內 `html/資訊圖表題庫_上傳用.xlsx` 僅屬115-2-AP2，已還原e8805f8，位元完全相同；227題、題庫1–228列含標題、說明1–34列，沒有115-MI題目。
- 115-MI專用題庫在 `/Users/HHC/Documents/070326筆記/教學知識庫/04_outputs/platform_115-MI/115-MI_微免資訊圖表題庫.xlsx`（repo外），只有22題；「題庫」第1列為原範本24欄標題，細菌第2–12列、免疫第13–23列，全部課程代碼115-MI。
- 單元依教師指定：細菌「第一小時：細菌」、免疫「第二小時：免疫」；次單元維持各教材原標題。選項換位與答案代碼、Zuvio序號、題目與解析等其餘22欄沿用Claude已逐題核可版本，不改教師定稿內容。「說明」分頁含兩份教材網址與22題合計。
- 新檔已存入指定路徑，重新匯入／逐格與XML檢查／渲染檢視通過。位元與欄位比對數據見[分離驗證](bank-separation-verification.json)。此前將22題追加於AP2的229–250列、合計249題為錯誤處置，已取消；舊question-bank-verification與release-integration-verification僅保留歷史證據，不代表現行題庫。

## 主程式與教材

- 看板ed08854、名冊修正3f6d925及兩份微免教材先前已整合於a593796，仍完整保留；本次從a593796開fix/separate-115-MI-bank。正式catalog為細菌6節點／11題、免疫8節點／11題，教材HTML本次不改，教師定稿原文不改，唯一kit仍核可hues22／216與credits形狀／署名。
- 截圖只存本機，不納入版控；原圖在微免worktree的docs/micro-immuno-review-screenshots，release沒有截圖資料夾。
- 完整 `npm run check` 通過：前端140、Functions29，0失敗／跳過，版本檢查與兩端build成功（1.7.1）。[本次check](bank-separation-check.txt)。
- 不push、不部署；Excel不在網站上，本次網站無更新需求，下次正式部署時一併帶上修正。題庫由教師另匯入115-MI課程專用Google Sheet，不得匯入AP2課程題庫。
