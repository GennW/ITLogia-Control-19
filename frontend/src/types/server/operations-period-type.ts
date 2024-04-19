export type IncomeAndCostOperationsType = {
    id: number;
    date: string;
    amount: number;
    type: "income" | "expense"; // Ограничение типа "income" или "expense" 
    comment: string;
    category: string;
    title?: string; // incomeEdit в data
}

