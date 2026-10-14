# 專案交接（MI 1.9.0 release）
目前版本：1.9.0

## 現況（2026-10-14）
- worktree .worktrees/release-mi-1.9.0；分支 release/mi-1.9.0。
- 基底mi/main70354e0（含d48aac8），合併共用7a6720e（含CI fixtures修正）；本機merge commit以git log -1查閱。
- 24衝突已核對無標記並解決；d48aac8兩項修正與原fixtures保留。
- workflow缺VITE_SITE_ID時fallback mi；MI GitHub variable未設，唯讀列教師發布前待辦，本輪不改遠端。
- .firebaserc依教師指示不改；所有後續MI Firebase指令必明確--project mi-bd885，不使用AP2 deploy.sh。
- 29個未追蹤AP2公開教材資料夾已移到repo外_mi-merge-aside，沒有提交；指定四檔回到已暫存版本。MI public/materials只有兩份微免教材。
- 分站教材登錄測試兩站都有斷言、不skip；同檔回補unify commit178f862，共用AP2 check158／54全過，AP2不重新部署。
- 純暫存checkout-index匯出＋npm ci跑MI完整check150／Functions54、0 fail／0 skipped；版本／build／51入口通過。
- 乾淨匯出dist只有兩份MI教材＋三CHP，site.json為mi；不依賴未追蹤檔。
- 重跑離線dry-run成功：mi-bd885、12題與slideTransforms一致；未連線正式Firebase。
- Excel引用Claude已完成稽核：暫存結果相對mi/main沒有任何.xlsx變動；不修先前工具，不改Excel。
- 報告docs/MI_1.9.0_RELEASE_PREPARATION.md；check與verification／dry-run證據在docs/unify-1.9.0/。
- 未push mi／apply／部署MI／讀寫正式學生資料或成績。AP2正式main7a6720e不變。

## 下一步
1. 停在本機merge commit，交Claude複驗合併、來源隔離、分站測試與migration計畫。
2. 教師發布前確認／設定MI GitHub VITE_SITE_ID=mi；本輪不修改。
3. Claude通過且教師另行授權後migration→MI Functions→Pages；本輪仍全部禁止。
4. 更新handoff／DEVELOPMENT_LOG；commit結尾[Codex]，不force push／no-verify／skip。
