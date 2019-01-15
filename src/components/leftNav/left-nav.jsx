import React, {Component} from 'react'
import {Menu, Icon} from 'antd'
import {NavLink, withRouter} from 'react-router-dom'

import menuList from '../../config/menuConfig'
import logo from '../../assets/images/logo.png'

import './left-nav.less'
/*
左侧导航组件
 */

const SubMenu = Menu.SubMenu

export default class LeftNav extends Component {
  render() {
    return (
      <div className='left-nav'>
        LeftNav
      </div>
    )
  }
}
