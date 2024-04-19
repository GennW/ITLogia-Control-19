import Chart from 'chart.js/auto';
import { IncomeAndCostOperationsType } from "../types/server/operations-period-type";
import { FilterDate } from "./filterDate";
import { PieChartData } from "../types/chart";



export class Diagram extends FilterDate {
    public operations: IncomeAndCostOperationsType[];
    // private chartIncome: Chart | undefined; // Добавляем приватное свойство chartIncome
    // private chartCosts: Chart | undefined; // Добавляем приватное свойство chartIncome
    private chartIncome: Chart<"pie", number[], string> | undefined;
    private chartCosts: Chart<"pie", number[], string> | undefined;
    canvasIncome!: CanvasRenderingContext2D | null;
    canvasCosts!: CanvasRenderingContext2D | null;

    // Конструктор класса, принимает идентификатор  и текст заголовка
    constructor() {
        super();
        this.operations = [];
        // Получаем контекст рисования 
        // Получаем элемент canvas для доходов
        const canvasIncomeElement: HTMLElement | null = document.getElementById('myPieChartIncome');
        if (canvasIncomeElement instanceof HTMLCanvasElement) {
            // Если элемент существует и является элементом canvas
            this.canvasIncome = canvasIncomeElement.getContext('2d');
        } else {
            // Обработка случая, когда элемент не найден или не является элементом canvas
            console.error('Элемент "myPieChartIncome" не найден или не является элементом canvas');
        }

        // Получаем элемент canvas для расходов
        const canvasCostsElement: HTMLElement | null = document.getElementById('myPieChartCosts');
        if (canvasCostsElement instanceof HTMLCanvasElement) {
            // Если элемент существует и является элементом canvas
            this.canvasCosts = canvasCostsElement.getContext('2d');
        } else {
            // Обработка случая, когда элемент не найден или не является элементом canvas
            console.error('Элемент "myPieChartCosts" не найден или не является элементом canvas');
        }

    }



    public async getOperationsWithInterval(period: string, dateFrom: string, dateTo: string): Promise<void> {
        await super.getOperationsWithInterval(period, dateFrom, dateTo);
        this.removeExistingCharts(); // Удалить существующие диаграммы
        if (this.chartIncome) {
            this.chartIncome.destroy();
            // await this.updateChartsByPeriod();
            await this.createChartWithCanvasIncome();
        }
        if (this.chartCosts) {
            this.chartCosts.destroy();
            // await this.updateChartsByPeriod();
            await this.createChartWithCanvasCosts();
        }


    }

    public async getOperations(period: string): Promise<void> {
        await super.getOperations(period);
        this.createChartWithCanvasCosts();
        this.createChartWithCanvasIncome();
    }


    public static createDataCanvasIncome(operations: IncomeAndCostOperationsType[]): PieChartData {

        // Фильтруем операции по типу "income"
        const incomeOperations: IncomeAndCostOperationsType[] = operations.filter(operation => operation.type === "income" && operation.category);
        // console.log('operations.category',operations.category)
        const noIncomeElement: HTMLElement | null = document.getElementById('no-income');

        // Если нет операций типа "income", вернуть пустой объект
        if (incomeOperations.length === 0) {
            if (noIncomeElement) {
                noIncomeElement.innerText = 'Нет операций по доходам';
                console.log('Нет операций по доходам');
                return {
                    labels: [],
                    datasets: []
                };
            }

        } else {
            if (noIncomeElement) {
                noIncomeElement.innerText = '';
            }
        }


        // Извлекаем данные для меток и значения из операций
        // проверка на категорию в случае если она удалена то не будет выведена
        const categoryOperations: IncomeAndCostOperationsType[] = incomeOperations.map(operation => ({
            ...operation,
            category: operation.category
        }));

        // console.log('categoryOperations', categoryOperations)

        // Получаем уникальные категории
        //включаем в tsconfig  "downlevelIteration": true,
        const categories: string[] = [...new Set(incomeOperations.map((operation: IncomeAndCostOperationsType) => operation.category))].filter(Boolean); // Исключаем undefined если удалена категория со всеми операциями;
        // console.log('unik-categories-incomeOperations', categories)

        // Вычисляем суммы для каждой уникальной категории
        const sumsByCategory: number[] = categories.map((category: string) => incomeOperations.reduce((sum: number, operation: IncomeAndCostOperationsType) => {
            return operation.category === category ? sum + operation.amount : sum;
        }, 0));

        return {
            labels: categories, // Метки секторов диаграммы
            datasets: [{
                data: sumsByCategory,  // Суммы для каждой категории
                backgroundColor: ['#FFC107', '#20C997', '#FD7E14', '#DC3545', '#0D6EFD'], // Цвета секторов
                hoverBackgroundColor: ['#FFC107', '#20C997', '#FD7E14', '#DC3545', '#0D6EFD'] // Цвета при наведении

            }]
        };
    }

