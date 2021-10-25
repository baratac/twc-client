export interface IntResults {
    question: number;
    answer: number;
    weight: number;
};

export interface AnswersInfo {
    [id: string]: { answer: number, weight: number}
};

export interface EndResults{
    answers: AnswersInfo,
    totalScore: number,
    maxScore: number,
    minScore: number
};


