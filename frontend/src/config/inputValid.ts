/*
Класс InputValidation обеспечивает валидацию содержимого поля ввода, 
препятствуя превышению длины введенных символов, а также форматирует 
введенные данные в соответствии с заданными правилами.*/
import * as bootstrap from 'bootstrap';


export class InputValidation {
    inputElement: HTMLInputElement | null;

    constructor(inputId: string) {
        this.inputElement = document.getElementById(inputId) as HTMLInputElement | null;

        // Проверяем наличие идентификатора перед созданием объекта InputValidation
        if (!inputId) {
            console.error('Отсутствует идентификатор элемента ввода.');
            return;
        }
        // Получаем ссылку на элемент ввода по его идентификатору
        if (!this.inputElement) {
            console.error('Элемент ввода с указанным идентификатором не найден.');
            return;
        }
        // Добавляем слушатель события 'input' для обработки ввода
        this.addInputEventListener();
    }

    // Функция для показа всплывающей подсказки о превышении длины
    private showLengthExceedPopover(): void {
        if (this.inputElement) {
            const popover: bootstrap.Popover = new bootstrap.Popover(this.inputElement, {
                trigger: 'manual',
                content: 'Длина должна быть не более 15 символов',
            });

            // Показываем всплывающую подсказку
            popover.show();
            // Скрываем всплывающую подсказку через 2 секунды
            setTimeout(() => {
                popover.hide();
            }, 2000);
        }
    }

    // Функция для обработки ввода
    private handleInput(): void {
        if (this.inputElement) {
            // Получаем значение из поля ввода
            let inputValue: string = this.inputElement.value;
            // Проверяем, если значение превышает 17 символов
            if (inputValue.length > 15) {
                // Если количество символов больше 17, обрезаем строку
                inputValue = inputValue.slice(0, 15);
                // Вызываем функцию для показа подсказки
                this.showLengthExceedPopover();
            }
            // Приводим первую букву в заглавный регистр и все остальные буквы в строчный регистр
            inputValue = inputValue.charAt(0).toUpperCase() + inputValue.slice(1).toLowerCase();
            // Присваиваем полученное значение обратно в поле ввода
            this.inputElement.value = inputValue;
        }

    }

    // Добавляем слушатель события 'input' для поля ввода
    private addInputEventListener(): void {
        if (this.inputElement) {
            // Привязываем метод handleInput к контексту класса, чтобы использовать this внутри метода
            this.inputElement.addEventListener('input', this.handleInput.bind(this));
        }
    }
}
