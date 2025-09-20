"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  awaitable: () => awaitable_exports,
  http: () => http_exports,
  limiter: () => limiter_exports,
  queue: () => queue_exports,
  timeout: () => timeout_exports
});
module.exports = __toCommonJS(index_exports);

// src/awaitable.ts
var awaitable_exports = {};
__export(awaitable_exports, {
  awaitable: () => awaitable
});
var awaitable = () => {
  let oResolve, oReject;
  const promise = new Promise((resolve, reject) => {
    oResolve = resolve;
    oReject = reject;
  });
  return {
    promise,
    resolve: oResolve,
    reject: oReject
  };
};

// src/limiter.ts
var limiter_exports = {};
__export(limiter_exports, {
  debounce: () => debounce,
  limiter: () => limiter,
  limiter_types: () => limiter_types,
  lockout: () => lockout,
  throttle: () => throttle
});
var limiter_types = /* @__PURE__ */ ((limiter_types2) => {
  limiter_types2[limiter_types2["debounce"] = 0] = "debounce";
  limiter_types2[limiter_types2["throttle"] = 1] = "throttle";
  limiter_types2[limiter_types2["lockout"] = 2] = "lockout";
  return limiter_types2;
})(limiter_types || {});
var debounce = async (limiter2) => {
  const debounceAwaitable = awaitable();
  limiter2.i++;
  setTimeout(() => {
    limiter2.i--;
    if (limiter2.i === 0) {
      debounceAwaitable.resolve(true);
    } else {
      debounceAwaitable.resolve(false);
    }
  }, limiter2.delay);
  return await debounceAwaitable.promise;
};
var throttle = (limiter2) => {
  if (limiter2.i === 0) {
    limiter2.i++;
    setTimeout(() => {
      limiter2.i--;
    }, limiter2.delay);
    return true;
  } else {
    return false;
  }
};
var lockout = (limiter2) => {
  limiter2.i++;
  setTimeout(() => {
    limiter2.i--;
  }, limiter2.delay);
  if (limiter2.i === 1) {
    return true;
  } else {
    return false;
  }
};
var limiter = class {
  constructor(params) {
    this.i = 0;
    this.delay = 1e3;
    this.i = params.i ?? this.i;
    this.delay = params.delay ?? this.delay;
    if (params.type === 0 /* debounce */) {
      this.type = debounce;
    } else if (params.type === 1 /* throttle */) {
      this.type = throttle;
    } else if (params.type === 2 /* lockout */) {
      this.type = lockout;
    } else {
      this.type = debounce;
    }
  }
  async execute(resolve, reject) {
    const run = await this.type(this);
    return run ? resolve() : reject();
  }
};

// src/timeout.ts
var timeout_exports = {};
__export(timeout_exports, {
  timeout: () => timeout
});
var timeout = async (milliseconds) => {
  const anAwaitable = awaitable();
  setTimeout(() => anAwaitable.resolve(true), milliseconds);
  return await anAwaitable.promise;
};

// src/http.ts
var http_exports = {};
__export(http_exports, {
  handleRequest: () => handleRequest,
  unwrapResponse: () => unwrapResponse
});
var unwrapResponse = async (response) => {
  return response.ok ? await response.json() : { status: false, data: "request failed" };
};
var handleRequest = async (callback) => {
  try {
    const response = await callback();
    const result = await unwrapResponse(response);
    return result.status ? result.data : result.status;
  } catch (err) {
    console.error("Error:", err);
    return false;
  }
};

// src/queue.ts
var queue_exports = {};
__export(queue_exports, {
  backoff_queue: () => backoff_queue,
  backon_queue: () => backon_queue,
  create_queue: () => create_queue,
  queue: () => queue,
  update_queue: () => update_queue
});
var queues = {};
var backoff_queue = async (options) => {
  if (options.queue && options.queue in queues) {
    queues[options.queue].backoff++;
    return true;
  } else {
    return false;
  }
};
var backon_queue = async (options) => {
  if (options.queue && options.queue in queues) {
    queues[options.queue].backoff = 0;
    return true;
  } else {
    return false;
  }
};
var create_queue = async (options) => {
  if (!(options.queue in queues)) {
    const delay = options.interval ?? 100;
    const limiter_type = options.limiter_type ?? 1 /* throttle */;
    queues[options.queue] = {
      interval: delay,
      queue: options.queue,
      started: false,
      limiter: new limiter({
        type: limiter_type,
        delay
      }),
      callbacks: [],
      backoff: 0
    };
  }
};
var queue = async (options) => {
  options.limiter_type = options.limiter_type ?? 1 /* throttle */;
  options.queue = options.queue ?? "default";
  const queueAwaitable = awaitable();
  if (options.queue in queues) {
    if (options.limiter_type === 1 /* throttle */) {
      if (options.interval) {
        queues[options.queue].interval = options.interval;
        queues[options.queue].limiter.delay = options.interval;
      }
      queues[options.queue].callbacks.push(() => queueAwaitable.resolve());
      if (!queues[options.queue].started) {
        start_queue(queues[options.queue]);
      }
    } else {
      return false;
    }
  } else {
    if (options.limiter_type === 1 /* throttle */) {
      create_queue(options);
      queues[options.queue].callbacks.push(() => queueAwaitable.resolve());
      start_queue(queues[options.queue]);
    } else {
      return false;
    }
  }
  return await queueAwaitable.promise;
};
var update_queue = async (options) => {
  if (!options.interval) {
    console.error("Interval must be set to update queue");
    return false;
  }
  queues[options.queue].interval = options.interval;
  return true;
};
var start_queue = async (queueDBItem) => {
  queueDBItem.started = true;
  const sleepInterval = queueDBItem.interval * 10;
  while (true) {
    if (queueDBItem.callbacks.length === 0) {
      await timeout(sleepInterval);
    } else {
      await queueDBItem.limiter.execute(
        async () => {
          const ready = queueDBItem.callbacks.splice(0, 1)[0];
          ready();
        },
        async () => console.log(`Execution of ${queueDBItem} skipped`)
      );
      await timeout(Math.pow(2, queueDBItem.backoff) * queueDBItem.interval);
    }
  }
};
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  awaitable,
  http,
  limiter,
  queue,
  timeout
});
