export interface MindMapNode {
  label: string;
  children?: MindMapNode[];
}

export interface MindMapData {
  topic: string;
  branches: {
    label: string;
    children: { label: string }[];
  }[];
}

export interface Flashcard {
  front: string;
  back: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answerIndex: number;
  explanation: string;
}

export interface Explanations {
  simple: string;
  analogy: string;
  technical: string;
}

export interface LearningMaterials {
  summary: string;
  mindMap: MindMapData;
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  explanations: Explanations;
}
