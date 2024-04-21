import config from "../config/config";
import { QueryParamsType } from "../types/query-params-type";
import { UrlManager } from "../utils/url-manager";
import { incomeCostsForm } from "./incomeCostsForm";
import { CustomHttp } from "./services/custom-http";



export class IncomeCostsEdit extends incomeCostsForm {
    routeParams: QueryParamsType;

    constructor() {
        super();
        this.routeParams = UrlManager.getQueryParams();
        this.handleOperationCreationClick();

        // меняем заголовок "Редактирование дохода(расхода)"
        if (this.operation) {
            if (this.operation.type === 'expense') {
                this.showHideTitleElements(false, true);
            } else {
                this.showHideTitleElements(true, false);
            }
        }
    }


    private handleOperationCreationClick(): void {

        document.getElementById('btn-create-operation')?.addEventListener('click', () => {
            const selectedCategory: HTMLSelectElement | null = document.getElementById('select') as HTMLSelectElement;
            const typeSelect: HTMLSelectElement | null = document.getElementById('type') as HTMLSelectElement;
            this.amountInput = (document.getElementById('summ') as HTMLInputElement).value;
            this.dateInput = (document.querySelector('input[type="date"]') as HTMLInputElement).value;
            this.commentInput = (document.getElementById('comment') as HTMLInputElement).value;
            this.selectedOptionId = Number(selectedCategory.options[selectedCategory.selectedIndex].id);
            this.selectedType = typeSelect?.options[typeSelect.selectedIndex].value === 'Доход' ? 'income' : 'expense';

            if (!this.selectedOptionId || this.amountInput === '' || this.dateInput === '' || this.commentInput === '') {
                alert('Пожалуйста, заполните все поля.');
                return;
            } else {
                this.createOperation(this.selectedType, this.selectedOptionId, this.amountInput, this.dateInput, this.commentInput);
            }
        });
    }

    private async createOperation(selectedType: string, selectedOptionId: number, amountInput: string, dateInput: string, commentInput: string): Promise<void> {

        try {
            const createOperation = await CustomHttp.request(config.host + '/operations/' + this.operation.id, 'PUT', {
                type: selectedType,
                amount: amountInput,
                date: dateInput,
                comment: commentInput,
                category_id: selectedOptionId
            });

            if (createOperation && createOperation.error) {
                if (createOperation.message === "This record already exists") {
                    console.error("Ошибка: Запись уже существует");
                } else {
                    console.error("Ошибка при создании операции:", createOperation.message);
                }
            } else {
                location.href = '#/incomeAndCosts';
            }
        } catch (error) {
            console.error('Ошибка при создании операции:', error);
        }
    }

}