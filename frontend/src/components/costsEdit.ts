import config from "../config/config";
import { InputValidation } from "../config/inputValid";
import { QueryParamsType } from "../types/query-params-type";
import { RouteParamsType } from "../types/roure.type";
import { UrlManager } from "../utils/url-manager";
import { CustomHttp } from "./services/custom-http";


export class CostsEdit {
    private routeParams: RouteParamsType | QueryParamsType;

    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.cancelModifiedCostsCategory();
        this.initializeUpdateCostsCategoryListener();
        this.populateInputWithRouteParamsTitle();
    }

    // Дополнительный метод для подстановки значения из routeParams.title в input
    private populateInputWithRouteParamsTitle(): void {
        const editCategoryInputElement: HTMLInputElement | null = document.getElementById('edit-category-input') as HTMLInputElement;
        if (editCategoryInputElement && this.routeParams.title !== undefined) {
            editCategoryInputElement.value = this.routeParams.title; // Подстановка значения из routeParams.title в инпут
        }
    }


    // Метод для обновления категории costs
    private async updateCostsCategory(title: string): Promise<void> {
        try {
            // Создаем объект данных с новым заголовком
            const data: RouteParamsType = { title: title };
            // Выполняем запрос на сервер для обновления категории дохода
            const result: RouteParamsType = await CustomHttp.request(config.host + '/categories/expense/' + this.routeParams.id, 'PUT', data);
            if (result) {
                if (result.error) {
                    throw new Error(result.message);
                }
                console.log('Категория успешно изменена:', result);
                // Перенаправляем пользователя на страницу с доходами после успешного обновления
            }
            // Проверяем наличие ошибок в результате запроса

            location.href = '#/costs';
        } catch (error) {
            console.error('Ошибка при сохранении изменений категории:', error);
        }
    }

    // Инициализация слушателя события для кнопки сохранения измененной категории
    private initializeUpdateCostsCategoryListener(): void {
        // Получаем элемент кнопки сохранения
        const saveModifiedCategoryElement: HTMLElement | null = document.getElementById('save-modified-category-btn');
        const inputValidation: InputValidation = new InputValidation('edit-category-input');

        if (saveModifiedCategoryElement) {
            // Добавляем слушателя события для нажатия на кнопку сохранения
            saveModifiedCategoryElement.addEventListener('click', () => {
                if (inputValidation.inputElement) {
                    const title: string = inputValidation.inputElement.value;
                    this.updateCostsCategory(title); // Вызываем метод обновления категории с новым заголовком
                }

            });
        }

    }

    // Метод для отмены изменения категории costs
    private cancelModifiedCostsCategory(): void {
        const cancelModifiedCategoryElement: HTMLElement | null = document.getElementById('cancel-modified-category-btn');
        if (cancelModifiedCategoryElement) {
            cancelModifiedCategoryElement.addEventListener('click', () => { // Добавляем слушателя события для нажатия на кнопку
                location.href = '#/costs';
            });
        }
    }


}