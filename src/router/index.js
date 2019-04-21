import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
import Login from "../independent_pages/Login";
import Main from "../independent_pages/Main";
import PicturesInfo from "../independent_pages/PicturesInfo";
import VideoInfo from "../independent_pages/VideoInfo";
import ModifyDocuments from "../independent_pages/ModifyDocuments"

import AllFiles from "../views/my_files/all_files/AllFiles";
import Audios from "../views/my_files/audios/Audios";
import Documents from "../views/my_files/documents/Documents";
import Insight from "../views/my_files/insight/Insight";
import Others from "../views/my_files/others/Others";
import Pictures from "../views/my_files/pictures/Pictures";
import Videos from "../views/my_files/videos/Videos";
import ShowFile from  "../views/show_file/ShowFile";
import TimeLinePics from "../views/my_files/pictures/TimeLinePics";
import IntelligentPics from "../views/my_files/pictures/IntelligentPics";

import Empty from "../views/empty/Empty";
import Feedback from "../views/feedback/Feedback";
import Mail from "../views/mail/Mail";
import MyCollections from "../views/my_collections/MyCollections";
import MyLikes from "../views/my_likes/MyLikes";
import Setup from "../views/setup/Setup";
import TaskList from "../views/task_list/TaskList";
import UseTimes from "../views/use_times/UseTimes";
import InsightInfo from "../views/my_files/insight/InsightInfo";
import FolderResult from "../views/my_files/insight/FolderResult"

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/main'
    },{
      path: '/login',
      component:Login
    },{
      path: '/main',
      component:Main,
      children:[
        {
          path: '/main',
          redirect: '/main/allFiles'
        },{
          path: '/main/allFiles',
          component:AllFiles
        }, {
          path: '/main/audios',
          component:Audios
        }, {
          path: '/main/feedback',
          component:Feedback
        }, {
          path: '/main/documents',
          component:Documents
        }, {
          path: '/main/insight',
          component:Insight
        }, {
          path: '/main/insightInfo',
          name: 'InsightInfo',
          component: InsightInfo
        },{
          path: '/main/others',
          component:Others
        }, {
          path: '/main/pictures',
          component:Pictures
        }, {
          path: '/main/videos',
          component:Videos
        },  {
          path: '/main/empty',
          component:Empty
        }, {
          path: '/main/mail',
          component:Mail
        }, {
          path: '/main/myCollections',
          component:MyCollections
        }, {
          path: '/main/myLikes',
          component:MyLikes
        }, {
          path: '/main/setup',
          component:Setup
        }, {
          path: '/main/taskList',
          component:TaskList
        }, {
          path: '/main/useTimes',
          component:UseTimes
        },{
          path: '/main/showFile',
          name:'ShowFile',
          component:ShowFile
        },{
          path: '/main/folderResult',
          name:'FolderResult',
          component:FolderResult
        },{
          path: '/main/timeLinePics',
          component:TimeLinePics
        },{
          path: '/main/intelligentPics',
          component:IntelligentPics
        },
      ]
    },{
      path: '/picturesInfo',
      name:'PicturesInfo',
      component:PicturesInfo
    },{
      path: '/videoInfo',
      name: 'VideoInfo',
      component: VideoInfo
    },{
      path: '/modifyDocuments',
      name: 'ModifyDocuments',
      component: ModifyDocuments
    }
  ]
})
