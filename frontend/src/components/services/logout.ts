export class Logout {
    constructor() {
        this.addLogoutClickHandler();
    }
    // выход из системы разлогирование
    private addLogoutClickHandler(): void {
        // Найти первый элемент с классом "logout"
        const logoutElement: HTMLElement | null = document.querySelector('.logout');

        // Если элемент был найден, добавить ему обработчик события click
        if (logoutElement) {
            logoutElement.addEventListener('click', function (event) {
                // Изменить ссылку при клике
                const parentElement = logoutElement.closest('.dropdown') as HTMLElement;
                const linkElement = parentElement.querySelector('a') as HTMLAnchorElement;
                linkElement.href = '#/logout';
            });
        }
    }
}