// 包含多个直接更新state函数的对象
export default {
  toggleUpFile(state){
    state.isUpFile = !state.isUpFile
  },
  toggleNewTask(state){
    state.isNewTask = !state.isNewTask
  },
  toggleNewFolder(state){
    state.isNewFolder = !state.isNewFolder
  },
  createNewTask(state,newTask){
    state.tasks.push(newTask)
  },
  delItemTask(state,index){
    state.tasks.splice(index, 1)
  },
  setNowFile(state,nowFile){
    state.nowFile = nowFile
  },
  audioPlay(state,nowAudio){
    state.isAudioPlay = true
    state.nowAudio = nowAudio
  },
  setIntelFileTime(state,intelFileTime){
    state.intelFileTime = intelFileTime
  },
  setNowCheckedIds(state,nowCheckedIds){
    state.nowCheckedIds = nowCheckedIds
    if (state.nowCheckedIds.length == 0){
      state.isDefineFile = false
    }
  },
  setNowCheckedCategories(state,nowCheckedCategories){
    state.nowCheckedCategories = nowCheckedCategories
  }
}
