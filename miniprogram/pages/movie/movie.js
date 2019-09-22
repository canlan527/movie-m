// pages/movie/movie.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    movieList:[]
  },
  gotoComment(event){
    //通过自定义movieid为每个信息的唯一标识，用event事件对象event.target.dataset来获取当前自定义数据的集合
    wx.navigateTo({
      url: `../comment/comment?movieid=${event.target.dataset.movieid}`,//?拼接movieid
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getMovieList();//调用getMovieList方法
  },
  getMovieList(){
    wx.showLoading({
      title: '加载中',
    })
    // 向服务端发送请求，请求会电影的信息
    wx.cloud.callFunction({
      name: 'movieList',
      data: {
        start: this.data.movieList.length,
        count: 10
      }
    }).then(res => {
      this.setData({
        movieList: this.data.movieList.concat(JSON.parse(res.result).subjects)//将给每次结果取出，转成字符串形式，赋给新值,最后拼接上数组的值
      })
      wx.hideLoading();
    }).catch(err => {
      wx.hideLoading();
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    this.getMovieList();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})