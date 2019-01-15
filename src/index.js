import React from 'react'
import ReactDOM from 'react-dom'

import MemoryUtils from './utils/MemoryUtils'
import storageUtils from './utils/storageUtils'
import App from './App'
// 读取local中的user，若存在则保存到内存中
const user = storageUtils.getUser()
 if(user && user._id){
  MemoryUtils.user = user
 }

ReactDOM.render(<App/>,document.getElementById('root'))