// pages/comment/comment.js
const db = wx.cloud.database();//初始化数据库
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
    content:'',//评价的内容
    score:5,//当前评价的分数
    images:[],//上传的图片
    fileIDs:[],
    movieid: -1
  },
  onContentChange(event){
    this.setData({
      content: event.detail//事件对象
    })
  },
  onScoreChange(event){
    this.setData({
      score: event.detail
    })
  },
  submit(){
    console.log(this.data.score);
    wx.showLoading({
      title: '评论中',
    })
    //上传图片到云存储
    let promiseArr = [];
    for(let i = 0; i < this.data.images.length; i ++){
      promiseArr.push(new Promise( (resolve, reject)=>{
        let item = this.data.images[i];
        let suffix = /\.\w+$/.exec(item)[0];//用正则取到不同格式的扩展名
        wx.cloud.uploadFile({//上传函数
          cloudPath: new Date().getTime() + suffix,
          filePath: item, // 文件路径
        }).then(res => {
          // get resource ID
          console.log(res.fileID)
          this.setData({
            fileIDs: this.data.fileIDs.concat(res.fileID)
          })
          resolve();//成功后调用resolve函数
        }).catch(error => {
          console.error(error);
        })
      }) )
    }
    //全部上传完成执行 插入数据
    Promise.all(promiseArr).then(res => {

      db.collection('comment').add({
        data:{
          content:this.data.content,
          score:this.data.score,
          movieid:this.data.movieid,
          fileID:this.data.fileID
        }
      }).then( res=> {
        wx.hideLoading();
        wx.showToast({
          title: '评价成功'
        })
      }).catch( err => {
        wx.hideLoading();
        wx.showToast({
          title: '评价失败'
        })
      })
    })
  },
  uploadImg(){
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success:res => {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        console.log(tempFilePaths);//图片的临时路径
        this.setData({
          images: this.data.images.concat(tempFilePaths)//让当前图片连接下路径
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      movieid: options.movieid
    })
    wx.showLoading({
      title: '加载中',
    })
    console.log(options);
    //在加载的时候调用云函数
    wx.cloud.callFunction({
      name:"getDetail",
      data:{
        movieid:options.movieid
      }
    }).then(res => {
      console.log(res);
      this.setData({
        detail:JSON.parse(res.result)
      })
      wx.hideLoading()
    }).catch(err => {
      console.error(err);
    })
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})