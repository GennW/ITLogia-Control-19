import config from "../config/config";
import { InputValidation } from "../config/inputValid";
import { QueryParamsType } from "../types/query-params-type";
import { RouteParamsType } from "../types/roure.type";
import { UrlManager } from "../utils/url-manager";
import { CustomHttp } from "./services/custom-http";



export class CostsCreate {
    public routeParams: RouteParamsType[] | QueryParamsType;
    private newCategoryNameElement: HTMLElement | null;
    private createNewCategoryElement: HTMLElement | null;
    private clearNewCategoryElement: HTMLElement | null;


    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.newCategoryNameElement = document.getElementById('new-cost-category-name');
        // this.category = [];

        this.createNewCategoryElement = document.getElementById('create-new-category');
        this.clearNewCategoryElement = document.getElementById('clear-new-category'); // Находим элемент для очистки
        
        if (this.createNewCategoryElement) {
            this.createNewCategoryElement.addEventListener('click', this.createCategory.bind(this));
        }
        if (this.clearNewCategoryElement) {
            this.clearNewCategoryElement.addEventListener('click', this.clearCategory.bind(this)); // Добавляем обработчик для очистки
        }

        this.createCategory();

    }

    private async createCategory(): Promise<void> {
        if (this.newCategoryNameElement instanceof HTMLInputElement) {
            /// Получаем значение нового имени категории из элемента формы
        let newCategoryName: string = this.newCategoryNameElement.value ;

        // Форматируем новое имя категории: делаем первую букву заглавной и все остальные буквы строчными
        const inputValidation: InputValidation = new InputValidation('new-cost-category-name');
        if (inputValidation.inputElement) {
            newCategoryName = inputValidation.inputElement.value; // Получаем отформатированное значение из экземпляра InputValidation

        } else {
            console.log('Элемент с id не найден');
            return;
        }

        if (newCategoryName !== '') {
            try {
                const response: RouteParamsType = await CustomHttp.request(config.host + '/categories/expense', 'POST', { title: newCategoryName });

                location.href = '#/costs';

            } catch (error) {
                if (error) {
                    alert(`Категория "${newCategoryName}" уже существует`);
                } else {
                    // Обработка ошибки
                    console.error('Ошибка:', error);
                }
            }
        } else {
            // Обработка ошибки пустого ввода
            console.log('Пустой ввод');
        }
        }
        
    }

    private clearCategory(): void {
        if (this.newCategoryNameElement instanceof HTMLInputElement) {
            this.newCategoryNameElement.value = ''; // Очищаем значение поля
        }
        
        location.href = '#/costs';
    }
}