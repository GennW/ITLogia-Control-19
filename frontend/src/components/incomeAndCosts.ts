import config from "../config/config";
import icons from "../config/icons";
import { QueryParamsType } from "../types/query-params-type";
import { RouteParamsType } from "../types/roure.type";
import { IncomeAndCostOperationsType } from "../types/server/operations-period-type";
import { UrlManager } from "../utils/url-manager";
import { FilterDate } from "./filterDate";
import { CustomHttp } from "./services/custom-http";
import * as bootstrap from 'bootstrap';



export class IncomeAndCosts extends FilterDate {
    routeParams: RouteParamsType[] | QueryParamsType;
    operations: IncomeAndCostOperationsType[] = [];
    modalInstance: bootstrap.Modal | null = null;
    modalElement: HTMLElement | null = document.getElementById('exampleModal');

    constructor() {
        super();
        this.routeParams = UrlManager.getQueryParams();
        this.init();
    }

    protected async init(): Promise<void> {
        super.init();
        this.btnCreateRedirectWithId();
        this.deleteOperationsWithUndefinedCategory();
        this.initModal()
    }

    private initModal(): void {
        if (this.modalElement) {
            this.modalInstance = new bootstrap.Modal(this.modalElement);
        }
    }
    async getOperations(period: string): Promise<void> {
        try {
            await super.getOperations(period);
            this.deleteOperationsWithUndefinedCategory();
            this.clearTableWithOperations()
            this.createTable();
        } catch (error) {
            console.error('Ошибка при получении операций с фильтром по периоду:', error);
        }
    }


    public async getOperationsWithInterval(period: string, dateFrom: string, dateTo: string): Promise<void> {
        try {
            await super.getOperationsWithInterval(period, dateFrom, dateTo);
            this.clearTableWithOperations();
            this.createTable();
        } catch (error) {
            console.error('Ошибка при получении операций в определенном интервале времени:', error);
        }
    }

    private createTable(): void {
        const wrapperContent = document.getElementById('content-table'); // Получение контейнера для таблицы
        const table = document.createElement('table'); // Создание элемента таблицы
        table.classList.add('table', 'text-center', 'fs-6'); // Добавление классов к таблице

        const thead = this.createTableHeader(); // Создание заголовка таблицы
        table.appendChild(thead); // Добавление заголовка к таблице

        const tbody = this.createTableBody(); // Создание тела таблицы
        table.appendChild(tbody); // Добавление тела к таблице

        if (wrapperContent) {
            wrapperContent.appendChild(table); // Добавление таблицы в контейнер
        }
    }

    private createTableHeader(): HTMLTableSectionElement {
        const thead = document.createElement('thead'); // Создание элемента заголовка таблицы
        const headerNames = ['№ операции', 'Тип', 'Категория', 'Сумма', 'Дата', 'Комментарий', '']; // Наименование столбцов
        const headerRow = this.createTableRow(headerNames, 'text-primary-emphasis'); // Создание строки заголовка таблицы
        thead.appendChild(headerRow); // Добавление строки заголовка к заголовку таблицы
        return thead; // Возврат заголовка таблицы
    }


    private createTableBody(): HTMLTableSectionElement {

        const tbody = document.createElement('tbody'); // Создание элемента тела таблицы
        this.operations.forEach((data, index) => { // Перебор операций для создания строк таблицы
            //массив данных для каждой строки в таблице операций, где каждый элемент массива представляет определенный столбец в таблице
            const cellData = [
                index + 1,
                data.type === 'expense' ? 'Расходы' : 'Доходы', //Если тип равен 'expense', в ячейке будет отображаться 'Расходы', иначе 'Доходы'.
                data.category,
                data.amount,
                data.date,
                data.comment
            ];

            const row = this.createTableRow(cellData.map(data => String(data)));
            // const row = this.createTableRow(cellData);

            const iconCell = this.createIconCell(data.id.toString());
            row.appendChild(iconCell);
            tbody.appendChild(row);
        });

        return tbody;
    }

    private createTableRow(data: string[], cssClass?: string): HTMLTableRowElement {
        const row: HTMLTableRowElement = document.createElement('tr');
        data.forEach((text: string) => {
            const cell: HTMLTableCellElement = document.createElement('td');
            cell.textContent = text;
            row.appendChild(cell);
        });
        if (cssClass) {
            row.classList.add(cssClass);
        }
        return row;
    }

    private createIconCell(operationId: string): HTMLTableCellElement {
        const iconCell = document.createElement('td');
        const icoWrapper = document.createElement('div');
        icoWrapper.classList.add('ico-wrapper', 'text-end');

        const deleteLink = this.createIconLink('Delete', 'modal', '#exampleModal', icons.icoDelete, operationId);
        const editLink = this.createIconLink('Edit', 'incomeCostsEdit', '', icons.icoEdit, operationId);

        icoWrapper.appendChild(deleteLink);
        icoWrapper.appendChild(editLink);

        iconCell.appendChild(icoWrapper);


        return iconCell;
    }


