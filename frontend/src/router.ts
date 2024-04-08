import { Form } from "./components/form";
import { Diagram } from "./components/diagramm";
import { Costs } from "./components/costs";
import { Income } from "./components/income";
import { CostsCreate } from "./components/costsCreate";
import { CostsEdit } from "./components/costsEdit";
import { IncomeAndCosts } from "./components/incomeAndCosts";
import { IncomeCostsCreate } from "./components/incomeCostsCreate";
import { IncomeCostsEdit } from "./components/incomeCostsEdit";
import { IncomeCreate } from "./components/incomeCreate";
import { IncomeEdit } from "./components/incomeEdit";
import { Auth } from "./components/services/auth";
import { Logout } from "./components/services/logout";
import { HandleElementsSidebar } from "./components/services/handleElemensSidebar";
import { Sidebar } from "./components/sidebar";
import { RouteType } from "./types/roure.type";
import { UserInfoType } from "./types/user-info.type";

export class Router {
    private contentElement: HTMLElement | null;
    private stylesElement: HTMLLinkElement | null;
    private additionalStyleElement: HTMLLinkElement | null;
    private titleElement: HTMLElement | null;
    private sidebarElement: HTMLElement | null;
    private layoutElement: HTMLElement | null;

    private routes: RouteType[];


    constructor() {
        this.contentElement = document.getElementById('content');
        this.stylesElement = <HTMLLinkElement>document.getElementById('styles');
        this.additionalStyleElement = <HTMLLinkElement>document.getElementById('additionalStyle');
        this.titleElement = document.getElementById('title');
        this.sidebarElement = document.getElementById('sidebar');
        this.layoutElement = document.getElementById('layout');


        this.routes = [
            {
                route: '#/',
                title: 'Главная',
                template: 'templates/index.html',
                styles: 'css/index.css',
                additionalStyle: '',
                isAuth: true,
                load: () => { // для скриптов под каждую страницу
                    new Diagram();
                    new Logout();
                }
            },
            {
                route: '#/signup',
                title: 'Регистрация',
                template: 'templates/signup.html',
                styles: '',
                additionalStyle: '',
                isAuth: false,
                load: () => {
                    new Form('signup');
                }
            },
            {
                route: '#/signin',
                title: 'Авторизация',
                template: 'templates/signin.html',
                styles: '',
                additionalStyle: '',
                isAuth: false,
                load: () => {
                    new Form('signin');
                }
            },
            {
                route: '#/costs',
                title: 'Расходы',
                template: 'templates/costs.html',
                styles: 'css/costs.css',
                additionalStyle: '',
                isAuth: true,
                load: () => {
                    new Costs();
                    new Logout();
                }
            },
            {
                route: '#/costsCreate',
                title: 'Создание категории расходов',
                template: 'templates/costsCreate.html',
                styles: '',
                additionalStyle: '',
                isAuth: true,
                load: () => {
                    new CostsCreate();
                    new Logout();
                }
            },
            {
                route: '#/costsEdit',
                title: 'Редактирование категории расходов',
                template: 'templates/costsEdit.html',
                styles: '',
                additionalStyle: '',
                isAuth: true,
                load: () => {
                    new CostsEdit();
                    new Logout();
                }
            },
            {
                route: '#/income',
                title: 'Доходы',
                template: 'templates/income.html',
                styles: 'css/income.css',
                additionalStyle: '',
                isAuth: true,
                load: () => {
                    new Income();
                    new Logout();
                }
            },
            {
                route: '#/incomeAndCosts',
                title: 'Доходы и расходы',
                template: 'templates/incomeAndCosts.html',
                styles: 'css/index.css',
                additionalStyle: 'css/incomeAndCosts.css',
                isAuth: true,
                load: () => {
                    new IncomeAndCosts();
                    new Logout();
                }
            },
            {
                route: '#/incomeCostsCreate',
                title: 'Создание дохода/расхода',
                template: 'templates/incomeCostsCreate.html',
                styles: '',
                additionalStyle: '',
                isAuth: true,
                load: () => {
                    new IncomeCostsCreate();
                    new Logout();
                }
            },
            {
                route: '#/incomeCostsEdit',
                title: 'Редактирование дохода/расхода',
                template: 'templates/incomeCostsEdit.html',
                styles: '',
                additionalStyle: '',
                isAuth: true,
                load: () => {
                    new IncomeCostsEdit();
                    new Logout();
                }
            },
            {
                route: '#/incomeCreate',
                title: 'Создание категории доходов',
                template: 'templates/incomeCreate.html',
                styles: '',
                additionalStyle: '',
                isAuth: true,
                load: () => {
                    new IncomeCreate();
                    new Logout();
                }
            },
            {
                route: '#/incomeEdit',
                title: 'Редактирование категории доходов',
                template: 'templates/incomeEdit.html',
                styles: '',
                additionalStyle: '',
                isAuth: true,
                load: () => {
                    new IncomeEdit();
                    new Logout();
                }
            },

        ]
    }

