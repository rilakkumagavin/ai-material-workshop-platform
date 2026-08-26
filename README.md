# AI 輔助教材轉譯｜教師研習互動平台

純前端、可直接部署至 GitHub Pages 的 3 小時教師研習網站。主要使用者是第一次接觸 NotebookLM、很少使用 ChatGPT、不了解 Codex Skill 的老師。

## 課程定位

網站不重新設計課程內容，也不教 JSON。它帶老師使用自己的單課教材走完固定流程：

教材 → 確認來源 → 找出教學核心 → 重組三個教學部分 → ChatGPT 教學轉譯 → 填空心智圖 → 教師檢查定稿 → 理解 Codex Skill

## 8 個關卡

1. 關卡 0：理解工作流（10 分鐘）
2. 關卡 1：上傳教材（15 分鐘）
3. 關卡 2：找出這一課真正要教什麼（20 分鐘）
4. 關卡 3：重組三個教學部分（25 分鐘）
5. 休息（10 分鐘）
6. 關卡 4：ChatGPT 教學轉譯（30 分鐘）
7. 關卡 5：學生填空心智圖（30 分鐘）
8. 休息（10 分鐘）
9. 關卡 6：教師檢查與定稿（20 分鐘）
10. 關卡 7：Codex Skill 概念（10 分鐘）

合計 180 分鐘。

每一關均包含：本關目標、老師現在要做什麼、操作步驟、可複製 Prompt、人工判斷項目、過關條件、本關成果；講師模式會額外顯示示範重點與常見卡關。

## 互動功能

- 學員模式／講師模式前端介面切換；密碼只用來避免誤觸，不是安全權限控制
- 每關統一顯示本關工具、用途、開啟按鈕及 ChatGPT／NotebookLM／Codex 狀態
- 每關底部顯示下一步要攜帶的資料、切換工具與預期任務
- 目前關卡、上一關／下一關、建議時間與全課進度
- 勾選完成後自動前往下一關
- Prompt 一鍵複製
- `localStorage` 自動保存關卡、檢核、輸入、三個教學部分、筆記、模式與目前關卡
- 自動遷移舊版 `ai-workshop-platform-v1` 的既有資料
- 六項成果驗收
- Markdown 研習紀錄匯出
- 桌機、iPad 與手機響應式版面
- 無 API Key、無外部 AI API、無後端

> 教材檔案不會上傳到本網站。老師需自行將 Prompt 複製到 NotebookLM、ChatGPT 或 Codex。所有 AI 產出都必須由教師人工確認。

## 講師模式密碼

預設講師密碼為 `teacher2026`。研習前可在 `script.js` 頂端修改 `INSTRUCTOR_PASSWORD`。

此為前端介面切換，不是安全權限控制。密碼驗證只在瀏覽器前端執行，僅用來避免學員誤觸講師提示。驗證成功後，同一瀏覽器分頁工作階段重新整理不必再次輸入；關閉工作階段後需重新驗證。網站不會把密碼寫入 localStorage。

## GitHub Pages 部署

本專案只使用相對路徑 `./styles.css` 與 `./script.js`，不依賴根目錄絕對路徑，適合部署於 GitHub Pages 的專案子路徑。

1. 將 `index.html`、`styles.css`、`script.js`、`README.md` 放在 repository 根目錄。
2. 推送至 GitHub 的 `main` branch。
3. 開啟 Repository → **Settings** → **Pages**。
4. Source 選 **Deploy from a branch**。
5. Branch 選 `main`，Folder 選 `/ (root)`，按 **Save**。

不需要建置指令或環境變數。若改用 GitHub Actions，也只需發佈這四個靜態檔案。

## 本機測試

可直接開啟 `index.html`。若要以和 GitHub Pages 更接近的 HTTP 環境測試：

```powershell
python -m http.server 8000
```

瀏覽 `http://localhost:8000/`。

## 檔案

- `index.html`：8 關內容、首頁時間軸、成果驗收與操作介面
- `styles.css`：視覺樣式、雙模式、桌機／平板／手機版面
- `script.js`：保存、進度、導覽、複製、計時、匯出與舊資料遷移
- `README.md`：使用與部署說明
