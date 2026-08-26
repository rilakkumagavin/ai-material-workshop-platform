# Workflow A — NotebookLM content finalization

Workflow A finalizes content; it does not generate or retouch the final image.

## 1. Upload sources to NotebookLM

Accept textbook PDFs, teacher manuals, workbooks, supplementary material, image-based material, and course slides. Use only these sources. Do not interpret checklists or layout rules as lesson text.

## 2. Analyze each lesson

Use this prompt:

> 請根據已上傳教材，分析第【起始課次】課至第【結束課次】課。每一課請整理課名、核心問題、3～5 個主要重點、核心觀念、關鍵詞及教材例子；分析知識邏輯；不要依頁面順序摘要；重組為三個主要教學模組，包含標題、核心問題、核心概念、3～5 個次要重點、教材例子、心智圖關鍵詞及適合挖空內容；最後說明模組一→模組二→模組三的關係。所有內容必須以教材為依據；未提供資訊標示「教材未明確提供」。

## 3. Produce three teaching modules

Each module contains a provisional title, core question, core concept, 3–5 secondary points, source example, and keywords. If the three modules already have a clear progression, causal structure, or whole-part relation, continue without requesting another teacher confirmation. Do not append “是否需要我繼續”.

## 4. Produce candidate student blanks

NotebookLM creates candidates only. IDs are `C01`, `C02`, … and the count is not fixed. Each candidate contains its sentence, answer, importance, recommendation, reason, and source references. Do not output a “需要老師確認” list or image-generation instructions.

Use this prompt:

> 請根據前一步三大教學部分，轉換為「學生版填空心智圖內容底稿」。不要重新分析或新增教材內容。以三部分為三主分支；提出 C01、C02、C03……候選，不固定數量。每個候選標示填空句、答案、重要性（高／中／低）、建議用途（必留／可留／可刪）與原因。保留足夠上下文，不挖無關緊要字詞。學生版不顯示答案。另列教師答案候選。不要輸出「需要老師確認」清單。

## ChatGPT translation — select official blanks

ChatGPT does not reanalyze the material. It selects candidates by core-concept coverage, logical connections, common misconceptions, classification/comparison/causality/order, and A4 readability. Remove trivial, duplicated, or context-poor candidates.

Renumber selected items continuously as `B01`, `B02`, …. Six to twelve is a usual range only. Fewer or more are allowed; if excessive, recommend page splitting.

Use this prompt:

> 請根據 NotebookLM 的 C 編號候選，篩選正式學生版填空。優先保留核心觀念、三部分邏輯關係、易混淆概念、分類、比較、因果、發展順序與關鍵名詞；刪除零碎例子、無關緊要、重複或上下文不足者。依學習順序重新編號為 B01、B02、B03……。數量不固定，一般建議 6～12 題。另列教師答案與單頁 A4 可讀性判斷；過多時提出拆頁方式。學生版不得顯示答案。

## 5. Prepare the image-generation brief

Preserve exactly the selected `B` IDs. Do not add or delete blanks or expose answers. Specify A4 landscape, monochrome readability, three clear blocks, short text, writing space, restrained illustrations, and a split-page recommendation when needed.

Use this prompt:

> 以下是教師已定稿的學生版教材內容與正式填空清單。請不要重新分析教材、不要新增知識、不要改寫答案，也不要新增、刪除或重編 B 編號。請輸出「圖像製作說明」，依序列出：A4 橫式版面與三大分支位置；課名與核心問題的中心位置；每一個 B 編號應放在哪個分支與節點；因果、順序、比較、分類所需的箭頭或連線；黑白列印、文字大小、留白與手寫空間規格。只描述版面，不得加入教材內容。【貼上教師定稿內容與正式 B 清單】

## 6. Produce the image-generation constraint list

This stage only converts the brief into constraints. It must not analyze content, request teacher confirmation, or output answers.

Must preserve: lesson title, core question, three parts, every selected `B` ID, student sentence, keywords, synthesis sentence, and relationship arrows.

Must avoid: dense text, excessive icons, distracting decoration, short answer spaces, misplaced IDs, unclear center, and unclear branches.

Must not contain: teacher answers, new concepts, newly analyzed content, inconsistent blanks, or a repeated teacher-confirmation list.

Before image generation, use this constraint prompt:

> 這是一項視覺排版工作，不是教材分析工作。必須完整保留正式清單中的所有 B 編號；不得新增、刪除、重編或顯示答案。不得加入教材來源以外的文字或知識。版面採 A4 橫式、三大分支、黑白列印友善，且不依賴顏色理解。完成圖片後，只回報版面實作結果；不要要求老師再次檢查內容正確性。【貼上圖像製作說明與正式 B 清單】

## Flow B — image generation

Formal image generation may use the confirmed analysis, three modules, selected `B` blanks, image brief, constraint list, reference image, and review rules. Generate an A4 landscape, monochrome-friendly student worksheet with three clear branches and adequate writing space.

The image model must not add curriculum content, modify official blank IDs, expose answers, reinterpret the material, or treat a reference layout/checklist as curriculum text.
