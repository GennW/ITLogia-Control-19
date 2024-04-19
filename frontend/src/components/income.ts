import { DomCreateCard } from "../config/DOMCreate";
import config from "../config/config";
import { BaseCategory } from "./baseCategory";

export class Income extends BaseCategory {
   constructor() {
       super();
       this.createCard = new DomCreateCard();
   }

   protected getEndpoint(): string {
       return config.host + '/categories/income';
   }

   protected getEditRoute(): string {
       return '/incomeEdit';
   }

   protected getListRoute(): string {
       return '/income';
   }

   protected getDeleteEndpoint(id: string): string {
       return config.host + '/categories/income/' + id;
   }

   protected addNewCategoryCard(): void {
       const container: HTMLElement | null = document.querySelector('.main-items');
       if (container) {
           const newCategoryCard: HTMLElement = this.createCard.createElement('div', ['card', 'col-12', 'col-md-6', 'col-lg-4', 'm-2'], '', {});
           const newCategoryCardBody: HTMLElement = this.createCard.createElement('div', ['card-body', 'card-body-last', 'd-flex', 'align-items-center', 'justify-content-center'], '', {});
           const link: HTMLElement = this.createCard.createElement('a', ['link-secondary', 'link-offset-2', 'link-underline', 'link-underline-opacity-0'], '+', { href: '#/incomeCreate' });

           newCategoryCardBody.addEventListener('click', () => {
               location.hash = '#/incomeCreate';
           });

           newCategoryCardBody.appendChild(link);
           newCategoryCard.appendChild(newCategoryCardBody);
           container.appendChild(newCategoryCard);
       }
   }
}
