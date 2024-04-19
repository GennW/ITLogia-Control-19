import config from "../config/config";
import { BtnType, PeriodHandlersType } from "../types/filterDateType";
import { IncomeAndCostOperationsType } from "../types/server/operations-period-type";
import { CustomHttp } from "./services/custom-http";


export class FilterDate {
    buttons: BtnType;
    operations: IncomeAndCostOperationsType[] = [];

    constructor() {
        this.buttons = {
            FILTER_DAY: document.getElementById('btn-filter-day'),
            FILTER_WEEK: document.getElementById('btn-filter-week'),
            FILTER_MONTH: document.getElementById('btn-filter-month'),
            FILTER_YEAR: document.getElementById('btn-filter-year'),
            FILTER_ALL: document.getElementById('btn-filter-all'),
            FILTER_INTERVAL: document.getElementById('btn-filter-interval')
        };

        this.init();

    }

    protected  async init(): Promise<void> {
        await this.getOperations('all');
        this.setDefaultActiveButton();
        this.bntFilterOperations();
        this.handleIntervalFilter();
    }

    public async getOperations(period: string): Promise<void> {
        try {
            const result: IncomeAndCostOperationsType[] = await CustomHttp.request(config.host + `/operations?period=${period}`);
            if (result) {
                this.operations = result;

            } else {
                console.error('Получен пустой результат или ошибка на сервере');
            }
        } catch (error) {
            console.error('Ошибка:', error);
        }
    }

    private bntFilterOperations(): void {
        // объект для хранения соответствия между идентификаторами кнопок и периодами
        const periodHandlers: PeriodHandlersType = {
            'FILTER_ALL': 'all',
            'FILTER_DAY': 'day',
            'FILTER_WEEK': 'week',
            'FILTER_MONTH': 'month',
            'FILTER_YEAR': 'year',
            'FILTER_INTERVAL': 'interval'
        };

        // обработчики событий клика кнопкам в соответствии с периодами
        for (const buttonId in periodHandlers) {
            // buttonId является ключом объекта PeriodHandlersType
            const typedButtonId = buttonId as keyof PeriodHandlersType;
            // Получаем ссылку на элемент кнопки из объекта this.buttons, где buttonId является ключом объекта BtnType
            const buttonElement = this.buttons[buttonId as keyof BtnType];
            // Добавляем обработчик события клика для каждой кнопки
            if (buttonElement) {
                buttonElement.addEventListener('click', () => {
                    // Вызываем функцию для обновления классов кнопок в зависимости от выбранной кнопки
                    this.updateButtonClass(typedButtonId);
                    // Очищаем содержимое контейнера таблицы перед обновлением
                    // this.clearTableWithOperations();
                    // Получаем и отображаем операции в зависимости от выбранного периода
                    this.getOperations(periodHandlers[typedButtonId]);
                });
            }
        }
    }


    // обработка выбора даты начала и конца интервала
    private handleIntervalFilter(): void {

        // Получаем элементы для выбора дат "От" и "До" интервала
        const dateFrom: HTMLInputElement | null = document.getElementById('startDate') as HTMLInputElement;
        const dateTo: HTMLInputElement | null = document.getElementById('endDate') as HTMLInputElement;
        const period: string = 'interval';  // Устанавливаем период для запроса

        const handleIntervalChange: () => void = () => {
            this.getOperationsWithInterval(period, dateFrom.value, dateTo.value);
        };

        // обработчик при клике на даты без выбора фильтра интервал
        const handleFilterIntervalClick: () => void = () => {
            // Если выбраны обе даты, использовать выбранный интервал
            if (dateFrom.value !== '' && dateTo.value !== '') { // Проверяем, заполнены ли оба поля даты
                this.updateButtonClass('FILTER_INTERVAL'); // Обновляем класс кнопки "Интервал" для отображения активного состояния
                this.getOperationsWithInterval(period, dateFrom.value, dateTo.value); // Вызываем метод для получения операций с учетом выбранного интервала
            } else {

                console.log('Пожалуйста заполните оба поля дат.');
            }
        };
        // Добавляем обработчики событий для изменения даты "От" и "До" интервала
        dateTo.addEventListener('change', handleIntervalChange);
        dateFrom.addEventListener('change', handleIntervalChange);

        // Добавляем обработчик события клика на кнопку "Интервал" при изменении значений дат
        dateTo.addEventListener('change', handleFilterIntervalClick);
        dateFrom.addEventListener('change', handleFilterIntervalClick);
        // Добавляем обработчик события клика на кнопку "Интервал" при изменении значений дат
        if (this.buttons.FILTER_INTERVAL) {
            this.buttons.FILTER_INTERVAL.addEventListener('click', handleFilterIntervalClick);
        }
    }

    public async getOperationsWithInterval(period: string, dateFrom: string, dateTo: string) {

        try {
            const result: IncomeAndCostOperationsType[] = await CustomHttp.request(config.host + `/operations?period=${period}&dateFrom=${dateFrom}&dateTo=${dateTo}`);
            if (result) {
                this.operations = result;

            } else {
                console.error('Получен пустой результат или ошибка на сервере');
            }
        } catch (error) {
            console.error('Ошибка при получении операций за интервал:', error);
        }
    }

    // private updateButtonClass(activeButton: keyof BtnType): void {
    //     if (this.buttons && this.buttons[activeButton]) {
    //         Object.values(this.buttons).forEach((button: HTMLElement | null) => {
    //             if (button) {
    //                 button.classList.remove('active');
    //             }
    //         });
    //         const targetButton: HTMLElement | null = this.buttons[activeButton];
    //         if (targetButton) {
    //             targetButton.classList.add('active');
    //         }
    //     } else {
    //         console.log(`Кнопка с идентификатором ${activeButton} не найдена или объект this.buttons равен null.`);
    //     }
    // }

    private updateButtonClass(activeButton: keyof BtnType): void {
        const targetButton: HTMLElement | null = this.buttons[activeButton];
        if (targetButton) {
            Object.values(this.buttons).forEach(button => button?.classList.remove('active'));
            targetButton.classList.add('active');
        } else {
            console.log(`Кнопка с идентификатором ${activeButton} не найдена или объект this.buttons равен null.`);
        }
    }


    // Метод для установки кнопки "Все" по умолчанию
    private setDefaultActiveButton(): void {
        const activeButton: HTMLElement | null= this.getActiveButton();
        if (!activeButton && this.buttons.FILTER_ALL) {
            this.buttons.FILTER_ALL.classList.add('active');
        }
    }

    // getActiveButton() {
    //     // Используем Object.keys для явного получения ключей из this.buttons.
    //     // Приводим тип ключей к keyof BtnType итерацией по массиву
    //     for (const buttonId of Object.keys(this.buttons) as (keyof BtnType)[]) {
    //         if (this.buttons[buttonId] && this.buttons[buttonId]!.classList.contains('active')) {
    //             return this.buttons[buttonId]; // Возвращаем активную кнопку
    //         }
    //     }
    //     return null; // Если нет активной кнопки, возвращаем null
    // }

    //метод возвращает первую найденную кнопку, удовлетворяющую условию (содержащую класс "active")
    private getActiveButton(): HTMLElement | null {
        return Object.values(this.buttons).find(button => button?.classList.contains('active')) || null;
    }
    
}