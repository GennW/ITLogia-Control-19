import config from "../config/config";
import { InputValidation } from "../config/inputValid";
import { QueryParamsType } from "../types/query-params-type";
import { RouteParamsType } from "../types/roure.type";
import { UrlManager } from "../utils/url-manager";
import { CustomHttp } from "./services/custom-http";


export class IncomeCreate {
    routeParams: RouteParamsType | QueryParamsType;
    newCategoryNameElement: HTMLInputElement | null;
    createNewCategoryElement: HTMLElement | null;
    clearNewCategoryElement: HTMLElement | null;
    // category: [];


    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.newCategoryNameElement = document.getElementById('new-income-category-name') as HTMLInputElement;

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
        // Получаем значение нового имени категории из элемента формы
        let newCategoryName = this.newCategoryNameElement?.value;
        // let newCategoryName = (this.newCategoryNameElement as HTMLInputElement).value;


        // Форматируем новое имя категории: делаем первую букву заглавной и все остальные буквы строчными
        const inputValidation: InputValidation = new InputValidation('new-income-category-name');
        if (inputValidation.inputElement) {
            newCategoryName = inputValidation.inputElement.value; // Получаем отформатированное значение из экземпляра InputValidation

        } else {
            console.log('Элемент с id не найден');
            return;
        }


        if (newCategoryName !== '') { // Проверяем, что отформатированное имя не пустое
            try {
                const response: RouteParamsType = await CustomHttp.request(config.host + '/categories/income', 'POST', { title: newCategoryName });

                // Обработка ответа от сервера
                console.log(`Новая категория "${newCategoryName}" создана`);
                location.href = '#/income';


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

    private clearCategory(): void {
        if (this.newCategoryNameElement) {
            this.newCategoryNameElement.value = ''; // Очищаем значение поля
            location.href = '#/income';
        }

    }

}