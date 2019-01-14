import React, { Component } from 'react'
import {
    Form,
    Input,
    Button,
    Icon,
    Checkbox
} from 'antd'
import logo from '../../assets/images/logo.png'
import './index.less'

const Item = Form.Item
export default class Login extends Component {
  render() {
    return (
        <div className='login'>
        <div className="login-header">
          <img src={logo} alt="硅谷后台管理系统"/>
          React项目: 后台管理系统
        </div>
        <div className="login-content">
          <div className="login-box">
            <div className="title">用户登陆</div>
            <LoginForm />
          </div>
        </div>
      </div>
    )
  }
}

class LoginForm extends Component {
    checkUsername = (rule,value,callback) => {
        if(!value){
            callback('请输入用户名')
        } else if(value.length < 4 || value.length > 8){
            callback('用户名至少4位最多8位')
        } else {
            callback()
        }
    }

    loginClick = () => {
        this.props.form.validateFields((err,values) => {
            if(!err){
                console.log('收集表单数据',values)
            } else {
                this.props.form.resetFields()
            }
        })
    }

    render(){
        const { getFieldDecorator } = this.props.form
        return (
            <Form className="login-form">
              <Item>
                {
                    getFieldDecorator('userName',{
                        initialValue: 'AFeng',
                        rules:[{type: 'string',validator: this.checkUsername}]
                    })(
                        <Input placeholder="用户名" prefix={<Icon type="user"/>}/>
                    )
                }
              </Item>
              <Item>
                {
                    getFieldDecorator('passWord',{
                        rules:[
                            {required: true, message: '请输入密码'},
                            {min: 4,message: '密码至少4位'}
                        ]
                    })(
                        <Input type="password" placeholder="密码" prefix={<Icon type="safety"/>}/>
                    )
                }
              </Item>
              <Item>
                {
                    getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
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