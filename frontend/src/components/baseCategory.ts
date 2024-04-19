import { DomCreateCard } from "../config/DOMCreate";
import { QueryParamsType } from "../types/query-params-type";
import { RouteParamsType } from "../types/roure.type";
import { UrlManager } from "../utils/url-manager";
import { CustomHttp } from "./services/custom-http";

export abstract class BaseCategory {
    public routeParams: RouteParamsType[] | QueryParamsType;
    private categories: RouteParamsType[];
    protected createCard: DomCreateCard;

    constructor() {
        this.routeParams = UrlManager.getQueryParams();
        this.categories = [];
        this.createCard = new DomCreateCard();
        this.getCategories();
    }

    private async getCategories(): Promise<void> {
        try {
            const result: RouteParamsType[] = await CustomHttp.request(this.getEndpoint());
            // Проверяем наличие результата и его тип
            if (result && Array.isArray(result)) {
                // Проходимся по каждой категории в массиве
                result.forEach((category: RouteParamsType) => {
                    // Проверяем наличие свойства 'error' у каждой категории
                    if (category.error) {
                        console.error('Ошибка:', category.error);
                    } else {
                        console.log('Категории получены успешно')
                    }
                });
                // Сохраняем результат в свойство costs и обрабатываем категории
                this.categories  = result;
                this.processCategories();
            } else {
                console.error('Ошибка при получении категорий расходов: неверный формат данных');
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    private processCategories(): void {
        const container: HTMLElement | null = document.querySelector('.main-items');
        const deleteCategoryElement: HTMLElement | null = document.getElementById('delete-category');

        this.categories.forEach((category: RouteParamsType) => { // Проходим по каждой категории и создаем соответствующие HTML-элементы

            const that = this; // Сохраняем ссылку на текущий контекст

            // Создаем основные элементы
            if (category.id !== undefined && category.title !== undefined) {
                const card: HTMLElement = this.createCard.createElement('div', ['card', 'col-12', 'col-md-6', 'col-lg-4', 'm-2'], '', { 'data-id': category.id.toString() });
                const cardBody: HTMLElement = this.createCard.createElement('div', ['card-body'], '', {}); // Создаем контейнер для содержимого карточки
                const title: HTMLElement = this.createCard.createElement('h5', ['card-title', 'mb-3'], category.title, {}); // Создаем заголовок категории
                const editButton: HTMLElement = this.createCard.createElement('a', ['btn', 'btn-primary', 'me-2'], 'Редактировать', { href: 'javascript:void(0)' }); // Создаем кнопку "Редактировать"
                const deleteButton: HTMLElement = this.createCard.createElement('a', ['btn', 'btn-danger'], 'Удалить', { href: 'javascript:void(0)', 'data-bs-toggle': 'modal', 'data-bs-target': '#exampleModal' }); // Создаем кнопку "Удалить"

                // Добавляем содержимое в карточку
                cardBody.appendChild(title); // Добавляем заголовок в карточку
                cardBody.appendChild(editButton); // Добавляем кнопку "Редактировать" в карточку
                cardBody.appendChild(deleteButton); // Добавляем кнопку "Удалить" в карточку
                card.appendChild(cardBody); // Добавляем содержимое карточки
                if (container) {
                    container.appendChild(card); // Добавляем карточку в контейнер
                }

                // Обработчики событий для кнопок
                deleteButton.onclick = () => {
                    if (category.title !== undefined && category.id !== undefined) {
                        this.populateModal(category.title, category.id);
                      } else {
                        console.error('ID или title не определен для категории:', category);
                      }
                }

                if (deleteCategoryElement) {
                    // Добавление обработчика события клика для кнопки удаления модального окна
                    deleteCategoryElement.onclick = () => {
                        that.deleteCategory(<HTMLElement><unknown>this); // сконвертировать `this` в тип `unknown`, а затем в `HTMLElement`
                    }
                }

                editButton.onclick = () => {
                    location.href = `#${this.getEditRoute()}?id=${category.id}&title=${category.title}`; // При нажатии кнопки "Редактировать" осуществляем переход на другую страницу
                }
            } else {
                console.error('ID или title не определен для категории:', category);
            }
        });

        this.addNewCategoryCard();
    }

    private populateModal(title: string, id: number): void {
        const modalTitle: HTMLElement | null = document.querySelector('.modal-title');
        const deleteCategoryButton: HTMLElement | null = document.getElementById('delete-category');
        if (modalTitle && deleteCategoryButton) {
            modalTitle.textContent = `Вы действительно хотите удалить категорию "${title}"? Связанные элементы будут удалены навсегда.`;
            deleteCategoryButton.setAttribute('data-id', id.toString());
        }
    }

    private async deleteCategory(element: HTMLElement): Promise<void> {
        const dataId: string | null = element.getAttribute('data-id');
        if (dataId) {
            try {
                const deletionResult: RouteParamsType = await CustomHttp.request(this.getDeleteEndpoint(dataId), 'DELETE');
                if (deletionResult) {
                    if (deletionResult.error) {
                        console.error('Ошибка при удалении категории:', deletionResult.error);
                    } else {
                        location.href = `#${this.getListRoute()}`;
                    }
                }
            } catch (error) {
                console.error('Ошибка при удалении категории:', error);
            }
        }

        const modalBackdrop: HTMLElement | null = document.querySelector('.modal-backdrop.show');
        if (modalBackdrop) {
            modalBackdrop.remove();
        }
    }

    protected abstract getEndpoint(): string;
    protected abstract getListRoute(): string;
    protected abstract getEditRoute(): string;
    protected abstract addNewCategoryCard(): void;
    protected abstract getDeleteEndpoint(id: string): string;

}