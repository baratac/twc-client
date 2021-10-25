export default interface Question {
    id: number,
    question: string,
    answers: [
        {
            id: number,
            answer: string,
            weight: number
        }
    ]
}