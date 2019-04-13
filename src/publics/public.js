//定义公共方法
export const toggleTip = (obj, msg) =>{
  obj.$notify({
    title: '',
    message: msg,
    position: 'top-right',
    duration: 3000,
    offset: 80
  })
}
export const  toggleCollection =(obj, list, index)=>{
  list[index].collection = !list[index].collection
  if(list[index].collection) {
    toggleTip(obj, '已收藏')
  }else{
    toggleTip(obj, '已取消收藏')
  }
}
export const toggleLike =(obj, list, index)=>{
  list[index].like = !list[index].like
  if(list[index].like) {
    toggleTip(obj, '已关注')
  }else{
    toggleTip(obj, '已取消关注')
  }
}
export const upFileSucceed =(obj)=>{
    toggleTip(obj, '上传成功')
}
export const clickItem =(list, index, nowChecked)=>{
  list[index].itemChecked = !list[index].itemChecked
  if(list[index].itemChecked) {
    nowChecked.push(list[index])
  }else{
    nowChecked.splice(index, 1)
  }
}
export const inputIsEmpty =(obj,msg)=> {
  obj.$alert(msg, '', {
    confirmButtonText: '确定',
    // callback: action => {
    //   obj.$message({
    //     type: 'info',
    //     message: `action: ${action}`
    //   });
    // }
  })
}
export const unixChange = (timestamp)=>{
  if(!timestamp) {
    return "未知"
  }
  var date = new Date(timestamp );//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth()+1 < 10 ? '0' + (date.getMonth()+1) : date.getMonth()+1) + '-';
  var D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes();
  return Y+M+D+h+m;
}
export const getFileSize = (size)=> {
  if (!size){
    return ""
  }
  var num = 1024.00; //byte
  if (size < num){
    return size + "B"
  }else if (size < Math.pow(num, 2)){
    return (size / num).toFixed(2) + "K"; //kb
  }else if (size < Math.pow(num, 3)){
    return (size / Math.pow(num, 2)).toFixed(2) + "M"; //M
  }else if (size < Math.pow(num, 4)){
    return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
  }else {
    return (size / Math.pow(num, 4)).toFixed(2) + "T"; //T
  }
}
export const getNowDay = ()=>{
  var date = new Date()
  var year = date.getFullYear()
  var month = date.getMonth() + 1 //可选值是0-11
  var date = date.getDate()
  if(month >=1 && month <=9) {
    month = "0" + month
  }
  if(date >=0 && date <=9) {
    date = "0" + date
  }
  var curDate = year + "-" + month + "-" + date
  return curDate
}

export const formatTime = (second = 0) =>{
  const h = parseInt(second / 60 / 60).toString().padStart(2,'0')
  const m = parseInt(second / 60 % 60).toString().padStart(2,'0')
  const s = parseInt(second % 60).toString().padStart(2,'0')
  return {
    h, m, s
  }
}
