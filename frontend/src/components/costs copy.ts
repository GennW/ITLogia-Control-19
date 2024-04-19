import { DomCreateCard } from "../config/DOMCreate";
import config from "../config/config";
import { QueryParamsType } from "../types/query-params-type";
import { RouteParamsType } from "../types/roure.type";
import { UrlManager } from "../utils/url-manager";
import { CustomHttp } from "./services/custom-http";



export class Costs {
    public routeParams: RouteParamsType[] | QueryParamsType;
    private costs: RouteParamsType[];
    private createCard: DomCreateCard;

    constructor() {
        this.costs = []
        this.routeParams = UrlManager.getQueryParams();
        this.createCard = new DomCreateCard();

        this.getCategories();
    }

    private async getCategories(): Promise<void> {
        try {
            const result: RouteParamsType[] = await CustomHttp.request(config.host + '/categories/expense');

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
                this.costs = result;
                this.processCosts();
            } else {
                console.error('Ошибка при получении категорий расходов: неверный формат данных');
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }



    // Обработка списка категорий расходов и добавление их на страницу
    private processCosts(): void {

        // Находим элементы
        const container: HTMLElement | null = document.querySelector('.main-items'); // Получаем контейнер, в котором будем отображать категории
        const deleteCategoryElement: HTMLElement | null = document.getElementById('delete-category'); // Получаем кнопку удаления категории

        this.costs.forEach((category: RouteParamsType) => { // Проходим по каждой категории и создаем соответствующие HTML-элементы

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

                // if (deleteCategoryElement) {
                //     // Добавление обработчика события клика для кнопки удаления модального окна
                //     deleteCategoryElement.onclick = (event) => {
                //         that.deleteCategoryCost(event.target as HTMLElement);
                //     }
                    
                // }
                if (deleteCategoryElement) {
                    // Добавление обработчика события клика для кнопки удаления модального окна
                    deleteCategoryElement.onclick = () => {
                        that.deleteCategoryCost(<HTMLElement><unknown>this); // сконвертировать `this` в тип `unknown`, а затем в `HTMLElement`
                    }
                    
                }


                editButton.onclick = () => {
                    location.href = `#/costsEdit?id=${category.id}&title=${category.title}`; // При нажатии кнопки "Редактировать" осуществляем переход на другую страницу
                }
            } else {
                console.error('ID или title не определен для категории:', category);
            }
        });


        // Создаем элемент "Добавить новую категорию"
        const newCategoryCard: HTMLElement = this.createCard.createElement('div', ['card', 'col-12', 'col-md-6', 'col-lg-4', 'm-2'], '', {}); // Создаем контейнер для новой категории
        const newCategoryCardBody: HTMLElement = this.createCard.createElement('div', ['card-body', 'card-body-last', 'd-flex', 'align-items-center', 'justify-content-center'], '', {}); // Создаем содержимое для новой категории
        const link: HTMLElement = this.createCard.createElement('a', ['link-secondary', 'link-offset-2', 'link-underline', 'link-underline-opacity-0'], '+', { href: '#/costsCreate' }); // Создаем ссылку для создания новой категории

        newCategoryCardBody.addEventListener('click', () => {
            location.hash = '#/costsCreate'; // Добавить обработчик для перехода при клике
        });

        newCategoryCardBody.appendChild(link); // Добавляем ссылку в содержимое карточки
        newCategoryCard.appendChild(newCategoryCardBody); // Добавляем содержимое карточки
        if (container) {
            container.appendChild(newCategoryCard); // Добавляем карточку в контейнер
        }
    }


    //устанавливам идентификатор категории в атрибут data-id кнопки "удалить" в модальном окне.
    private populateModal(title: string, id: number): void {
        const modalTitle: HTMLElement | null = document.querySelector('.modal-title'); // Находим элемент с заголовком модального окна
        const deleteCategoryButton: HTMLElement | null = document.getElementById('delete-category'); // Находим кнопку "удалить" в модальном окне
        if (modalTitle && deleteCategoryButton) {
            modalTitle.textContent = `Вы действительно хотите удалить категорию "${title}"? Связанные расходы будут удалены навсегда.`;
            deleteCategoryButton.setAttribute('data-id', id.toString()); // Устанавливаем data-id для кнопки "удалить" в модальном окне, чтобы иметь доступ к идентификатору категории при подтверждении удаления
        }
      
    }



    // Удаление категории расходов
    private async deleteCategoryCost(element: HTMLElement): Promise<void> {
        const dataId: string | null = element.getAttribute('data-id'); // Получаем идентификатор категории 
        if (dataId) {
            try {
                // Выполняем запрос DELETE к API с передачей идентификатора категории
                const deletionResult: RouteParamsType = await CustomHttp.request(config.host + '/categories/expense/' + dataId, 'DELETE');

                if (deletionResult) {
                    if (deletionResult.error) {
                        console.error('Ошибка при удалении категории:', deletionResult.error);
                    } else {
                        // Успешное удаление - переходим на новую страницу
                        location.href = '#/costs';
                    }
                }
            } catch (error) {
                console.error('Ошибка при удалении категории:', error);
            }
        }

        // Удаление модального окна
        const modalBackdrop: HTMLElement | null = document.querySelector('.modal-backdrop.show');

        if (modalBackdrop) {
            // Удаляем элемент
            modalBackdrop.remove();
        }
    }
}