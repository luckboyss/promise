// 1. 创建Promsie对象
const p = new Promise((resolve, reject) => { // 执行函数
  // 执行异步操作
  setTimeout(() => {
    console.log('执行异步任务完成');
    // 异步操作成功了
    if (Date.now() % 2 === 1) {
      resolve('成功的数据'); // 让promise对象的状态变为resolved, 指定成功的value
      // 异步操作失败了
    } else {
      reject('失败的原因的数据'); // 让promise对象的状态变为rejected, 指定失败的reason
    }
  }, 1000);
});

// 指定promise的成功/失败的回调

p.then(
  value => {
    console.log('接收成功的数据: ', value);
  },
  reason => {
    console.log('接收失败的数据: ', reason);
  }
);