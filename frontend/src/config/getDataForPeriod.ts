import { CustomHttp } from "../components/services/custom-http";
import { IncomeAndCostOperationsType } from "../types/server/operations-period-type";
import config from "./config";

export class GetOperationsForPeriod {
    static operations: IncomeAndCostOperationsType[] = [];

    static async getOperations(period: string): Promise<void> {
        try {
            const result: IncomeAndCostOperationsType[] = await CustomHttp.request(config.host + `/operations?period=${period}`);
            if (result) {
                this.operations = result;
                console.log('все операции в том числе с удаленными категориями', result);
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }
}
