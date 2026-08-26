---
name: analyze-learning-materials
description: Analyze source-grounded teaching materials, select student blanks, prepare image-generation briefs, generate worksheet images, and validate outputs without treating layout guidance as curriculum content.
---

# Analyze learning materials

Turn source materials into a student fill-in mind-map worksheet through two strictly separated flows.

## Non-negotiable invariants

- Ground curriculum content only in the supplied textbook, teacher guide, workbook, supplementary material, slide deck, or confirmed NotebookLM analysis.
- Never treat a checklist, layout constraint, error-avoidance rule, revision note, or reference layout image as curriculum content.
- NotebookLM proposes candidate blanks as `C01`, `C02`, …; it must not create official `B` IDs.
- ChatGPT selects official blanks from candidates according to learning value and page readability, then renumbers them continuously as `B01`, `B02`, ….
- The number of official blanks is not fixed. Six to twelve is a recommendation, not a requirement. Recommend splitting pages when density is excessive.
- Image generation performs visual integration only. It must not analyze the material, change content, expose answers, or add, delete, renumber, or replace official `B` IDs.
- Validation and layout instructions are metadata, never student-facing curriculum text.
- 圖片生成只負責視覺整合；Workflow A 不得輸出「需要老師再次確認」清單。

## Route the input before acting

Classify every supplied item as one of:

1. complete curriculum source;
2. NotebookLM analysis;
3. finalized student content;
4. teacher answer key;
5. checklist;
6. layout constraint;
7. error-avoidance rule;
8. revision feedback;
9. reference layout image.

Items 5–8 may only check, format, constrain density, revise layout, or prevent errors. A reference image may guide composition, visual style, sectioning, and monochrome readability only. None may introduce concepts, answers, or official blank changes.

## Workflow

Follow [Workflow A](references/workflow-a.md) for content finalization, candidate and selected blank formats, image briefs, and image constraints. Flow B begins only after Workflow A has produced finalized `B` blanks and an image-generation constraint list.

When the user requests a formal image output, the image model may use the confirmed analysis, three teaching modules, official selected blanks, image brief, constraints, reference layout, and review rules. Its role is layout and visual rendering only.

## Required validation

Use the types in `src/learningAnalysisSchema.ts` and the deterministic checks in `src/validate-material-grounding.ts` when those files are present in the project. Fail validation when:

- NotebookLM output contains official `B` IDs;
- official blank IDs are missing, duplicated, out of order, or non-continuous;
- counts disagree with the arrays;
- an official blank cannot be traced to a candidate or source reference;
- the student version exposes an answer;
- image constraints or rendered output add or remove official IDs;
- dense content lacks a split-page suggestion;
- Workflow A includes a repeated teacher-confirmation list.

Stop and report unresolved source gaps instead of inventing content.
