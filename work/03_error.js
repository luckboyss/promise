/* 
1. 错误的类型
  Error: 所有错误的父类型
  ReferenceErroe: 引用的变量不存在
  TypeError: 数据类型不正确的错误
  RangeError: 数据值不在其允许的范围内
  SyntaxError: 语法错误
2. 错误处理
  捕获错误: try ... catch
  抛出错误: throw error
3. 错误对象
  message属性: 错误相关信息
  stack属性: 函数调用栈记录信息

*/

/* 
1.常见的异常错误
*/
// 1). ReferenceErroe: 引用的变量不存在
// console.log(a); // ReferenceError: a is not defined

// 2). TypeError: 数据类型不正确的错误
var a = null;
//console.log(a.xxx); // TypeError: Cannot read property 'xxx' of null

// 3). RangeError: 数据值不在其允许的范围内
function fn() {
  fn();
}
// fn();  // RangeError: Maximum call stack size exceeded

// 4). SyntaxError: 语法错误
// var b = """" // SyntaxError: Unexpected string

/* 
2.错误处理
*/

// 1). 捕获错误
try {
  console.log(c);
} catch (error) {
  console.log('出错了: ', error.message);
}
console.log('+++++'); // 捕获错误后面的代码可以继续执行

// 2). 抛出错误
function handle() {
  if (Date.now()%2===0) { // 当时间值为偶数, 抛出一个错误
    throw new Error('当前时间为偶数, 不能正常处理业务')
  } else {
    console.log('当前时间为奇数，正常处理业务');
  }
}

// 调用handle()处理业务
try {
  handle();
} catch (error) {
  //console.log(error.stack);
  console.log('处理业务出错了: ',error.message);
}
