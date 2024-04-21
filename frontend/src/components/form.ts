import config from "../config/config";
import { Field } from "../types/fields-type";
import { AuthType } from "../types/server/auth.type";
import { Auth } from "./services/auth";
import { CustomHttp } from "./services/custom-http";

export class Form {

    public page: string;
    rememberMeElement: HTMLElement | null;
    processElement: HTMLElement | null;
    fields: Field[];

    constructor(page: string) {
        this.rememberMeElement = null;
        this.processElement = null;
        this.page = page;

        this.fields = [
            {
                email: 'email',
                id: 'email',
                element: null,
                regex: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
                valid: false,
            },
            {
                password: 'password',
                id: 'inputPassword',
                element: null,
                regex: /^(?=.*\d)(?=.*[A-Z]).{10,}$/,
                valid: false,
            },
        ];

        if (this.page === 'signup') {
            this.fields.unshift(
                {
                    name: 'fullName',
                    id: 'full-name',
                    element: null,
                    // Требуется ввод как минимум двух слов с большой буквы, разрешается использование дефиса для двойных фамилий
                    regex: /^([А-ЯЁ][а-ё]*([\s-])){1,}[А-ЯЁ][а-я]*$/i,
                    valid: false,
                }
            );
            this.fields.push(
                {
                    name: 'confirmPassword',
                    id: 'confirm-password',
                    element: null,
                    regex: /^(?=.*\d)(?=.*[A-Z]).{10,}$/,
                    valid: false,
                }
            );
        }


        const that = this;
        this.fields.forEach(item => {

            item.element = document.getElementById(item.id);

            if (item.element) {
                item.element.onchange = (event: Event) => {
                    that.validateField.call(that, item, event.target as HTMLInputElement);
                };
            }

        });


        this.processElement = document.getElementById('process');
        if (this.processElement) {
            this.processElement.onclick = function () {
                that.processForm();
            }
        }

        if (this.page === 'signin') {
            this.rememberMeElement = document.getElementById('flexCheckDefault');
            if (this.rememberMeElement) {
                this.rememberMeElement.onchange = function () {
                    that.validateForm();
                }
            }
        }
    }


    private validateField(field: Field, element: HTMLInputElement): void {
        if (element) {
            const parent: HTMLElement | null = element.closest('.input-group');
            const errorMessageId: string = 'error-message-' + field.id; // Генерируем уникальный ID для сообщения об ошибке
            let errorMessage: HTMLElement | null = document.getElementById(errorMessageId); // Проверяем существование элемента сообщения об ошибке
            if (!errorMessage && parent && parent.parentNode) {
                errorMessage = document.createElement('span'); // Создаем элемент для сообщения об ошибке, если его нет
                errorMessage.id = errorMessageId; // Устанавливаем уникальный ID
                parent.parentNode.insertBefore(errorMessage, parent.nextSibling); // Вставляем сообщение после родительского блока
            }
            if (!element.value || !element.value.match(field.regex)) {
                if (parent) {
                    parent.style.border = '2px solid red'; // Устанавливаем стиль рамки
                }
                if (errorMessage) {
                    errorMessage.textContent = 'Некорректное значение'; // Выводим сообщение об ошибке
                    errorMessage.style.color = 'red'; // Выводим сообщение об ошибке 
                }

                field.valid = false;

            } else {
                if (parent) {
                    parent.removeAttribute('style'); // Удаляем стиль рамки
                }
                if (errorMessage) {
                    errorMessage.textContent = ''; // Очищаем сообщение об ошибке, если значение корректное
                }

                field.valid = true;
            }

            this.validateForm();
        }

    }

