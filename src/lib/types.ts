export type SimulationStatus = "in_progress" | "completed" | "outcome_added";

export type MessageContext = {
  incomingMessage: string;
  otherPerson: string;
  otherPersonPersonality: string;
  difficultyReason: string;
  goal: string;
  tone: string;
  replyLength: string;
  preserveRelationship: string;
  fear: string;
  aiOpeningMessage?: string;
  otherPersonAttitude?: string;
  previouslyDiscussed?: string;
  redLine?: string;
  relationshipDuration?: string;
  avoidAction?: string;
  noReplyAction?: string;
  closenessLevel?: string;
  pastConversations?: string;
  financialIssue?: string;
  currentAmount?: string;
  minAcceptableLevel?: string;
  leverageOrAlternative?: string;
  noAgreementAction?: string;
  simulationBrief?: string;
  initiatedBy?: "user" | "other" | string;
};

export type Scores = {
  clarity: number;
  confidence: number;
  empathy: number;
  boundaries: number;
  naturalness: number;
  risk: number;
  persuasion: number;
};

export type SuggestedReplies = {
  soft: string;
  clear: string;
  short: string;
};

export type TurnAiResponse = {
  ai_message: string;
  suggested_replies: SuggestedReplies;
  scores: Scores;
  feedback: string;
  better_alternative: string;
};

export type FinalReport = {
  total_score: number;
  summary: string;
  best_sentence: string;
  weakest_sentence: string;
  perceived_by_other_person: string;
  better_alternatives: string[];
  real_life_tips: string[];
  risks: string[];
  detailed_evaluation?: string;
  simulation_goal_result: "evet" | "kismen" | "hayir";
  simulation_goal_explanation: string;
};

export type OutcomeInput = {
  whatHappened: string;
  otherPersonReaction: string;
  goalResult: "evet" | "kismen" | "hayir";
  satisfactionScore: number;
  nextGoal: string;
};

export type OutcomeAdvice = {
  situation_analysis: string;
  what_went_well: string[];
  risks: string[];
  next_steps: string[];
  followup_message: string;
  next_conversation_opener: string;
};
