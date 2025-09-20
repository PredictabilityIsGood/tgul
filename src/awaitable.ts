interface IAwaitable<T> {
    promise: Promise<T>,
    resolve: (value: T) => void,
    reject: (reason: any) => void
}
export const awaitable = <T>() => {
    let oResolve, oReject;
    const promise = new Promise<T>((resolve, reject) => {
        oResolve = resolve;
        oReject = reject;
    });
    return {
        promise,
        resolve: oResolve,
        reject: oReject
    } as unknown as IAwaitable<T>;
};