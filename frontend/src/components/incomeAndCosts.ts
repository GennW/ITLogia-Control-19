import config from "../config/config";
// import { GetBalance } from "../../config/getBalance";
import icons from "../config/icons";
import { QueryParamsType } from "../types/query-params-type";
import { UrlManager } from "../utils/url-manager";
import { FilterDate } from "./filterDate";
import { CustomHttp } from "./services/custom-http";



export class IncomeAndCosts extends FilterDate {
    routeParams: QueryParamsType;
    
    constructor() {
        super();
        this.routeParams = UrlManager.getQueryParams();
        this.init();
    }

    async init() {
        this.operations = [];

        super.init();
        this.btnCreateRedirectWithId();
        this.deleteOperationsWithUndefinedCategory();
    }


    async getOperations(period) {
        await super.getOperations(period);

        this.deleteOperationsWithUndefinedCategory();
        this.clearTableWithOperations()
        this.createTable();

    }


    async getOperationsWithInterval(period, dateFrom, dateTo) {
        await super.getOperationsWithInterval(period, dateFrom, dateTo);

        this.clearTableWithOperations();
        this.createTable();
    }

    createTable() {
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

    createTableHeader() {
        const thead = document.createElement('thead'); // Создание элемента заголовка таблицы
        const headerNames = ['№ операции', 'Тип', 'Категория', 'Сумма', 'Дата', 'Комментарий', '']; // Наименование столбцов
        const headerRow = this.createTableRow(headerNames, 'text-primary-emphasis'); // Создание строки заголовка таблицы
        thead.appendChild(headerRow); // Добавление строки заголовка к заголовку таблицы
        return thead; // Возврат заголовка таблицы
    }


    createTableBody() {

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
            const row = this.createTableRow(cellData);
            const iconCell = this.createIconCell(data.id);
            row.appendChild(iconCell);
            tbody.appendChild(row);
        });

        return tbody;
    }

    createTableRow(data) {
        const row = document.createElement('tr');
        data.forEach(text => {
            const cell = document.createElement('td');
            cell.textContent = text;
            row.appendChild(cell);
        });
        return row;
    }

    createIconCell(operationId) {
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


    createIconLink(action, toggle, target, icon, operationId) {
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

    async deleteOperation(operationId) {

        try {
            const result = await CustomHttp.request(config.host + '/operations/' + operationId, 'DELETE');
            if (result && !result.error) {



                // Удаление модального окна
                const modal = document.getElementById('exampleModal')
                const modalInstance = bootstrap.Modal.getOrCreateInstance(modal);
                console.log(modalInstance)

                if (modalInstance) {
                    this.updateTable()
                    // Удаляем элемент
                    modalInstance.hide(); // Скрыть модальное окно
                    location.href = '#/incomeAndCosts';
                }

            }
        } catch (error) {
            console.error('Ошибка при удалении операции:', error);
        }
    }



    editDeleteLinkHandler(action, operationId) {
        this.populateModal(operationId);
        const deleteOperationButton = document.getElementById('delete-operation');
        if (action === 'Delete') {
            deleteOperationButton.onclick = () => {
                this.deleteOperation(operationId);
            };

        } else if (action === 'Edit') {
            const operation = this.operations.find(op => op.id === operationId); // Находим операцию по идентификатору
            const operationData = JSON.stringify(operation); // Преобразуем данные операции в JSON строку
            // const encodedOperationData = encodeURIComponent(operationData); // Кодируем JSON строку для передачи через URL            
            localStorage.setItem('operationData', operationData); // Сохраняем данные операции в localStorage
            location.href = `#/incomeCostsEdit?operationId=${operation.id}`; // Переходим на страницу редактирования с передачей operationId в URL

        }
    }

    btnCreateRedirectWithId() {
        const btnIncome = document.getElementById('create-income-btn');
        const btnCost = document.getElementById('create-cost-btn');

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

    populateModal(id) {
        // const modalTitle = document.querySelector('.modal-title'); // Находим элемент с заголовком модального окна
        const deleteOperationButton = document.getElementById('delete-operation'); // Находим кнопку "удалить" в модальном окне
        // modalTitle.textContent = `Вы действительно хотите удалить категорию? Связанные доходы будут удалены навсегда.`;
        deleteOperationButton.setAttribute('data-id', id); // Устанавливаем data-id для кнопки "удалить" в модальном окне, чтобы иметь доступ к идентификатору категории при подтверждении удаления
    }

    // удаление операций несущетвующих категрий из массива
    deleteOperationsWithUndefinedCategory() {

        // Создаем новый массив, в который добавляем только операции с существующими категориями
        let newOperations = this.operations.filter(operation => operation.category !== undefined);

        // Переназначаем this.operations на новый массив без операций с несуществующими категориями
        this.operations = newOperations;


        // Пересоздаем таблицу с использованием обновленного массива
        this.clearTableWithOperations();
        this.createTable();
    }

    async updateTable() {
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

    clearTableWithOperations() {
        const wrapperContent = document.getElementById('content-table');
        wrapperContent.innerHTML = '';  // Очищаем содержимое обертки перед добавлением новой таблицы
    }

}
