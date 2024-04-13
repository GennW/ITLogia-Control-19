import config from "../config/config";
import { InputValidation } from "../config/inputValid";
import { PutTitleInInput } from "../config/putTitle";
import { QueryParamsType } from "../types/query-params-type";
import { UrlManager } from "../utils/url-manager";
import { CustomHttp } from "./services/custom-http";



export class IncomeEdit {
    routeParams: QueryParamsType

    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.cancelModifiedCostsCategory();
        this.initializeUpdateIncomeCategoryListener(); // Инициализация слушателя для обновления категории дохода
        this.populateInputWithRouteParamsTitle(); // Вызов метода подстановки значения routeParams.title в input
    }
    

    // вызов метод для подстановки значения из routeParams.title в input
    private populateInputWithRouteParamsTitle(): void {
        PutTitleInInput.populateInputWithRouteParamsTitle(this.routeParams)
    }

    // Метод для обновления категории дохода
    private async updateIncomeCategory(title: string): Promise<void> {
        try {
            // Создаем объект данных с новым заголовком
            const data: {title: string} = { title: title };
            // Выполняем запрос на сервер для обновления категории дохода
            const result: ??? = await CustomHttp.request(config.host + '/categories/income/' + this.routeParams.id, 'PUT', data);
            // Проверяем наличие ошибок в результате запроса
            if (result.error) {
                throw new Error(result.error);
            }
            console.log('Категория успешно изменена:', result);
            // Перенаправляем пользователя на страницу с доходами после успешного обновления
            location.href = '#/income';
        } catch (error) {
            console.error('Ошибка при сохранении изменений категории:', error);
        }
    }


        // Инициализация слушателя события для кнопки сохранения измененной категории
        private initializeUpdateIncomeCategoryListener(): void {
            // Получаем элемент кнопки сохранения
            const saveModifiedCategoryElement: HTMLElement | null = document.getElementById('save-modified-category-btn');
            const inputValidation = new InputValidation('edit-category-input'); //можно передать в роуты
     
            if (saveModifiedCategoryElement) {
                            // Добавляем слушателя события для нажатия на кнопку сохранения
            saveModifiedCategoryElement.addEventListener('click', () => {
                const title: string = inputValidation.inputElement.value;
                this.updateIncomeCategory(title); // Вызываем метод обновления категории с новым заголовком
            });
            }

        }

    // Метод для отмены изменения категории income
    private cancelModifiedCostsCategory(): void {
        const cancelModifiedCategoryElement: HTMLElement | null = document.getElementById('cancel-modified-category-btn');
        if (cancelModifiedCategoryElement) {
            cancelModifiedCategoryElement.addEventListener('click', () => { // Добавляем слушателя события для нажатия на кнопку
                location.href = '#/income';
            });
        } else {
            console.log('id не найден');
        }

    }
}
