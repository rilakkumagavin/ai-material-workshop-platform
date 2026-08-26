export type Importance = "high" | "medium" | "low";
export type Recommendation = "must_keep" | "optional" | "remove";

export interface SourceReference {
  sourceId: string;
  locator?: string;
  excerpt?: string;
}

export interface CandidateBlank {
  candidateId: string;
  sentence: string;
  answer: string;
  importance: Importance;
  recommendation: Recommendation;
  reason: string;
  sourceReferences: SourceReference[];
}

export interface SelectedBlank {
  blankId: string;
  fromCandidateId?: string;
  studentSentence: string;
  answer: string;
  sourceReferences: SourceReference[];
}

export interface LearningModule {
  title: string;
  coreQuestion: string;
  coreConcept: string;
  keyPoints: string[];
  examples: string[];
  keywords: string[];
  candidateBlanks: CandidateBlank[];
  selectedBlanks: SelectedBlank[];
}

export interface LearningUnit {
  lessonTitle: string;
  coreQuestion: string;
  modules: LearningModule[];
  candidateBlankCount: number;
  selectedBlankCount: number;
  isSinglePageRecommended: boolean;
  splitPageSuggestion?: string;
}

export interface ValidationIssue {
  code: string;
  message: string;
  path?: string;
}

export interface ValidationResult {
  valid: boolean;
  issues: ValidationIssue[];
  selectedBlankCountMatches: boolean;
  selectedBlanksTraceable: boolean;
  blankIdsContinuous: boolean;
  studentAnswersHidden: boolean;
  imageGenerationAddedBlankIds: boolean;
}
