export type RouteType = {
    route: string;
    title: string;
    template: string;
    styles: string;
    additionalStyle: string;
    isAuth: boolean;
    load: () => void;
}

export type RouteParamsType = {
    id?: number;
    title?: string;
    error?: boolean;
    message?: string;
    user_id?: number;
    idIncome?: string;
    idCost?: string;
};