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
const Item = Menu.Item

class LeftNav extends Component {

  // 使用递归，动态生成menu菜单
  getNodes = (list) => {
    return list.reduce((pre,item) => {
      if(item.children){
        const subMenu = (
          <SubMenu key={item.key} title={<span><Icon type={item.icon}/><span>{item.title}</span></span>}>
            {
              this.getNodes(item.children)
            }
          </SubMenu>
        )
        pre.push(subMenu)
        // 计算得到当前请求路径对应的父菜单的key
        const path = this.props.location.pathname
        const cItem = item.children.find((child => path.indexOf(child.key)===0))
        if(cItem) {
          this.openKey = item.key
          this.selectKey = cItem.key
        }
      } else {
        const menuItem = (
          <Item key={item.key}>
            <NavLink to={item.key}>
              <Icon type={item.icon}/> {item.title}
            </NavLink>
          </Item>
        )
        pre.push(menuItem)
      }
      return pre
    },[])
  }

  componentWillMount(){
    this.menuNodes = this.getNodes(menuList)
  }

  render() {
    // 得到当前显示路由的path
    const path = this.selectKey || this.props.location.pathname

    return (
      <div className='left-nav'>
        <NavLink to='/home' className='logo'>
          <img src={logo} alt="logo"/>
          <h1>硅谷后台</h1>
        </NavLink>

        <Menu mode="inline" theme='dark' defaultSelectedKeys={[path]}>
          {this.menuNodes}
        </Menu>
      </div>
    )
  }
}

// 包装leftnav，使其可以获取props属性
export default withRouter(LeftNav)