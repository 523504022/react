import React, { Component } from 'react'
import {Form, Input, Button, Icon} from 'antd'
import logo from '../../assets/images/logo.png'
import './login.less'

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
            <LoginForm/>
          </div>
        </div>
      </div>

    )
  }
}

class LoginForm extends Component {
    clickLogin = () => {
        this.props.form.validateFields((err, values) => {
            console.log('validateFields', err, values)
            if (!err) {
                console.log('收集表单数据', values)
            }else{
                this.props.form.resetFields()
            }
        })
    }
    render() {
        const {getFieldDecorator} = this.props.form
        return(
            <Form className="login-form">
              <Item>
                {
                    getFieldDecorator('username', {
                        rules: [
                            { required: true, message: '必须输入用户名' },
                            { min: 4, message: '用户名最少4位'}
                        ],
                    })(
                        <Input placeholder='请输入用户名' prefix={<Icon type="user"/> }/>
                    )
                }
              </Item>
              <Item>
                {
                    getFieldDecorator('password',{
                        rules: [{ required: true, message: '请输入密码' }],
                    })(
                        <Input type='password' placeholder='请输入密码' prefix={<Icon type="lock" />} />
                    )
                }
              </Item>
              <Item>
                <Button type='primary' className='login-form-button' onClick={this.clickLogin}>登录</Button>
              </Item>
            </Form>
        )
    }
}
LoginForm = Form.create()(LoginForm)