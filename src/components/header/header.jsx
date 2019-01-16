import React, {Component} from 'react'
import {Row,Col,Modal} from 'antd'
import {withRouter} from 'react-router-dom'

import {formateDate} from '../../utils/utils'
import {reqWeather} from '../../api'
import MemoryUtils from '../../utils/MemoryUtils'
import storageUtils from '../../utils/storageUtils'
import menuList from '../../config/menuConfig'

import './header.less'

/*
头部组件
 */
class Header extends Component {

  state = {
    sysTime:formateDate(Date.now()),
    dayPictureUrl:'',
    weather:''
  }

  getWeather = async () => {
    const {dayPictureUrl,weather} = await reqWeather('北京')
    this.setState({
      dayPictureUrl,
      weather
    })
  }

  getSysTime = () => {
    this.intervalId = setInterval(() => {
      this.setState({
        sysTime:formateDate(Date.now())
      })
    },1000)
  }

  // 退出登录
  logout = () => {
    Modal.confirm({
      content: '确定要退出吗？',
      onOk: () => {
        // 移除保存的user
        storageUtils.removeUser()
        MemoryUtils.user = {}
        // 跳转到login
        this.props.history.replace('/login')
      },
      onCancel() {

      },
    })
  }
  // 根据请求的path路径得到对应的标题
  getTitle = (path) => {
    let title
    menuList.forEach(menu => {
      if(menu.key === path){
        title = menu.title
      } else if(menu.children){
        menu.children.forEach(item => {
          if(item.key === path){
            title = item.title
          }
        })
      }
    })
    return title
  }

  componentDidMount() {
    // 启动循环定时器，每秒更新一次sysTime
    this.getSysTime()
    // 发异步ajax获取天气数据并更新状态
    this.getWeather()
  }

  componentWillUnmount(){
    clearInterval(this.intervalId)
  }

  render() {

    const {sysTime,dayPictureUrl,weather} = this.state
    // 得到当前用户
    const user = MemoryUtils.user
    // 得到当前请求路径
    const path = this.props.location.pathname
    // 得到对应的标题
    const title = this.getTitle(path)

    return (
      <div className='header'>
        <Row className='header-top'>
          <span>欢迎，{user.username}</span>
          <a href="javascript:" onClick={this.logout}>退出</a>
        </Row>
        <Row className='breadcrumb'>
          <Col span={3} className='breadcrumb-title'>
            <span>{title}</span>
          </Col>
          <Col span={21} className='weather'>
            <span className='date'>{sysTime}</span>
            <span className='weather-img'>
              <img src={dayPictureUrl} alt="weather"/>
            </span>
            <span className='weather-detail'>{weather}</span>
          </Col>
        </Row>
      </div>
    )
  }
}

export default withRouter(Header)