interface IAwaitable<T> {
    promise: Promise<T>;
    resolve: (value: T) => void;
    reject: (reason: any) => void;
}
declare const awaitable: <T>() => IAwaitable<T>;

declare enum limiter_types {
    debounce = 0,
    throttle = 1,
    lockout = 2
}
type limiter_params = {
    i?: number;
    delay?: number;
    type: limiter_types;
};
type limiter_lambda = () => Promise<any>;
type limiter_fn_async = (limiter: ilimiter) => Promise<boolean>;
type limiter_fn_sync = (limiter: ilimiter) => boolean;
interface ilimiter {
    i: number;
    delay: number;
    type: limiter_fn_async | limiter_fn_sync;
    execute: (resolve: limiter_lambda, reject: limiter_lambda) => Promise<any>;
}
/**
 * debounce calls by the delayed time specified by the limiter
 *
 * @param limiter - limiter context to execute the limiting function on
 * @param logic - wrapping executable function to execute on debounce success
 * @returns
 */
declare const debounce: (limiter: ilimiter) => Promise<boolean>;
/**
 * throttles calls by the delayed time specified by the limiter
 *
 * @param limiter - limiter context to execute the limiting function on
 * @returns
 */
declare const throttle: (limiter: ilimiter) => boolean;
/**
 * performs dynamic throttle to prevent calls undesirable spam an interface
 * by the delayed time specified by the limiter
 * embedded nomenclature is glitch filtering
 *
 * @param limiter - limiter context to execute the limiting function on
 * @returns
 */
declare const lockout: (limiter: ilimiter) => boolean;
declare class limiter {
    i: number;
    delay: number;
    type: limiter_fn_async | limiter_fn_sync;
    constructor(params: limiter_params);
    execute(resolve: limiter_lambda, reject: limiter_lambda): Promise<any>;
}

declare const timeout: (milliseconds: number) => Promise<boolean>;

declare const unwrapResponse: (response: any) => Promise<any>;
declare const handleRequest: (callback: Function) => Promise<any>;

type QueueOptions = {
    queue: string;
    interval?: number;
    limiter_type?: limiter_types;
};
declare const backoff_queue: (options: QueueOptions) => Promise<boolean>;
declare const backon_queue: (options: QueueOptions) => Promise<boolean>;
declare const create_queue: (options: QueueOptions) => Promise<void>;
declare const queue: (options: QueueOptions) => Promise<false | void>;
declare const update_queue: (options: QueueOptions) => Promise<boolean>;

export { awaitable, backoff_queue, backon_queue, create_queue, debounce, handleRequest, limiter, limiter_types, lockout, queue, throttle, timeout, unwrapResponse, update_queue };
