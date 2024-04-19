export type Field = {
    email?: string;
    password?: string;
    name?: string;
    confirm?: string;
    id: string;
    element: HTMLElement | null;
    regex: RegExp;
    valid: boolean;
};