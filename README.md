# tgul
Typescript Generalized Utility Library

## utilities

### awaitable
converts callback based promise into a resolveable entity to retain 2 dimensional code flow

```ts
const awaitableObj = awaitable<boolean>();

try{

    setTimeout(()=>awaitableObj.reject(new Error("Timed Out")),5000); // reject if not resolved within 5 seconds

    something.withAsynchronousCallback((isSuccess)=>{
        successBoolean ? awaitableObj.resolve(isSuccess) : awaitableObj.reject(new Error("unexpected data return"));
    })
}
catch(err){
    awaitableObj.reject(new Error("Not successful"));
}

const result = await awaitableObj.promise; // await any of the asynchronous/synchronous callback paths
console.log(result); // log result, resolution is of the awaitable type, rejection is of error in this example
```

### queue
simple inline asynchronous queueing system with simple idle sleep resource reduction

```ts
const exampleQueueDefaultInterval = 1000;
create_queue({ 
    queue:"example queue", 
    interval: exampleQueueDefaultInterval, 
    limiter: limiter_throttle 
}) // create queue with queue execution interval of 1000

const backoffQueueDefaultInterval = 1000;
create_queue({ 
    queue:"backoff queue",
    interval: backoffQueueDefaultInterval,
    limiter: limiter_throttle
}) // create queue with queue execution interval of 1000

const someFn = async (data: any[]) => {
    const newData = await Promises.all(
        data.map(async (row) => {
            console.log("do stuff. any stuff. async or not doesn't matter")

            await queue({ queue:"example queue" }); // await until asynchronous ready signal from queue with name "example queue"
            row.new_property = "someValue";
            return row;
        })
    );

    return newData;
}

const someFnWithExponentialBackoff = async (data: any[]) => {
    while(true){
        try{
            await queue({ queue:"backoff queue" }); // await until asynchronous ready signal from queue with name "backoff queue"
            const result = await fetchWithReturn();
            if(result) {
                backon_queue({ queue:"backoff queue" }); // tell queue to reset backoff to behave on normal interval;
                break;
            }
        }
        catch(err){
            console.error(err);
        }
        finally {
            backoff_queue({ queue:"backoff queue" }); // tell queue to backoff
        }
    }

}
```

### timeout
asynchronous timeout function which blocks 2 dimensional flow until millisecond timeout return;
```ts
console.log("start",new Date().toISOString());
await timeout(1000) // 1 second timeout
console.log("end",new Date().toISOString());
```

### limiter
limiting execution class capable of throttle, debounce & lockout
```ts
// To Be Documented
```

## scripts

### run
```
npm run dev
```

### build

```
npm run build
```

### test
```
npm run test
```