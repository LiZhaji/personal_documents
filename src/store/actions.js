// 包含多个对应事件回调函数的对象
export default {
  createNewTask({commit},newTask){
    commit('createNewTask', newTask)
  },
  delItemTask({commit},index){
    commit('delItemTask', index)
  },
  setFile({commit},newFile){
    console.log("action" + newFile)
    commit('setFile',newFile)
  }
}
