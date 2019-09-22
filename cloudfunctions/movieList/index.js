// 云函数入口文件
const cloud = require('wx-server-sdk')

//nihaofannihaofannibuyaozaishuohuale!jianren!
cloud.init()
var rp = require('request-promise');//引入require-promise
// 云函数入口函数
exports.main = async (event, context) => {
  //start 是一开始的值，count是要传入的值 
  return rp(`http://api.douban.com/v2/movie/in_theaters?apikey=0df993c66c0c636e29ecbb5344252a4a&start=${event.start}&count=${event.count}`)
    .then(function (res) {
      // Process html...
      // console.log(res)//要在云开发的函数日志里查看，控制台无法输出
      return res;
    })
    .catch(function (err) {
      // Crawling failed...
      console.error(err);
    });
}