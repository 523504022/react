import React, { Component } from 'react'
import { gray } from 'ansi-colors';
// 管理home的路由组件

export default class Home extends Component {
  render() {
    return (
      <div>
        <h2 style={{
          fontSize:50,
          textAlign:"center",
          color:"gray",
          marginTop:200
          }}>欢迎使用硅谷后台管理系统</h2>
      </div>
    )
  }
}
