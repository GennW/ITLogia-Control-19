import { QueryParamsType } from "../types/query-params-type";

export class PutTitleInInput {

     // статический метод для подстановки значения из routeParams.title в input
     public static populateInputWithRouteParamsTitle(routeParams: QueryParamsType): void {
        const editCategoryInputElement: HTMLInputElement | null = document.getElementById('edit-category-input') as HTMLInputElement | null;
        if (editCategoryInputElement) {
            editCategoryInputElement.value = routeParams.title; // Подстановка значения из routeParams.title в input
        }
    }
}