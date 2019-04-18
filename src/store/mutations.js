// 包含多个直接更新state函数的对象
export default {
  createNewTask(state,newTask){
    state.tasks.push(newTask)
  },
  delItemTask(state,index){
    console.log("aaa" +index)
    state.tasks.splice(index, 1)
  },
  setFile(state,newFile){
    console.log("mutation" + newFile)
    state.allDocuments.push(newFile)
  },
  audioPlay(state,nowAudio){
    state.isAudioPlay = true
    state.nowAudio = nowAudio
  },
  setNowFile(state,{nowFile,pdfUrl}){
    state.nowFile = nowFile
    state.pdfUrl = pdfUrl
    console.log('mutation:',state.nowFile)
    console.log('mutation:',state.pdfUrl)
  }
}
