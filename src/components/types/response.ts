export interface ExpectedDetails<T> {
    failed: false | string;
    details: T | false;
}