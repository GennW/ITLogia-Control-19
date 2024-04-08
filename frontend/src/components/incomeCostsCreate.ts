import config from "../config/config";
import { UrlManager } from "../utils/url-manager";
import { incomeCostsForm } from "./incomeCostsForm";
import { CustomHttp } from "./services/custom-http";

export class IncomeCostsCreate extends incomeCostsForm {
    constructor() {
        super();

        this.handleOperationCreationClick();
    }

    handleOperationCreationClick() {
        const btnCreateOperation = document.getElementById('btn-create-operation');

        btnCreateOperation.addEventListener('click', () => {
            // проверяем наличие поля с типом категории
            if (document.getElementById('select')) {
                // если есть категории то кнопка активна
                btnCreateOperation.classList.remove('disabled');

                const selectedCategory = document.getElementById('select');
                const typeSelect = document.getElementById('type');
                this.amountInput = document.getElementById('summ').value;
                this.dateInput = document.querySelector('input[type="date"]').value;
                this.commentInput = document.getElementById('comment').value;
                this.selectedOptionId = Number(selectedCategory.options[selectedCategory.selectedIndex].id);
                this.selectedType = typeSelect.options[typeSelect.selectedIndex].value === 'Доход' ? 'income' : 'expense';


                if (!this.selectedOptionId || this.amountInput === '' || this.dateInput === '' || this.commentInput === '') {
                    alert('Пожалуйста, заполните все поля.');
                    return;
                } else {
                    this.createOperation(this.selectedType, this.selectedOptionId, this.amountInput, this.dateInput, this.commentInput);

                }
            } else {
                // если нет категории то кнопка не активна
                btnCreateOperation.classList.add('disabled');
                alert(`Создайте категорию ${this.typeSelect.value}ов в разделе ${this.typeSelect.value}ы`);
            }

        });


    }

    async createOperation(selectedType, selectedOptionId, amountInput, dateInput, commentInput) {
        try {
            const createOperation = await CustomHttp.request(config.host + '/operations', 'POST', {
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