    public async openRoute(): Promise<void> {
        // выход из системы
        const urlRout: string = window.location.hash.split('?')[0];
        if (urlRout === '#/logout') {
            const result: boolean = await Auth.logout();
            if (result) {
                window.location.href = '#/signin';
                return;
            } else {
                console.log('Ошибка при выходе из системы')
            }
        }

        const newRoute: RouteType | undefined = this.routes.find(item => {
            return item.route === urlRout;
        });

        if (!newRoute) {
            console.log('Rout не найден!!!!!!!!!!')
            window.location.href = '#/signin';
            return;
        }

        if (!Auth.checkAuth() && newRoute.isAuth) {
            window.location.href = '#/signup'; // перенаправление на страницу авторизации
            return;
        }

        // if (!this.sidebarElement || !this.layoutElement 
        //     || !this.contentElement || !this.stylesElement 
        //     || !this.additionalStyleElement || !this.titleElement) {
        //         if (urlRout === '#/') {
        //             return;
        //         } else {
        //             window.location.href = '#/';
        //         }
        // }
        // добавляем на нужную страницу сайдбар
        if (this.sidebarElement && this.layoutElement) {
            if (!newRoute.isAuth) {
                this.sidebarElement.style.cssText = 'display: none !important';
                this.layoutElement.style.cssText = 'justify-content: center; padding: 0 20px'
            } else {
                this.sidebarElement.style.cssText = '';
                this.layoutElement.style.cssText = '';
                new HandleElementsSidebar();
                new Sidebar();
            }
        }


        //24min + 1:41:50 Проект Quiz: часть 4
        if (this.contentElement) {
            this.contentElement.innerHTML =
                await fetch(newRoute.template)
                    .then(response => response.text());
        }


        // добавляем основные стили
        if (newRoute.styles && newRoute.styles.length > 0 && this.stylesElement) {
            this.stylesElement.setAttribute('href', newRoute.styles);

        }

        // добавляем дополнительные стили
        if (newRoute.additionalStyle && newRoute.additionalStyle.length > 0 && this.additionalStyleElement) {
            this.additionalStyleElement.setAttribute('href', newRoute.additionalStyle);
        }
        // Проверяем, существует ли элемент дополнительного стиля
        if (this.additionalStyleElement) {
            // Очищаем дополнительный стиль при переходе на страницу, которой он не требуется
            if (!newRoute.additionalStyle || newRoute.additionalStyle.length === 0) {
                this.additionalStyleElement.setAttribute('href', '');
            } else {
                // Устанавливаем дополнительный стиль при переходе на страницу, которая его требует
                this.additionalStyleElement.setAttribute('href', newRoute.additionalStyle);
            }
        }
        if (this.titleElement) {
            this.titleElement.innerText = newRoute.title;
        }

        // обрабатываем данные пользователя  1:40:30 Проект Quiz: часть 4

        const userInfo: UserInfoType | null = Auth.getUserInfo();
        const accessToken: string | null = localStorage.getItem(Auth.accessTokenKey);
        const profileFullName: HTMLElement | null = document.getElementById('profile-full-name');

        if (userInfo && accessToken && profileFullName) {
            profileFullName.innerText = `${userInfo.name} ${userInfo.lastName}`;
        } else {
            if (profileFullName) {
                profileFullName.innerText = 'User'
            }
        }

        newRoute.load();

    }
}