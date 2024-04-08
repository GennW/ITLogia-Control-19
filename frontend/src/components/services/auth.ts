import config from "../../config/config";
import { LogoutResponseType } from "../../types/server/logout-response-type";
import { RefreshResponseType } from "../../types/server/refresh-response.type";
import { UserInfoType } from "../../types/user-info.type";

export class Auth {
    public static accessTokenKey = 'tokens.accessToken';
    private static refreshTokenKey = 'tokens.refreshToken';
    private static UserInfoKey = 'userInfo';

    public static async processUnautorizedResponse(): Promise<boolean> {     // 1:12:30 Проект Quiz: часть 4
        const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response: Response = await fetch(config.host + '/refresh', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ refreshToken: refreshToken })
            });

            // проверяем ответ от сервера
            if (response && response.status === 200) { // 1:17  Проект Quiz: часть 4
                const result: RefreshResponseType | null = await response.json(); // берем ответ от сервера
                if (result && !result.error && result.tokens) { // если нет ошибки
                    this.setTokens(result.tokens.accessToken, result.tokens.refreshToken); // устанавливаем новые токены
                    return true; // если все успешно обновилось то возвращаем true в custom-http в if(result)
                }
            }
        }

        // если запрос пришел с ошибкой, то удаляем токены и переводим пользователя на страницу
        this.removeTokens();
        console.log('запрос пришел с ошибкой, токены удалены');
        location.href = '#/signup';

        return false; // 1:18 Проект Quiz: часть 4
    }


    public static setTokens(accessToken: string, refreshToken: string): void {
        localStorage.setItem(this.accessTokenKey, accessToken);
        localStorage.setItem(this.refreshTokenKey, refreshToken);
    }

    private static removeTokens(): void {
        localStorage.removeItem(this.accessTokenKey);
        localStorage.removeItem(this.refreshTokenKey);
    }

    static checkAuth() {
        const accessToken = localStorage.getItem(this.accessTokenKey);
        const refreshToken = localStorage.getItem(this.refreshTokenKey);

        return accessToken && refreshToken; // возвращает true, если оба токена существуют в localStorage, иначе возвращает false
    }

    // устанавливаем информацию пользователя 
    public static setUserInfo(info: UserInfoType): void {
        // в localStorage храняться только строки поэтому при размещении объекта JSON.stringify
        localStorage.setItem(this.UserInfoKey, JSON.stringify(info));
    }

    // получаем информацию пользователя 
    public static getUserInfo(): UserInfoType | null {
        const userInfo: string | null = localStorage.getItem(this.UserInfoKey);
        if (userInfo) {
            return JSON.parse(userInfo);
        }

        return null;
    }

    public static async logout(): Promise<boolean> {
        // запрос на серврдля удаления токенов при разлогировании        
        const refreshToken: string | null = localStorage.getItem(this.refreshTokenKey);
        if (refreshToken) {
            const response: Response = await fetch(config.host + '/logout', {
                method: 'POST',
                headers: {
                    'Content-type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ refreshToken: refreshToken })
            });

            // проверяем ответ от сервера
            if (response && response.status === 200) { // 1:17  Проект Quiz: часть 4
                const result: LogoutResponseType | null= await response.json(); // берем ответ от сервера
                if (result && !result.error) { // если нет ошибки
                    Auth.removeTokens();
                    localStorage.removeItem(this.UserInfoKey);
                    return true;
                }
            }
        }
        return false
    }
}
