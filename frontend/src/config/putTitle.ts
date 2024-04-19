import { RouteParamsType } from "../types/roure.type";

export class PutTitleInInput {

     // статический метод для подстановки значения из routeParams.title в input
     public static populateInputWithRouteParamsTitle(routeParams: RouteParamsType): void {
        const editCategoryInputElement: HTMLInputElement | null = document.getElementById('edit-category-input') as HTMLInputElement | null;
        const title: string | undefined = routeParams.title;
    
        if (editCategoryInputElement && title !== undefined) {
            editCategoryInputElement.value = title;
        }
    }
}