# AI 輔助教材轉譯｜教師研習互動平台

純前端、可直接部署至 GitHub Pages 的教師研習平台。網站包含兩條清楚路徑：先在版本 A 與 AI 一起完成一課，再在版本 B 把成功方法交給 Codex 批次執行。

## 兩個教學模式

### A｜AI 協作備課：NotebookLM + ChatGPT

適合第一次使用流程的教師，定位是「AI 協助老師備課與理解教材」。

- A0 今天要完成什麼
- A1 建立教材來源
- A2 理解教材
- A3 重新組織教學
- A4 教學轉譯
- A5 設計學生填空心智圖內容
- A6 教師檢查與定稿
- A7 產生填空心智圖成品：用同一份定稿內容比較 ChatGPT 與 NotebookLM 視覺化版本
- 完成後建立「我的成功樣板」

### B｜批次自動化：Codex + Skill

適合已完成版本 A，或已知道教材格式的教師，定位是「把成熟的教材轉譯方法批次化」。

- B0 理解自動化
- B1 建立 Codex 專案資料夾
- B2 準備 Skill
- B3 放入教材
- B4 一句指令開始批次處理
- B5 自動執行流程
- B6 查看批次成果
- B7 教師批次驗收

## Codex 專案目錄

```text
ai-material-workflow/
├─ materials/                      原始教材
├─ .skills/
│  └─ analyze-learning-materials/
│     └─ SKILL.md                  固定工作方法
├─ templates/                      心智圖與 PDF 版型
└─ output/                         批次成果
```

本網站不會自動建立或上傳這些資料夾；老師需在自己的 Codex 工作環境準備。若已有 `.skills/analyze-learning-materials/SKILL.md`，可直接使用，不要求新手現場自己撰寫。

## 啟動批次工作流

1. 在 Codex 專案建立上述資料夾。
2. 把原始教材放進 `materials/`。
3. 確認 Skill 位於 `.skills/analyze-learning-materials/SKILL.md`。
4. 在網站 B3 輸入起訖課次。
5. 複製 B4 指令並貼到自己的 Codex 工作環境。
6. 從 `output/lesson-XX/` 檢查 PDF、答案與檢查報告。
7. 由教師完成 B7 批次驗收。

## 資料保存

網站使用 `localStorage`，版本 A 與 B 的關卡進度分開保存：

- `missionsA`：A0–A6
- `missionsB`：B0–B7
- `tasksA`／`tasksB`：兩版檢核
- `fields`／`notes`：任務卡、三部分、課次與筆記
- `dynamicLessons`：依起訖課次產生的批次驗收

舊版 `ai-workshop-platform-v2` 資料會自動遷移至版本 A。Markdown 匯出同時包含 A／B 進度與批次驗收。

## 講師模式

兩個版本均支援講師提示。預設介面切換密碼設定於 `script.js` 的 `INSTRUCTOR_PASSWORD`。

此為前端介面切換，只用來避免誤觸，**不是安全權限控制**；沒有帳號系統或後端驗證。

## GitHub Pages

專案只使用相對路徑 `./styles.css`、`./script.js`，不需要建置指令、API Key、AI API 或後端。

1. 將 `index.html`、`styles.css`、`script.js`、`README.md` 推送至 `main`。
2. Repository → Settings → Pages。
3. 選 `Deploy from a branch`、`main`、`/ (root)`。

公開版：<https://rilakkumagavin.github.io/ai-material-workshop-platform/>

## 本機測試

```powershell
python -m http.server 8000
```

瀏覽 `http://localhost:8000/`。

## 限制

- 不教 JSON
- 不使用 API Key 或外部 AI API
- 不含後端、帳號、資料庫、OCR 或多人協作
- 不會自動把教材上傳到第三方平台
- 所有 AI 產出仍須由教師人工檢查
