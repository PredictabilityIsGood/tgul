interface IAwaitable<T> {
    promise: Promise<T>;
    resolve: (value: T) => void;
    reject: (reason: any) => void;
}
declare const awaitable: <T>() => IAwaitable<T>;

declare const awaitable$1_awaitable: typeof awaitable;
declare namespace awaitable$1 {
  export { awaitable$1_awaitable as awaitable };
}

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

declare const limiter$1_debounce: typeof debounce;
type limiter$1_limiter = limiter;
declare const limiter$1_limiter: typeof limiter;
type limiter$1_limiter_types = limiter_types;
declare const limiter$1_limiter_types: typeof limiter_types;
declare const limiter$1_lockout: typeof lockout;
declare const limiter$1_throttle: typeof throttle;
declare namespace limiter$1 {
  export { limiter$1_debounce as debounce, limiter$1_limiter as limiter, limiter$1_limiter_types as limiter_types, limiter$1_lockout as lockout, limiter$1_throttle as throttle };
}

declare const timeout: (milliseconds: number) => Promise<boolean>;

declare const timeout$1_timeout: typeof timeout;
declare namespace timeout$1 {
  export { timeout$1_timeout as timeout };
}

declare const unwrapResponse: (response: any) => Promise<any>;
declare const handleRequest: (callback: Function) => Promise<any>;

declare const http_handleRequest: typeof handleRequest;
declare const http_unwrapResponse: typeof unwrapResponse;
declare namespace http {
  export { http_handleRequest as handleRequest, http_unwrapResponse as unwrapResponse };
}

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

declare const queue$1_backoff_queue: typeof backoff_queue;
declare const queue$1_backon_queue: typeof backon_queue;
declare const queue$1_create_queue: typeof create_queue;
declare const queue$1_queue: typeof queue;
declare const queue$1_update_queue: typeof update_queue;
declare namespace queue$1 {
  export { queue$1_backoff_queue as backoff_queue, queue$1_backon_queue as backon_queue, queue$1_create_queue as create_queue, queue$1_queue as queue, queue$1_update_queue as update_queue };
}

export { awaitable$1 as awaitable, http, limiter$1 as limiter, queue$1 as queue, timeout$1 as timeout };
