# 115-MI 獨立課序部署

版本：1.7.1。網站：`albertchang1008-alt/115-MI`；Firebase：`mi-bd885`，區域 `asia-east1`。115-2-AP2 的網站及 Firebase 完全分開。

本次教師授權 2026-10-12 部署。工作目錄 `.worktrees/site-115-MI`，分支 `deploy/115-MI-site`；自 a593796 合入題庫分離 54a1d3c，再以 `--allow-unrelated-histories` 合併既有 `mi/main`，保留兩邊歷史。不得 force-push。

## 日後部署指令

先確認目前目錄、分支、`git remote get-url mi` 為 `https://github.com/albertchang1008-alt/115-MI.git`。`.firebaserc` default 仍是 ap2-7ed91，禁止依賴它，**每條 Firebase 指令明確帶 `--project mi-bd885`**。不要執行 `scripts/deploy.sh`（其目標是 AP2）。

```sh
firebase projects:list --project mi-bd885
firebase firestore:databases:list --project mi-bd885
npm ci
npm --prefix functions ci
npm run materials:sync
npm run check
```

前端本機 `.env.local` 放教師提供的 VITE_FIREBASE_* 與 VITE_FUNCTIONS_REGION=asia-east1；此檔被 gitignore，不提交。GitHub 四個 repo variables 由教師設定；pages.yml 不改流程，只從 variables 帶入設定。

只有首次設定或教師決定輪換同步金鑰時才執行下式；值不打印、不存進 repo，直接送至 Secret Manager。輪換後必須重新部署 sheetsPublish。若 Google Apps Script 使用同步金鑰，教師須讓它採用同一 Secret Manager 版本，勿把值寫入文件或聊天。

```sh
set -o pipefail
openssl rand -hex 32 | firebase functions:secrets:set SHEETS_SYNC_KEY --data-file - --project mi-bd885 --non-interactive
firebase deploy --only functions,firestore --project mi-bd885 --non-interactive
```

所有函式、規則與索引成功才提交/推送。先 fetch **mi** 並確認 mi/main 為 HEAD 祖先；若遠端有新提交，合併並重新檢查，不能 force。

```sh
git fetch mi main
git merge-base --is-ancestor mi/main HEAD
git push mi deploy/115-MI-site:main
```

等 GitHub Actions build/deploy 綠勾，再檢查登入頁、專案mi-bd885、兩份教材與三份CHP舊網址。僅後端成功不代表前端已發布。

## 公開教材與目錄

- public根目錄保留CHP07_immune_infographic.html、CHP08_hypersensitivity_infographic.html、CHP16_mycology_infographic.html，檔案逐位元沿用mi/main。
- public/materials只保留course-learning.js、micro-bacteria-review-v1、immuno-concepts-review-v1，以及materials:sync所需的README.md（目錄中繼資料，不是額外教材）。所有AP2公開教材移除。
- shared/materials.ts僅兩筆微免登錄；MATERIALS_BASE_URL改為115-MI站，防止教師後台自動帶入AP2網址。materialPageUrl與教材判定邏輯保持不變。
- 兩份教材HTML僅替換SDK網址那一行字串為115-MI站，內容、題目、答案、判定邏輯不改；SDK檔案本身不改。
- 刪除mi舊publish.yml，沿用課序pages.yml（位元不變）。.gitattributes衝突保留共同LF及來源RTF binary規則。
- AP2題庫html/資訊圖表題庫_上傳用.xlsx仍為227題原版本，不加入MI；115-MI完整83題在平台repo外獨立檔，不隨網站發布或自動匯入。

## 測試調整

本分支不發布AP2教材，所以僅移除以下依賴已移除public教材的8個快照測試；保留模型、原始資料驗證、SDK、嵌入安全、完成度及其餘測試，不skip：

| 檔案 | AP2公開檔測試 |
|---|---|
| material.test.ts | 血液組成；課程介紹；止血與血液氣體運送；心臟構造v2；血液單元前測；血液單元後測 |
| material-kit.test.ts | 心臟構造樣板單檔SDK/ID |
| ecg-model.test.ts | ECG建置單檔SDK/widget/ID |

material-registration.test.ts改為兩份MI公開HTML與核可來源逐格、節點/題目ID、SDK、作答核心、目錄分母及公開資料夾白名單驗證；免疫8節點＋細菌6節點，合計36個固定ID。activity-editing.test.ts只改教材目錄fixtures；preview.test.ts只改站別網址預期。應用判定程式不改。完整check為前端132、Functions29，0失敗/跳過，版本與兩端build成功。

## 教師登入與權限（部署後停在此步）

請教師在新站Google登入一次並提供UID。若需設定首位教師，由教師自行執行 `gcloud auth application-default login`，確認ADC帳號可存取mi-bd885後，才依授權執行：

```sh
node scripts/set-teacher.cjs mi-bd885 <教師UID>
```

本次沒有UID，不設定教師claim、不代登入、不匯入題庫或名冊。服務帳戶與實際部署/網址檢查結果見 `DEPLOY_115-MI_REPORT.md`。
