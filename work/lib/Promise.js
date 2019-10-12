/* 
Promise构造函数模块
*/
(function (window) {
  /* 
  Promise构造函数 
  */
  function Promise(excutor) {
    const self = this;
    self.status = 'pending'; // 状态标识名称的属性status, 初始值为pending, 代表结果还未确定  
    self.data = undefined; // 用来存储结果数据的属性data, 初始值为undefined, 代表现在还没数据
    self.callbacks = [] // 用来存储待执行的成功和失败的回调的数组容器, 每个元素的结构: {onResolved(){}, onRejected(){}}


    /* 
    用来指定promise成功的状态和成功的value
      1). 指定status为'resolved'
      2). 指定data为value
      3)*. 可能需要去执行已保存待执行成功的回调函数
    */
    function resolve(value) {
      if (self.status !== 'pending') {
        return;
      }
      self.status = 'resolved';
      self.data = value;
      if (self.callbacks.length > 0) {
        setTimeout(() => { // 本来需要使用微队列, 但JS操作太麻烦, 简单使用宏队列
          self.callbacks.forEach(callbackObj => {
            callbackObj.onResolved(value); // 即使数据和回调函数都有了, 也需要将回调函数放到回调队列中执行
          });
        }, 0);
      }
    }

    /* 
    用来指定promise失败的状态和成功的value
      1). 指定status为'rejected'
      2). 指定data为reason
      3). 可能需要去执行已保存待执行失败的回调函数
    */
    function reject(reason) {
      if (self.status !== 'pending') {
        return;
      }
      self.status = 'rejected';
      self.data = reason;
      if (self.callbacks.length > 0) {
        setTimeout(() => { // 本来需要使用微队列, 但JS操作太麻烦, 简单使用宏队列
          self.callbacks.forEach(callbackObj => {
            callbackObj.onRejected(reason); // 即使数据和回调函数都有了, 也需要将回调函数放到回调队列中执行
          });
        }, 0);
      }
    }

    // 立即同步执行执行器函数(启动异步任务)
    try {
      excutor(resolve, reject);
    } catch (error) { // 一旦执行器执行器抛出异常, promise变为失败状态, 且数据为error
      reject(error);
    }
  }

  /*
   用来指定成功和失败回调函数的方法
  */
  Promise.prototype.then = function (onResolved, onRejected) {
    const self = this;
    // 指定 onResolved, onRejected的默认值
    onResolved = typeof onResolved === 'function' ? onResolved : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : reason => {
      throw reason;
    }
    return new Promise((resolve, reject) => {

      /* 
      调用传入的成功或失败的回调函数, 执行后根据结果确定返回的promise的结果
      */
      function handle(callback) {
        try {
          const result = callback(self.data);
          // result是promise
          if (result instanceof Promise) { // result的结果决定决定返回的promise的结果
            /* 
            reuslt.then(
              value => { // 如果result成功了, 返回promise也成功, 值就是接收的value
                resolve(value);
              },
              reason => { // 如果result失败了, 返回promise也失败, 值就是接收的reason
                reject(reason);
              }
            ); 
            */
            result.then(resolve, reject);
          } else {
            resolve(result);
          }
        } catch (error) {
          reject(error);
        }
      }

      switch (self.status) {
        case 'pending':
          this.callbacks.push({
            onResolved: () => {
              handle(onResolved);
            },
            onRejected: () => {
              handle(onRejected);
            }
          });
          break;
        case 'resolved':
          setTimeout(() => {
            handle(onResolved);
          }, 0);
          break;
        case 'rejected':
          setTimeout(() => {
            handle(onRejected);
          }, 0);
          break;
        default:
          break;
      }

    });

  };

  /* 
  用来指定失败回调函数的方法
  */
  Promise.prototype.catch = function (onRejected) {
    return this.then(undefined, onRejected);
  };

  /* 
  用来返回一个成功/失败的promise的静态方法
  */
  Promise.resolve = function (value) {
    return new Promise((resolve, reject) => {
      if (value instanceof Promise) {
        value.then(resolve, reject);
      } else {
        resolve(value);
      }
    });
  };
  /* 
  用来返回一个延迟成功/失败的promise的静态方法
  */
  Promise.resolveDelay = function (value, time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (value instanceof Promise) {
          value.then(resolve, reject);
        } else {
          resolve(value);
        }
      }, time);
    });
  };

  /* 
  用来返回一个失败的promise的静态方法
  */
  Promise.reject = function (reason) {
    return new Promise((resolve, reject) => {
      reject(reason);
    });
  };

  /* 
  用来返回一个延迟失败的promise的静态方法
  */
  Promise.rejectDelay = function (reason, time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(reason);
      }, time);
    });
  };

  /* 
  用来返回一个promise的静态方法
    所有的promise都成功, 返回的promise才成功
    只要有一个失败了, 返回失败的promise
  */
  Promise.all = function (promises) {
    const length = promises.length;
    const values = new Array(length);
    let resolveCount = 0 // 成功的数量

    return new Promise((resolve, reject) => {
      
      promises.forEach((p, index) => {
        Promise.resolve(p).then(
          value => {
            resolveCount++;
            values[index] = value;
            if (resolveCount === length) {
              resolve(values);
            }
          },
          reason => {
            reject(reason);
          }
        );
      });

    });
  };

  /* 
  用来返回一个promise的静态方法
  第一个确定结果的promise来决定返回promise的结果
  */
  Promise.race = function (promises) {
    return new Promise((resolve, reject) => {
      promises.forEach(p => {
        Promise.resolve(p).then(
          value => {
            resolve(value);
          },
          reason => {
            reject(reason);
          }
        );
      });
    });
  };

  window.Promise = Promise;
})(window);