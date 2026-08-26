import type { LearningUnit, SelectedBlank, ValidationIssue, ValidationResult } from "./learningAnalysisSchema";

export interface ValidationContext {
  notebookOutput?: string;
  studentOutput?: string;
  imageConstraintBlankIds?: string[];
  generatedImageBlankIds?: string[];
  hasRepeatedTeacherConfirmationList?: boolean;
}

const flatten = (unit: LearningUnit) => unit.modules.flatMap((module) => module.selectedBlanks);
const expectedId = (index: number) => `B${String(index + 1).padStart(2, "0")}`;

function isTraceable(blank: SelectedBlank, candidateIds: Set<string>) {
  return Boolean((blank.fromCandidateId && candidateIds.has(blank.fromCandidateId)) || blank.sourceReferences.length);
}

export function validateMaterialGrounding(unit: LearningUnit, context: ValidationContext = {}): ValidationResult {
  const issues: ValidationIssue[] = [];
  const candidates = unit.modules.flatMap((module) => module.candidateBlanks);
  const selected = flatten(unit);
  const candidateIds = new Set(candidates.map((blank) => blank.candidateId));
  const candidateIdList = candidates.map((blank) => blank.candidateId);
  const selectedIds = selected.map((blank) => blank.blankId);
  const countMatches = unit.selectedBlankCount === selected.length && unit.candidateBlankCount === candidates.length;
  const idsContinuous = selectedIds.every((id, index) => id === expectedId(index)) && new Set(selectedIds).size === selectedIds.length;
  const traceable = selected.every((blank) => isTraceable(blank, candidateIds));
  const answersHidden = !selected.some((blank) => context.studentOutput?.includes(blank.answer));
  const constraintIds = context.imageConstraintBlankIds ?? selectedIds;
  const generatedIds = context.generatedImageBlankIds ?? selectedIds;
  const sameIds = (ids: string[]) => ids.length === selectedIds.length && ids.every((id, index) => id === selectedIds[index]);
  const imageAddedIds = !sameIds(generatedIds);

  if (/\bB\d{2,}\b/.test(context.notebookOutput ?? "")) issues.push({ code: "NOTEBOOK_OFFICIAL_ID", message: "NotebookLM 階段只能產生 C 編號候選。" });
  if (candidateIdList.some((id) => !/^C\d{2,}$/.test(id))) issues.push({ code: "CANDIDATE_ID_FORMAT", message: "候選填空只能使用 C 加流水號，例如 C01。" });
  if (candidateIds.size !== candidateIdList.length) issues.push({ code: "CANDIDATE_ID_DUPLICATED", message: "候選填空 C 編號不可重複。" });
  if (!countMatches) issues.push({ code: "COUNT_MISMATCH", message: "候選或正式填空計數與實際陣列不一致。" });
  if (!idsContinuous) issues.push({ code: "BLANK_ID_SEQUENCE", message: "正式 B 編號有跳號、重複或錯置。" });
  if (!traceable) issues.push({ code: "UNTRACEABLE_BLANK", message: "正式填空無法追溯到候選或教材來源。" });
  if (!answersHidden) issues.push({ code: "ANSWER_EXPOSED", message: "學生版疑似外露教師答案。" });
  if (!sameIds(constraintIds)) issues.push({ code: "CONSTRAINT_ID_MISMATCH", message: "圖片生成限制未完整保留正式 B 編號。" });
  if (imageAddedIds) issues.push({ code: "IMAGE_ID_MISMATCH", message: "圖片生成結果新增、刪除或更換了 B 編號。" });
  if (!unit.isSinglePageRecommended && !unit.splitPageSuggestion) issues.push({ code: "MISSING_SPLIT_GUIDANCE", message: "內容不適合單頁，但缺少拆頁建議。" });
  if (selected.length > 12 && !unit.splitPageSuggestion) issues.push({ code: "EXCESSIVE_BLANKS_WITHOUT_SPLIT", message: "正式填空超過 12 個時，必須提供拆頁或拆單元建議。" });
  if (context.hasRepeatedTeacherConfirmationList) issues.push({ code: "REPEATED_CONFIRMATION", message: "流程 A 不應輸出需要老師再次確認清單。" });

  return { valid: issues.length === 0, issues, selectedBlankCountMatches: countMatches, selectedBlanksTraceable: traceable, blankIdsContinuous: idsContinuous, studentAnswersHidden: answersHidden, imageGenerationAddedBlankIds: imageAddedIds };
}
