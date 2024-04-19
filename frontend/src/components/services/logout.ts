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
            const parentElement: HTMLElement | null = logoutElement.closest('.dropdown');
            if (parentElement) {
                const linkElement: HTMLAnchorElement | null = parentElement.querySelector('a');
                if (linkElement) {
                    linkElement.href = '#/logout';
                } else {
                    console.error('Ссылка не найдена внутри элемента с классом "dropdown"');
                }
            } else {
                console.error('Родительский элемент с классом "dropdown" не найден');
            }
        });
        }
     }
     
}