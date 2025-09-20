import { awaitable } from "./awaitable";

export enum limiter_types {
    debounce,
    throttle,
    lockout
}

type limiter_params = {
    i?: number,
    delay?: number,
    type: limiter_types
};

type limiter_lambda = () => Promise<any>
type limiter_fn_async = (limiter: ilimiter) => Promise<boolean>;
type limiter_fn_sync = (limiter: ilimiter) => boolean;

interface ilimiter {
    i: number
    delay: number
    type: limiter_fn_async | limiter_fn_sync
    execute: (resolve: limiter_lambda, reject: limiter_lambda) => Promise<any>
}

/**
 * debounce calls by the delayed time specified by the limiter
 * 
 * @param limiter - limiter context to execute the limiting function on
 * @param logic - wrapping executable function to execute on debounce success
 * @returns 
 */
export const debounce = async (limiter: ilimiter) => {
    const debounceAwaitable = awaitable<boolean>();
    limiter.i++;
    setTimeout(() => {
        limiter.i--;
        if (limiter.i === 0) {
            debounceAwaitable.resolve(true);
        }
        else{
            debounceAwaitable.resolve(false);
        }
    }, limiter.delay);
    return await debounceAwaitable.promise; 
};

/**
 * throttles calls by the delayed time specified by the limiter
 * 
 * @param limiter - limiter context to execute the limiting function on
 * @returns 
 */
export const throttle = (limiter: ilimiter) => {
    if (limiter.i === 0) {
        limiter.i++;
        setTimeout(() => {
            limiter.i--;
        }, limiter.delay);
        return true;
    }
    else{
        return false;
    }
};

/**
 * performs dynamic throttle to prevent calls undesirable spam an interface 
 * by the delayed time specified by the limiter
 * embedded nomenclature is glitch filtering
 * 
 * @param limiter - limiter context to execute the limiting function on
 * @returns 
 */
export const lockout = (limiter: ilimiter) => {
    limiter.i++;
    setTimeout(() => {
        limiter.i--;
    }, limiter.delay);
    if (limiter.i === 1) {
        return true;
    }
    else{
        return false;
    }
};

export class limiter {
    i = 0;
    delay = 1000;
    type: limiter_fn_async | limiter_fn_sync;
    constructor(params: limiter_params) {
        this.i = params.i ?? this.i;
        this.delay = params.delay ?? this.delay;

        if (params.type === limiter_types.debounce) {
            this.type = debounce;
        }
        else if (params.type === limiter_types.throttle) {
            this.type = throttle;
        }
        else if (params.type === limiter_types.lockout) {
            this.type = lockout;
        }
        else {
            this.type = debounce;
        }
    }
    async execute(resolve: limiter_lambda, reject: limiter_lambda) {
        const run = await this.type(this);
        return run ? resolve() : reject();
    }
}