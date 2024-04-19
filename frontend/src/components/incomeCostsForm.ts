import config from "../config/config";
import { QueryParamsType } from "../types/query-params-type";
import { RouteParamsType, RouteType } from "../types/roure.type";
import { IncomeAndCostOperationsType } from "../types/server/operations-period-type";
import { UrlManager } from "../utils/url-manager";
import { CustomHttp } from "./services/custom-http";

export class incomeCostsForm {
    protected routeParams: RouteParamsType | QueryParamsType;
    operation: IncomeAndCostOperationsType[] = [];
    editOperation: string | null;
    income: RouteParamsType[] = [];
    amountInput: HTMLInputElement | string = '';
    commentInput: HTMLInputElement | string = '';
    dateInput: HTMLInputElement | string = '';
    selectedType: string | undefined;
    selectedOptionId: number | undefined;
    typeOptions: string[] | undefined;
    typeSelect: HTMLSelectElement | null;
    getCategoriesEndpointHost: string;

    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.editOperation = localStorage.getItem('operationData');
        this.selectedType;
        this.selectedOptionId;
        this.amountInput;
        this.dateInput;
        this.commentInput;
        this.typeOptions;
        this.getCategoriesEndpointHost = '';
        this.renderSelects();
        this.typeSelect = document.getElementById('select') as HTMLSelectElement;
        this.operation = this.editOperation !== null ? JSON.parse(this.editOperation) : [];

    }

    public showHideTitleElements(incomeVisible: boolean, costVisible: boolean): void {
        const titlePageIncome: HTMLElement | null = document.getElementById('title-income');
        const titlePageCost: HTMLElement | null = document.getElementById('title-cost');
        if (titlePageCost) {
            titlePageCost.style.display = costVisible ? 'inline' : 'none';
        }
        if (titlePageIncome) {
            titlePageIncome.style.display = incomeVisible ? 'inline' : 'none';
        }
    }

    private defineTransactionType(): void {
        // определяем тип (доход или расход) на основе параметров URL страницы 
        // incomeCostsCreate где параметр передаем через url и данных  на странице incomeCostsEdit
        // в коротой параметр (тип операции) передаем через localstorage
        if (this.routeParams.idIncome === 'create-income-btn') {
            this.typeOptions = ['Доход'];
            this.selectedType = 'income';
            this.getCategoriesEndpointHost = '/categories/income';
            this.showHideTitleElements(true, false);
        } else if (this.routeParams.idCost === 'create-cost-btn') {
            this.typeOptions = ['Расход'];
            this.selectedType = 'expense';
            this.getCategoriesEndpointHost = '/categories/expense';
            this.showHideTitleElements(false, true);
        } else {
            console.log('Ошибка в вариантах выбора "Тип"');
        }
    }

    private async renderSelects(): Promise<void> {
        const selectContainer: HTMLElement | null = document.querySelector('.col-4');
        this.typeOptions = [];
        this.defineTransactionType();

        try {
            const result: RouteParamsType[] = await CustomHttp.request(config.host + this.getCategoriesEndpointHost);
            // incomeCostsCreate
            if (result) {
                this.income = result;
            } else {
                throw new Error('Неверный формат ответа сервера');
            }

        } catch (error) {
            console.error('Ошибка:', error);
        }

        this.createTypeSelect(selectContainer);
        this.createCategorySelect(selectContainer);
        this.createAmountInput(selectContainer);
        this.createDateInput(selectContainer);
        this.createCommentInput(selectContainer);

        if (!this.routeParams.idIncome && !this.routeParams.idCost) {

            // вызываем фунцию заполнения полей из class IncomeCostsEdit extends incomeCostsForm
            this.fillFormFieldsFromOperation();
        }

    }

    private fillFormFieldsFromOperation(): void {
        const typeSelect: HTMLSelectElement | null = document.getElementById('type')  as HTMLSelectElement;
        const amountInput: HTMLInputElement | null = document.getElementById('summ') as HTMLInputElement;
        // console.log(this.operation)
        const dateInput: HTMLInputElement | null  = document.getElementById('date-input') as HTMLInputElement;
        const commentInput: HTMLInputElement | null  = document.getElementById('comment') as HTMLInputElement;
        const selectElement: HTMLSelectElement | null = document.getElementById('select') as HTMLSelectElement;

        // Устанавливаем значение суммы
        amountInput.value = this.operation[0].amount.toString();

        // Устанавливаем значение даты
        dateInput.value = this.operation[0].date;

        // Устанавливаем значение комментария
        commentInput.value = this.operation[0].comment;

        // Устанавливаем значение категории
        selectElement.value = this.operation[0].category;
    }

    private createTypeSelect(selectContainer: HTMLElement | null): void {
        this.typeSelect = document.createElement('select');
        this.typeSelect.id = 'type';
        this.typeSelect.className = 'form-control mb-2 select-placeholder';
        this.typeSelect.setAttribute('name', 'Тип');
        this.typeSelect.style.color = 'black';

        this.typeOptions?.forEach((option: string) => {
            const optionElement: HTMLOptionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = option;
            this.typeSelect?.appendChild(optionElement);
        });

        selectContainer?.appendChild(this.typeSelect);
    }

    private createCategorySelect(selectContainer: HTMLElement | null): void {
        const selectElement: HTMLSelectElement = document.createElement('select');
        selectElement.id = 'select';
        selectElement.className = 'form-control mb-2 select-placeholder';
        selectElement.setAttribute('name', 'Тип');
        selectElement.style.color = 'grey';

        const defaultOption: HTMLOptionElement = document.createElement('option');
        defaultOption.id = `placeholder`;
        defaultOption.value = '';
        defaultOption.selected = true;
        defaultOption.textContent = 'Тип...';
        selectElement.appendChild(defaultOption);

        this.income.forEach((option: RouteParamsType) => {
            const optionElement: HTMLOptionElement = document.createElement('option');
            optionElement.id = `${option.id}`;
            optionElement.value = option.title || '';
            optionElement.textContent = option.title || '';
            selectElement.appendChild(optionElement);

            selectElement.addEventListener('change', (event) => {
                if (event.target) {
                    const target = event.target as HTMLSelectElement;
                    target.style.color = 'black';
                }
            });

            selectContainer?.appendChild(selectElement);
        });
    }

    createAmountInput(selectContainer: HTMLElement | null) {
        const amountInput: HTMLInputElement = document.createElement('input');
        amountInput.id = 'summ';
        amountInput.className = 'form-control mb-2';
        amountInput.setAttribute('type', 'number');
        amountInput.setAttribute('placeholder', 'Сумма в $...');
        selectContainer?.appendChild(amountInput);

        amountInput.addEventListener('keydown', function (event) {
            if (!(event.key >= '0' && event.key <= '9'
                || event.key === 'Backspace' || event.key === 'Delete'
                || event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
                event.preventDefault();
            }
        });
    }

    createDateInput(selectContainer: HTMLElement | null) {
        const dateInput: HTMLInputElement = document.createElement('input');
        dateInput.id = 'date-input';
        dateInput.className = 'form-control mb-2';
        dateInput.setAttribute('type', 'date');
        dateInput.setAttribute('placeholder', 'Дата...');
        selectContainer?.appendChild(dateInput);

    }

    createCommentInput(selectContainer: HTMLElement | null) {
        const commentInput: HTMLInputElement = document.createElement('input');
        commentInput.id = 'comment';
        commentInput.className = 'form-control md-2';
        commentInput.setAttribute('type', 'text');
        commentInput.setAttribute('placeholder', 'Комментарий...');
        selectContainer?.appendChild(commentInput);
    }

    

}