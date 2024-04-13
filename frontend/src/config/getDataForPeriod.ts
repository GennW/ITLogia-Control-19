import { CustomHttp } from "../components/services/custom-http";
import config from "./config";


export class GetOperationsForPeriod {
    operations: [];


    constructor() {
        // this.wrapperContent = null;
        this.operations = [];
    }
    private static async getOperations(period: string): Promise<void> {

        try {
            const result = await CustomHttp.request(config.host + `/operations?period=${period}`);
            if (result && !result.error) {
                this.operations = result;
                console.log('все операции в том числе с удаленными категориями', result);
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }
}   