export class HandleElementsSidebar {
    previousActiveElement: HTMLElement | null
    sidebarElements: Array<{ element: HTMLElement | null, isActive: boolean }>;

    constructor() {
        // Инициализация предыдущего активного элемента
        this.previousActiveElement = null;

        // Массив объектов для хранения данных о элементах
        this.sidebarElements = [
            { element: document.getElementById('main-sidebar'), isActive: true },
            { element: document.getElementById('income-costs-sidebar'), isActive: false },
            { element: document.getElementById('income-sidebar'), isActive: false },
            { element: document.getElementById('costs-sidebar'), isActive: false }
        ];

        // Добавление обработчика кликов для каждого элемента
        this.sidebarElements.forEach((sidebarItem) => {
            if (sidebarItem.element) {
                sidebarItem.element.addEventListener('click', this.handleElementClick.bind(this, sidebarItem));

            }
        });
    }

    // Обработчик кликов
    private handleElementClick(clickedItem: { element: HTMLElement | null, isActive: boolean }, event: Event): void {
        const clickedElement = event.target as HTMLElement;

        // Обновление состояния всех элементов и предыдущего активного элемента
        this.sidebarElements.forEach((sidebarItem) => {
            if (sidebarItem !== clickedItem && sidebarItem.isActive) {
                if (sidebarItem.element) {
                    sidebarItem.element.classList.add('link-dark');
                    sidebarItem.element.classList.remove('active');
                    sidebarItem.isActive = false;
                }

            }
        });

        // Обновление состояния кликнутого элемента
        if (!clickedItem.isActive && clickedItem.element) {
            clickedItem.element.classList.remove('link-dark');
            clickedItem.element.classList.add('active');
            clickedItem.isActive = true;
            this.previousActiveElement = clickedItem.element;
        }

        // Установка активного состояния для кликнутого элемента
        clickedElement.classList.remove('link-dark');
        clickedElement.classList.add('active');
    }

    // Обработчик клика по логотипу
    private handleLogoClick(event: Event): void {
        const firstSidebarElement = this.sidebarElements[0]; // Получить первый элемент
        this.handleElementClick({ element: firstSidebarElement.element, isActive: true }, event);
    }

    // Метод для сворачивания боковой панели
    private toggleSidebarCollapsed(): void {
        const currentURL = location.hash;
        const categorySidebar: HTMLElement | null = document.getElementById('category-sidebar');
        if (currentURL !== '#/income' && currentURL !== '#/costs' && categorySidebar) {
            categorySidebar.classList.add('collapsed');
            categorySidebar.classList.add('active');
            categorySidebar.setAttribute('aria-expanded', 'false');
        }
    }
}

