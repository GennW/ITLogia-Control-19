import { QueryParamsType } from "../types/query-params-type";

export class UrlManager {
    public static getQueryParams(): QueryParamsType {
        const qs: string = document.location.hash.split('+').join(' ');

        let params: QueryParamsType = {};
        let tokens: RegExpExecArray | null;
        let re: RegExp = /[?&]([^=]+)=([^&]*)/g;


        while (tokens = re.exec(qs)) {
            params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        }
        return params;
    }

}

// 41 минута видео

/*
После вызова tokens = re.exec(qs), массив tokens будет содержать следующую информацию:

tokens[0] содержит полное совпадение, то есть весь фрагмент строки, который соответствует регулярному выражению.
tokens[1] содержит значение параметра "name", раскодированное из %D0%90%D0%B0%D0%B0.
tokens[2] содержит значение параметра "lastName", также раскодированное из %D0%90%D0%B0%D0%B0.
tokens[3] содержит значение параметра "email".
Таким образом, элементы массива tokens будут содержать информацию, извлеченную с использованием регулярного выражения, 
соответствующую указанному URL.



Метод decodeURIComponent() используется для декодирования URI компонентов, то есть для преобразования закодированных 
символов обратно в их исходное представление. 

decodeURIComponent() вызывается для декодирования пары ключ=значение, извлеченной при помощи exec(), 
перед добавлением её в объект params.
Пример:
Если есть строка name=%D0%90%D0%B0%D0%B0, то метод decodeURIComponent() преобразует её обратно в исходное значение.
 В данном случае, %D0%90%D0%B0%D0%B0 будет преобразовано в Ааа.
Таким образом, decodeURIComponent() помогает преобразовать символы Unicode, закодированные при помощи encodeURIComponent()) 
обратно в их исходное представление для дальнейшей работы с ними.
*/