    private createIconLink(action: string, toggle: string, target: string, icon: string, operationId: string): HTMLAnchorElement {
        const link = document.createElement('a');
        link.classList.add('link-offset-2', 'link-', 'link-underline-opacity-0');
        link.href = 'javascript:void(0)';
        link.setAttribute('data-bs-toggle', toggle);
        link.setAttribute('data-bs-target', target);
        link.setAttribute('data-id', operationId);
        link.innerHTML = icon;


        link.addEventListener('click', () => {
            this.editDeleteLinkHandler(action, operationId);
        });

        return link;
    }

    private async deleteOperation(operationId: string): Promise<void> {

        try {
            const result: IncomeAndCostOperationsType[] = await CustomHttp.request(config.host + '/operations/' + operationId, 'DELETE');
            if (result) {

                if (this.modalInstance) {
                    this.updateTable();
                    this.modalInstance.hide(); // Скрыть модальное окно

                    location.href = '#/incomeAndCosts';
                }
                // Удаляем элемент <div class="modal-backdrop show"></div>
                const modalBackdrop = document.querySelector('.modal-backdrop');
                if (modalBackdrop) {
                    modalBackdrop.remove();
                }

            } else {
                console.error('Получен пустой результат или ошибка на сервере');
            }
        } catch (error) {
            console.error('Ошибка при удалении операции:', error);
        }
    }


    private editDeleteLinkHandler(action: string, operationId: string): void {
        this.populateModal(operationId);
        const deleteOperationButton: HTMLElement | null = document.getElementById('delete-operation');
        if (action === 'Delete' && deleteOperationButton) {
            deleteOperationButton.onclick = () => {
                this.deleteOperation(operationId);
            };

        } else if (action === 'Edit') {
            const operation: IncomeAndCostOperationsType | undefined = this.operations.find(op => op.id.toString() === operationId); // Находим операцию по идентификатору
            const operationData: string = JSON.stringify(operation); // Преобразуем данные операции в JSON строку
            // const encodedOperationData = encodeURIComponent(operationData); // Кодируем JSON строку для передачи через URL            
            localStorage.setItem('operationData', operationData); // Сохраняем данные операции в localStorage
            if (operation) {
                location.href = `#/incomeCostsEdit?operationId=${operation.id}`; // Переходим на страницу редактирования с передачей operationId в URL
            }

        }
    }

    private btnCreateRedirectWithId(): void {
        const btnIncome: HTMLElement | null = document.getElementById('create-income-btn');
        const btnCost: HTMLElement | null = document.getElementById('create-cost-btn');

        if (btnIncome) {
            btnIncome.addEventListener('click', function () {
                localStorage.setItem('incomeId', btnIncome.id); // Устанавливаем значение id в локальное хранилище
                location.href = '/#/incomeCostsCreate?idIncome=' + btnIncome.id;
            });
        }
        if (btnCost) {
            btnCost.addEventListener('click', function () {
                localStorage.setItem('costId', btnCost.id); // Устанавливаем значение id в локальное хранилище
                location.href = '/#/incomeCostsCreate?idCost=' + btnCost.id;
            });
        }
    }

    private populateModal(id: string): void {
        const deleteOperationButton = document.getElementById('delete-operation'); // Находим кнопку "удалить" в модальном окне
        deleteOperationButton?.setAttribute('data-id', id); // Устанавливаем data-id для кнопки "удалить" в модальном окне, чтобы иметь доступ к идентификатору категории при подтверждении удаления
    }

    // удаление операций несущетвующих категрий из массива
    private deleteOperationsWithUndefinedCategory(): void {

        // Создаем новый массив, в который добавляем только операции с существующими категориями
        let newOperations: IncomeAndCostOperationsType[] = this.operations.filter(operation => operation.category !== undefined);

        // Переназначаем this.operations на новый массив без операций с несуществующими категориями
        this.operations = newOperations;

        // Пересоздаем таблицу с использованием обновленного массива
        this.clearTableWithOperations();
        this.createTable();
    }

    private async updateTable(): Promise<void> {
        try {
            // Получить актуальные данные об операциях 
            await this.getOperations('all');

            // Очистить предыдущее содержимое таблицы
            this.clearTableWithOperations();

            // Пересоздать таблицу с использованием обновленных данных
            this.createTable();
        } catch (error) {
            console.error('Ошибка при обновлении таблицы:', error);
        }
    }

    private clearTableWithOperations(): void {
        const wrapperContent: HTMLElement | null = document.getElementById('content-table');

        if (wrapperContent) {
            wrapperContent.innerHTML = '';  // Очищаем содержимое обертки перед добавлением новой таблицы
        }
    }

}