    // Статический метод для создания данных для второй диаграммы
    private static createDataCanvasCosts(operations: IncomeAndCostOperationsType[]): PieChartData {

        // Фильтруем операции по типу "expense"
        const costsOperationsWithCategory: IncomeAndCostOperationsType[] = operations.filter(operation => operation.type === "expense" && operation.category);

        const noCostsElement: HTMLElement | null = document.getElementById('no-costs');

        // Если нет операций типа "expense", вернуть пустой объект
        if (costsOperationsWithCategory.length === 0) {
            if (noCostsElement) {
                noCostsElement.innerText = 'Нет операций по расходам'
                console.log('Нет операций по расходам');
                return {
                    labels: [],
                    datasets: []
                };
            }

        } else {
            if (noCostsElement) {
                noCostsElement.innerText = ''
            }
        }

        // Получаем уникальные категории
        const categories: string[] = [...new Set(costsOperationsWithCategory.map((operation: IncomeAndCostOperationsType) => operation.category))].filter(Boolean); // Исключаем undefined;
        // console.log(categories)
        // Вычисляем суммы для каждой уникальной категории
        const sumsByCategory: number[] = categories.map((category: string) => costsOperationsWithCategory.reduce((sum: number, operation: IncomeAndCostOperationsType) => {
            return operation.category === category ? sum + operation.amount : sum;
        }, 0));

        return {
            labels: categories, // Метки секторов диаграммы
            datasets: [{
                data: sumsByCategory, // Данные для каждого сектора
                backgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'], // Цвета секторов
                hoverBackgroundColor: ['#DC3545', '#FD7E14', '#FFC107', '#20C997', '#0D6EFD'] // Цвета при наведении
            }]
        };
    }

    // Метод для создания диаграммы с переданными данными
    private createChartIncome(data: PieChartData): Chart | undefined {
        if (this.canvasIncome) {
            if (this.chartIncome) {
                this.chartIncome.destroy();
            }
            this.chartIncome = new Chart(this.canvasIncome, {
                type: 'pie',
                data: data,
                options: {
                    aspectRatio: 1,
                    layout: {
                        padding: { top: 0 }
                    },
                    plugins: {
                        title: {
                            display: true,
                            padding: 10,
                            text: 'Доходы',
                            font: { family: 'Roboto', size: 28 }
                        },
                        legend: {
                            position: 'top',
                            align: 'center',
                            labels: {
                                padding: 15,
                                boxWidth: 35,
                                boxHeight: 10,
                                font: { family: 'Roboto', size: 12 }
                            },
                            // cutout: 0,
                        }
                    }
                }
            });
            return this.chartIncome as Chart;
        } else {
            console.error('CanvasIncome is not valid');
            return undefined;
        }
    }



    private createChartCosts(data: PieChartData): Chart | undefined {
        if (this.canvasCosts) {
            if (this.chartCosts) {
                this.chartCosts.destroy();
            }
            this.chartCosts = new Chart(this.canvasCosts, {
                type: 'pie', // Тип диаграммы - круговая
                data: data, // Используемые данные
                options: {
                    aspectRatio: 1, // Соотношение сторон
                    layout: {
                        padding: { top: 0 } // Отступ сверху
                    },
                    plugins: {
                        title: {
                            display: true, // Показывать заголовок
                            padding: 10, // Отступ заголовка
                            text: 'Расходы', // текст заголовка
                            font: { family: 'Roboto', size: 28 } // Шрифт заголовка
                        },
                        legend: {
                            position: 'top', // Положение легенды
                            align: 'center', // Выравнивание легенды
                            labels: {
                                padding: 15, // Отступ меток
                                boxWidth: 35, // Ширина маркера
                                boxHeight: 10, // Высота маркера
                                font: { family: 'Roboto', size: 12 } // Шрифт меток
                            },
                            // cutout: 0, // Размер отсечения по центру
                        }
                    }
                }
            });
            return this.chartCosts as Chart;
        } else {
            console.error('CanvasCosts is not valid');
            return undefined;
        }
    }


    // Метод для создания диаграммы с данными из createDataCanvasIncome
    private async createChartWithCanvasIncome(): Promise<Chart | undefined> {

        if (this.chartIncome) {
            this.chartIncome.destroy();  // Уничтожение существующей диаграммы расходов, если она существует
        }

        const dataCanvasIncome: PieChartData = Diagram.createDataCanvasIncome(this.operations); // Создание данных для первой диаграммы
        return this.createChartIncome(dataCanvasIncome); // Создание и отображение диаграммы

    }


    // Метод для создания диаграммы с данными из createDataCanvasCosts
    private async createChartWithCanvasCosts(): Promise<Chart | undefined> {

        if (this.chartCosts) {
            this.chartCosts.destroy();  // Уничтожение существующей диаграммы расходов, если она существует
        }
        const dataCanvasCosts: PieChartData = Diagram.createDataCanvasCosts(this.operations); // Создание данных для второй диаграммы
        return this.createChartCosts(dataCanvasCosts); // Создание и отображение диаграммы
    }


    private removeExistingCharts(): void {
        if (this.chartIncome) {
            this.chartIncome.destroy(); // Удалит диаграмму доходов, если она существует
        }
        if (this.chartCosts) {
            this.chartCosts.destroy(); // Удалит диаграмму расходов, если она существует
        }
    }
}
