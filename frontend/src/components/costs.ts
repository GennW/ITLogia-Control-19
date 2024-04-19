import config from "../config/config";
import { BaseCategory } from "./baseCategory";


export class Costs extends BaseCategory {
    constructor() {
        super();
    }

    protected getEndpoint(): string {
        return config.host + '/categories/expense';
    }

    protected getEditRoute(): string {
        return '/costsEdit';
    }

    protected getListRoute(): string {
        return '/costs';
    }

    protected getDeleteEndpoint(id: string): string {
        return config.host + '/categories/expense/' + id;
    }

    protected addNewCategoryCard(): void {
        const container: HTMLElement | null = document.querySelector('.main-items');
        if (container) {
            const newCategoryCard: HTMLElement = this.createCard.createElement('div', ['card', 'col-12', 'col-md-6', 'col-lg-4', 'm-2'], '', {});
            const newCategoryCardBody: HTMLElement = this.createCard.createElement('div', ['card-body', 'card-body-last', 'd-flex', 'align-items-center', 'justify-content-center'], '', {});
            const link: HTMLElement = this.createCard.createElement('a', ['link-secondary', 'link-offset-2', 'link-underline', 'link-underline-opacity-0'], '+', { href: '#/costsCreate' });

            newCategoryCardBody.addEventListener('click', () => {
                location.hash = '#/costsCreate';
            });

            newCategoryCardBody.appendChild(link);
            newCategoryCard.appendChild(newCategoryCardBody);
            container.appendChild(newCategoryCard);
        }
    }
}