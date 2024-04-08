export type LogoutResponseType = {
    error: boolean;
    message: string;
    validation?: Array<{
        key: string;
        message: string;
    }>;
};
