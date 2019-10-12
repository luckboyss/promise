/* 
回调函数的分类
  1). 同步回调:
    理解: 立即执行, 完全执行完了才结束, 不会放入对调队列中
    例子: 数组遍历相关的回调函数/Promise的excutor函数
  2). 异步回调:
    理解: 不会立即执行, 会放入对调队列中将来执行
    例子: 定时器回调/ajax回调/事件监听回调/Promise的成功|失败的回调
*/
const arr = [1, 2, 3];
arr.forEach((item, index) => {
  console.log('遍历的回调', item, index);
});
console.log('forEach之后');

setTimeout(() => {
  console.log('回调函数');
}, 0);
console.log('setTimeout之后');