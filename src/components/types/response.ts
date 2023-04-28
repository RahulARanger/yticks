export interface ExpectedDetails<T> {
    failed: false | string;
    details: T | false;
}

export interface errorResponse {
    error?: {
        code: number;
        message: string;
        errors: Array<string>;
    };
}
