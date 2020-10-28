import Home from '../views/Home'
import Revit from '../views/Revit'
import LastOpen from '../views/LastOpen'
import CAD from '../views/CAD'
import PDF from '../views/PDF'
import Navisworks from '../views/Navisworks'
import Model from '../views/Layout/components/Model'

let initModelRoute = [
  {
    name: '最近打开',
    path: '/last-open',
    component: LastOpen,
    meta: {
      isActive: false,
      icon: "clock-circle"
    }
  },{
    name: '全部文件',
    path: '/home',
    component: Home,
    meta: {
      isActive: false,
      icon: "file-text"
    }
  },{
    name: 'Revit',
    path: '/revit',
    component: Revit,
    meta: {
      isActive: false
    }
  },{
    name: 'Navisworks',
    path: '/navisworks',
    component: Navisworks,
    meta: {
      isActive: false
    }
  },{
    name: 'CAD',
    path: '/cad',
    component: CAD,
    meta: {
      isActive: false
    }
  },{
    name: 'PDF',
    path: '/pdf',
    component: PDF,
    meta: {
      isActive: false
    }
  }
]

export const modelRoute = initModelRoute
