export type RouteType = {
    route: string;
    title: string;
    template: string;
    styles: string;
    additionalStyle: string;
    isAuth: boolean;
    load: () => void;
}