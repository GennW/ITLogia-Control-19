import { CustomHttp } from "./services/custom-http";
import config from "../config/config";

export class Sidebar {

    constructor() {
        this.init();
        this.addEventListeners();
    }

    private async init(): Promise<void> {
        this.toggleSidebar();
        const balanceElement: HTMLElement | null = document.getElementById('common-balance');

        try {
            // Выполняем запрос на получение баланса
            const getBalance: { balance: number } = await CustomHttp.request(config.host + '/balance');

            if (getBalance) {

                if (balanceElement) {
                    const formattedBalance: string = getBalance.balance.toLocaleString();  // Применение форматирования разделителя разрядов
                    balanceElement.innerText = formattedBalance + '$';
                }
                else {
                    console.error('Ошибка при получении баланса');
                }
            }
        } catch (error) {
            console.error('Ошибка при получении баланса:', error);
        }
    }

    private addEventListeners(): void {

        const burgerIcon: HTMLElement | null = document.querySelector('.burger-icon');
        const sidebar: HTMLElement | null = document.querySelector('.sidebar');

        if (burgerIcon && sidebar) {
            burgerIcon.addEventListener('click', (event) => {
                const targetElement = event.target as Element;
                if (!sidebar.contains(targetElement) && targetElement.tagName !== 'A') {
                    sidebar.classList.toggle('active');
                }
            });
        }

        window.addEventListener('resize', this.toggleSidebar);
    }

    private toggleSidebar(): void {
        let width: number = window.innerWidth;
        let burger: HTMLElement | null = document.querySelector('.burger');
        let btnClose: HTMLElement | null = document.querySelector('.btn-close');
        let sidebar: HTMLElement | null = document.querySelector('.sidebar-wrapper');

        if (width >= 1024) {
            if (sidebar) {
                sidebar.style.display = 'block';
                sidebar.classList.remove('offcanvas', 'offcanvas-start');
                sidebar.removeAttribute('data-bs-backdrop');
                sidebar.removeAttribute('tabindex');
                sidebar.removeAttribute('id');
                sidebar.removeAttribute('aria-labelledby');
            }
            if (burger) burger.style.display = 'none';
            if (btnClose) btnClose.style.display = 'none';
        } else if (width < 1024) {
            if (sidebar && burger && btnClose) {
                sidebar.style.display = 'none';
                burger.style.display = 'block';
                btnClose.style.display = 'block';
                sidebar.classList.add('offcanvas', 'offcanvas-start');
                sidebar.setAttribute('data-bs-backdrop', 'static');
                sidebar.setAttribute('tabindex', '-1');
                sidebar.setAttribute('id', 'staticBackdrop');
                sidebar.setAttribute('aria-labelledby', 'staticBackdropLabel');
            }
        }
    }
}
