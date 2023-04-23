export interface ExpectedDetails<T> {
    failed: boolean;
    details: string | undefined | T
}