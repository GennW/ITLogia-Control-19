export type AuthType = {
    error: boolean;
    message?: string;
    validation?: { key: string; message: string }[];
    user?: { id: number; email?: string; name: string; lastName: string; password?: string; refreshToken?: string };
    tokens?: { accessToken: string, refreshToken:string }
};