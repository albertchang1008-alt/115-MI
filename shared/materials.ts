// 教材目錄的唯一資料來源（single source of truth）。
//
// public/materials/README.md 的「正式教材版本」表格、教師後台活動表單的「教材版本」
// 下拉選單，兩邊都從這裡讀，不要再各自維護一份容易兜不起來的數字。新增一份教材時：
// 1. 用 `npm run materials:audit` 核對節點數／題目數（有些教材的節點 id 是用變數或
//    陣列組出來的，腳本偵測不到，那種情況需要自己讀程式碼核對，見各筆條目的註解）。
// 2. 在下面加一筆，數字以核對過的為準，不要用猜的。
// 3. 跑 `npm run materials:sync` 讓 README 的表格自動跟上。
//
// scripts/materials.mjs 是用 Node 的 --experimental-strip-types 直接 import 這個檔案
// 拿到真正的 MATERIAL_CATALOG 物件（不是逐行規則讀取的簡易解析），所以排版不是重點，
// 但仍建議一筆一行，方便人眼比對與之後的 git diff。
export interface MaterialCatalogEntry {
  /** 對應 README「正式教材位置」欄；教師後台下拉選單也會顯示這個說明。 */
  label: string;
  tracking: 'interactive';
  nodeTotal: number;
  questionTotal: number;
  /**
   * 選填，補充「驗收設定」欄的完成規則說明。不是每份教材都是「questionTotal 題全對
   * 才完成」——有些教材是 foundation 題（先備知識，答對才能解鎖）＋case 題（限時
   * 連勝才算通關）兩層，這種情況完成條件跟 questionTotal（診斷分母）不是同一件事，
   * 不要自動假設兩者相等，留空就好，不要硬套「全對才完成」這句話。
   */
  note?: string;
}
export const MATERIAL_CATALOG: Record<string, MaterialCatalogEntry> = {
  'micro-bacteria-review-v1': { label: "細菌怎麼害人，我們怎麼對付它｜互動資訊圖表", tracking: 'interactive', nodeTotal: 6, questionTotal: 11, note: "先備 6 題逐題解鎖；病例 5 題全對才通關" },
  'immuno-concepts-review-v1': { label: "從小安的第一年認識免疫｜互動資訊圖表", tracking: 'interactive', nodeTotal: 8, questionTotal: 11, note: "先備 6 題逐題解鎖；病例 5 題全對才通關" },
};

// 正式教材都發布在 GitHub Pages 的 materials/<版本>/index.html；教師選教材版本時自動帶入。
export const MATERIALS_BASE_URL = 'https://albertchang1008-alt.github.io/115-MI/materials/';
export function materialPageUrl(slug: string) {
  return `${MATERIALS_BASE_URL}${slug}/index.html`;
}