    private validateForm(): boolean {
        // Проверка всех полей на валидность
        const validForm: boolean = this.fields.every(item => item.valid);

        // Поиск поля "inputPassword"
        const passwordField: Field | undefined = this.fields.find(item => item.id === 'inputPassword');
        // Поиск поля "confirm-password"
        const confirmPasswordField: Field | undefined = this.fields.find(item => item.id === 'confirm-password');

        // Получение значений пароля и подтверждения пароля
        const passwordValue: string = passwordField && passwordField.element instanceof HTMLInputElement ? passwordField.element.value : '';
        const confirmPasswordValue: string = confirmPasswordField && confirmPasswordField.element instanceof HTMLInputElement ? confirmPasswordField.element.value : '';

        // Проверка rememberMeElement, если он существует
        const isRemembered = !this.rememberMeElement || (this.rememberMeElement instanceof HTMLInputElement && this.rememberMeElement.checked);

        // Проверка валидности формы, совпадения паролей и rememberMeElement
        const isValid = validForm && (!confirmPasswordField || passwordValue === confirmPasswordValue);

        // Если все условия верны, активировать кнопку
        if (this.processElement) {
            if (isValid) {
                this.processElement.removeAttribute('disabled');
            } else {
                this.processElement.setAttribute('disabled', 'disabled');
            }
        }

        return isValid; // Возвращаем результат валидации формы
    }



    private async processForm(): Promise<void> {
        if (this.validateForm()) {
            let email: string = '';
            let password: string = '';
            let fullName: string = '';
            let passwordRepeat: string = '';

            const emailField: Field | undefined = this.fields.find(item => item.email === 'email');

            if (emailField && emailField.element instanceof HTMLInputElement) {
                email = emailField.element.value;
            }

            const passwordField: Field | undefined = this.fields.find(item => item.password === 'password');
            if (passwordField && passwordField.element instanceof HTMLInputElement) {
                password = passwordField.element.value;
            }


            if (this.page === 'signup') {
                try {
                    // Получение значения полного имени из элемента формы
                    const fullNameField: Field | undefined = this.fields.find(item => item.name === 'fullName');
                    if (fullNameField && fullNameField.element instanceof HTMLInputElement) {
                        fullName = fullNameField.element.value;
                    }

                    const passwordRepeatField: Field | undefined = this.fields.find(item => item.name === 'confirmPassword');
                    if (passwordRepeatField && passwordRepeatField.element instanceof HTMLInputElement) {
                        passwordRepeat= passwordRepeatField.element.value
                    }

                    // Разделение полного имени на составляющие (фамилия и имя)
                    const fullNameParts: string[] = fullName.split(" ");
                    const lastName: string = fullNameParts[0];
                    const name: string = fullNameParts.slice(1).join(" ");

                    const result: AuthType = await CustomHttp.request(config.host + '/signup', 'POST', {
                        name: name, // использование разделенного имени
                        lastName: lastName, // использование разделенной фамилии
                        password: password,
                        passwordRepeat: passwordRepeat,
                        email: email,
                    });

                    if (result) {
                        if (!result.user) {
                            throw new Error(result.message);
                        }
                    }

                } catch (error) {
                    return console.log(error);
                }
            }

            try {
                // Отправка запроса на сервер для регистрации
                const rememberMeElement: HTMLElement | null = this.rememberMeElement;
                const rememberMe = rememberMeElement && rememberMeElement instanceof HTMLInputElement ? rememberMeElement.checked : true;
                const result: AuthType = await CustomHttp.request(config.host + '/login', 'POST', {
                    password: password,
                    rememberMe: rememberMe, // Получение состояния rememberMeElement
                    email: email,
                });

                if (result) {
                    // Проверка наличия токенов и пользователя
                    if (!result.user || !result.tokens || !result.tokens.accessToken || !result.tokens.refreshToken) {
                        throw new Error("Токены не были получены");
                    }

                    //сохраняем токены через класс Auth 1:02 Проект Quiz: часть 4
                    Auth.setTokens(result.tokens.accessToken, result.tokens.refreshToken);

                    // сохраняем ино о пользователе обрабатываем в router
                    Auth.setUserInfo({
                        name: result.user.name,
                        lastName: result.user.lastName,
                        userId: result.user.id,
                    })

                    // Перенаправление на главную страницу в случае успеха
                    location.href = '#/'
                }

            } catch (error) {
                console.log(error);
            }

        }
    }
}
