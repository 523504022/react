import React, { Component } from 'react'
import {
    Form,
    Input,
    Button,
    Icon,
    Checkbox
} from 'antd'
import PropTypes from 'prop-types'
import MeoryUtils from '../../utils/MemoryUtils'
import storageUtils from '../../utils/storageUtils'
import {reqLogin} from '../../api'
import logo from '../../assets/images/logo.png'
import './index.less'

const Item = Form.Item
export default class Login extends Component {
    state = { 
          errorMsg:''
    }
    
    login = async (username,password) => {
        const result = await reqLogin(username,password)
        console.log(result)
        if(result.status === 0){//登录成功
            const user = result.data
            //保存user
            storageUtils.saveUser(user)// local中
            MeoryUtils.user = user //内存中
            //跳转到管理界面
            this.props.history.replace('/')       
        } else {//登录失败
            this.setState({
                errorMsg:result.msg
            })
        }
    }

  render() {
    const {errorMsg} = this.state
    return (
        <div className='login'>
        <div className="login-header">
          <img src={logo} alt="硅谷后台管理系统"/>
          React项目: 后台管理系统
        </div>
        <div className="login-content">
          <div className="login-box">
            <div className="error-msg-wrap">
              <div className={errorMsg ? "show" : ""}>
                {errorMsg}
              </div>
            </div>
            <div className="title">用户登陆</div>
            <LoginForm login={this.login}/>
          </div>
        </div>
      </div>
    )
  }
}

class LoginForm extends Component {

    static propTypes = {
        login:PropTypes.func.isRequired
    }

    checkUsername = (rule,value,callback) => {
        if(!value){
            callback('请输入密码')
        } else if(value.length < 4 || value.length > 8){
            callback('密码至少4位最多8位')
        } else {
            callback()
        }
    }

    loginClick = () => {
        this.props.form.validateFields(async(err,values) => {
            if(!err){
                console.log('收集表单数据',values)
                const {username,password} = values
                this.props.login(username,password)
            } else {
                
            }
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form
        return (
            <Form className="login-form">
              <Item>
                {
                    getFieldDecorator('username',{
                        initialValue: 'admin',
                        rules:[
                            {type: "string", required: true, message: '必须输入用户名' },
                            {min: 4, message: '长度至少4位'}
                        ]
                    })(
                        <Input placeholder="请输入用户名" prefix={<Icon type="user"/>}/>
                    )
                }
              </Item>
              <Item>
                {
                    getFieldDecorator('password',{
                        rules:[{validator: this.checkPassword}]
                    })(
                        <Input type="password" placeholder="请输入密码" prefix={<Icon type="safety"/>}/>
                    )
                }
              </Item>
              <Item>
                {
                    getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: false,
                    })(
                        <Checkbox>Remember me</Checkbox>
                    )
                }
                <a className="login-form-forgot" href="javascirpt">Forgot password</a>
              </Item>
              <Item>
                <Button type="primary" onClick={this.loginClick} className="login-form-button">登录</Button>
              </Item>
            </Form>
        )
    }
}

LoginForm = Form.create()(LoginForm)