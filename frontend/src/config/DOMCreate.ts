export class DomCreateCard {
    
    // Создание DOM-элемента с указанным тегом, классами, текстом и атрибутами
   public createElement(tag: string, classList: string[], text: string, attributes: { [key: string]: string }) {
        const element: HTMLElement = document.createElement(tag);

        /*
        Если передан массив, перебираем его и для 
        каждого класса применяем element.classList.add(className)
       */
        if (classList && classList.length > 0) {
            classList.forEach(className => {
                element.classList.add(className);
            });
        }

        if (text) {
            element.textContent = text;
        }

        /*Если передан объект attributes, то методом Object.keys 
        получаем ключи объекта. Затем для каждого ключа элементу 
        применяется устанавливаем указанные атрибуты и их значения.*/
        if (attributes  && Object.keys(attributes).length > 0) {
            Object.keys(attributes).forEach(key => {
                element.setAttribute(key, attributes[key]);
            });
        }

        return element;

    }
}