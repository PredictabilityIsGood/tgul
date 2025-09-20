import { awaitable } from "./awaitable";

export const timeout = async (milliseconds:number) => {
    const anAwaitable = awaitable<boolean>();
    setTimeout(()=>anAwaitable.resolve(true),milliseconds);
    return await anAwaitable.promise;
};