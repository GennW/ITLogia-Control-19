import config from "../config/config";
import { IncomeAndCostOperationsType } from "../types/server/operations-period-type";
import { incomeCostsForm } from "./incomeCostsForm";
import { CustomHttp } from "./services/custom-http";

export class IncomeCostsCreate extends incomeCostsForm {
    constructor() {
        super();

        this.handleOperationCreationClick();
    }

    private handleOperationCreationClick(): void {
        const btnCreateOperation: HTMLElement | null = document.getElementById('btn-create-operation');

        btnCreateOperation?.addEventListener('click', () => {
            // проверяем наличие поля с типом категории
            if (document.getElementById('select')) {
                // если есть категории то кнопка активна
                btnCreateOperation.classList.remove('disabled');

                const selectedCategory: HTMLSelectElement | null = document.getElementById('select') as HTMLSelectElement | null;
                const typeSelect: HTMLSelectElement | null = document.getElementById('type') as HTMLSelectElement | null;

                this.amountInput = (document.getElementById('summ') as HTMLInputElement | null)?.value || '';

                this.dateInput = (document.querySelector('input[type="date"]') as HTMLInputElement | null)?.value || '';
                this.commentInput = (document.getElementById('comment') as HTMLInputElement | null)?.value || '';
                this.selectedOptionId = Number(selectedCategory?.options[selectedCategory.selectedIndex].id);
                this.selectedType = typeSelect?.options[typeSelect.selectedIndex].value === 'Доход' ? 'income' : 'expense';


                if (!this.selectedOptionId || this.amountInput === '' || this.dateInput === '' || this.commentInput === '') {
                    alert('Пожалуйста, заполните все поля.');
                    return;
                } else {
                    this.createOperation(this.selectedType, this.selectedOptionId, this.amountInput, this.dateInput, this.commentInput);

                }
            } else {
                // если нет категории то кнопка не активна
                btnCreateOperation.classList.add('disabled');
                alert(`Создайте категорию ${this.typeSelect?.value}ов в разделе ${this.typeSelect?.value}ы`);
            }
        });
    }

    private async createOperation(selectedType: string, selectedOptionId: number,
        amountInput: string, dateInput: string, commentInput: string): Promise<void> {
        try {
            const createOperation: IncomeAndCostOperationsType[] = await CustomHttp.request(config.host + '/operations', 'POST', {
                type: selectedType,
                amount: amountInput,
                date: dateInput,
                comment: commentInput,
                category_id: selectedOptionId
            });

            if (createOperation) {
                location.href = '#/incomeAndCosts';
            } else {
                console.error("Ошибка при создании операции:");
            }
        } catch (error) {
            console.error('Ошибка при создании операции:', error);
        }
    }
}