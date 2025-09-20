import { awaitable } from "awaitable";
import { limiter, limiter_types } from "limiter"
import { timeout } from "timeout";

type QueueDB = {
    [alias: string]: QueueDBItem;
}

type QueueDBItem = {
    queue: string;
    started: boolean;
    interval: number;
    callbacks: QueueDBItemCallback[];
    limiter: limiter;
    backoff: number;
}

type QueueDBItemCallback = () => void;

const queues: QueueDB = {};

type QueueOptions = {
    queue: string;
    interval?: number;
    limiter_type?: limiter_types;
}

export const backoff_queue = async (options: QueueOptions) => {
    if(options.queue && options.queue in queues){
        queues[options.queue].backoff++;
        return true;
    }
    else{
        return false;
    }
}

export const backon_queue = async (options: QueueOptions) => {
    if(options.queue && options.queue in queues){
        queues[options.queue].backoff=0;
        return true;
    }
    else{
        return false;
    }
}

export const create_queue = async (options: QueueOptions) => {

    if(!(options.queue in queues)){
        const delay = options.interval ?? 100;
        const limiter_type = options.limiter_type ?? limiter_types.throttle;
        queues[options.queue] = {
            interval: delay,
            queue: options.queue,
            started:false,
            limiter: new limiter({
                type: limiter_type,
                delay: delay 
            }),
            callbacks: [],
            backoff: 0 
        };
    }
    
}

export const queue = async (options: QueueOptions) => {
    options.limiter_type = options.limiter_type ?? limiter_types.throttle;
    options.queue = options.queue ?? "default";

    const queueAwaitable = awaitable<void>();
    //push callbacks into queue
    if(options.queue in queues){
        if(options.limiter_type === limiter_types.throttle){
            // change rates on the fly if necessary
            if(options.interval){
                queues[options.queue].interval = options.interval;
                queues[options.queue].limiter.delay = options.interval;
            } 
            queues[options.queue].callbacks.push(()=>queueAwaitable.resolve())
            //Start upon first use to prevent sleeping for predefined queues
            if(!queues[options.queue].started){
                start_queue(queues[options.queue]);
            }
        }
        else {
            return false;
        }
    }
    else{
        if(options.limiter_type === limiter_types.throttle){
            create_queue(options);
            queues[options.queue].callbacks.push(()=>queueAwaitable.resolve());
            // runtime defined queue, start immediately
            start_queue(queues[options.queue]); 
        }
        else {
            return false;
        }
    }

    //await queue ready signal
    return await queueAwaitable.promise;
};

export const update_queue = async (options:QueueOptions) => {
    if(!options.interval){
        console.error("Interval must be set to update queue");
        return false;
    }
    queues[options.queue].interval = options.interval as number;
    return true;
};

const start_queue = async (queueDBItem: QueueDBItem) => {
    queueDBItem.started = true;
    const sleepInterval = queueDBItem.interval*10;
    while(true){
        if(queueDBItem.callbacks.length === 0){
            await timeout(sleepInterval);
        }
        else{
            await queueDBItem.limiter.execute(
                async () => {
                    const ready = queueDBItem.callbacks.splice(0,1)[0];
                    ready();
                },
                async () => console.log(`Execution of ${queueDBItem} skipped`)
            )
            await timeout(Math.pow(2,queueDBItem.backoff) * queueDBItem.interval);
        }
    }
}