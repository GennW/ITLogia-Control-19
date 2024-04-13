import { Auth } from "./auth";

export class CustomHttp {
    public static async request(url: string, method: string = "GET", body: any = null): Promise<any> {


        // Создаем объект params с методом запроса и заголовками
        const params: any = {
            method: method,
            headers: {
                'Content-type': 'application/json',
                'Accept': 'application/json',
            }
        };
        // Получаем токен доступа из локального хранилища
        let token: string | null = localStorage.getItem(Auth.accessTokenKey);
        if (token) {
            params.headers['x-auth-token'] = token; //присваивание добавляем токен в заголовки запроса под ключем 'x-auth-token'.
        }

        if (body) {
            params.body = JSON.stringify(body);
        }
        // Отправка запроса на сервер для регистрации
        const response: Response = await fetch(url, params);

        
        // проверяем статус сервера
        if (response.status < 200 || response.status >= 300) { // 43 и 48 min Проект Quiz: часть 4
            if (response.status === 401) { // 1:11:40 Проект Quiz: часть 4
                const result = await response.json();
                if (result.error && result.message === "Invalid email or password") {
                    throw new Error("Неверный email или пароль");
                } else {
                    const result: boolean = await Auth.processUnautorizedResponse();

                    if (result) { // 1:18:50 если в auth.js приходит false
                        return await this.request(url, method, body); // рекурсия 1:20 Проект Quiz: часть 4
                    } else {
                        return null; // не будет парсинга json если на странице не найден токен в init() где передается для уатентификации CustomHttp.request 1:19
                    }
                }
            }
            alert('Что-то пошло не так');
            throw new Error(response.statusText);
        }
        // console.log(response)
        return await response.json();
    }
}