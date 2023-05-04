import type { NextApiResponse } from "next";

export interface ExpectedDetails<T> {
    failed: false | string;
    details: T | undefined;
}

export interface errorResponse {
    error?: {
        code: number;
        message: string;
        errors: Array<string>;
    };
}

export type unpredictableResponse = NextApiResponse<
    ExpectedDetails<any> | undefined
>;
