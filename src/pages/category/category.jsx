import React, { Component } from 'react'
import propTypes from 'prop-types'
import {
  Card,
  Table,
  Button,
  Icon,
  Modal,
  Form,
  Input,
  Select,
  message
} from 'antd'
import {reqCategorys,reqAddCategory} from '../../api' 

const Item = Form.Item
const Option = Select.Option

// 分类管理路由组件
export default class Category extends Component {

  state = {
    categorys:[],//一级分类列表
    isShowAdd:false,//是否显示添加的框
  }

  // 获取一级分类列表
  getCategorys = async () => {

    const result = await reqCategorys('0')
    if(result.status === 0){
      const categorys = result.data
      // 更新状态
      this.setState({
        categorys
      })
    }
  }

  // 添加分类
  addCategory = async() => {
    // 隐藏添加框
    this.setState({
      isShowAdd:false
    })
    // 得到输入数据
    const {parentId,categoryName} = this.form.getFieldsValue()
    // 提交添加分类请求
    const result = await reqAddCategory(parentId,categoryName)
    if(result.status === 0){
       message.success('添加成功')
       this.getCategorys()
    }
  }
  componentDidMount(){
    this.getCategorys()
  }

  componentWillMount(){
     // 所有列的数组
     this.columns = [{
      title: '分类名称',
      dataIndex: 'name'
    }, {
      title: '操作',
      width: 200,
      render: (category) => {
        return (
          <span>
            <a href="javascript:">修改分类</a>
            <a href="javascript:" style={{float:'right'}}>查看子分类</a>
          </span>
        )
      }
    },]
  }

  render() {
    // 所有列的数组
    const columns = this.columns
    // 得到分类的数组
    const {categorys,isShowAdd} = this.state

    return (
      <div>
        <Card>
          <span style={{fontSize:20}}>一级分类列表</span>
          <Button type='primary' style={{float:'right'}} onClick={() => this.setState({isShowAdd:true})}>
            <Icon type='plus'></Icon>
            添加分类
          </Button>
        </Card>
        <Table 
        bordered
        rowKey='_id'
        columns={columns} 
        dataSource={categorys}
        loading={categorys.length === 0}
        pagination={{defaultPageSize:10,showSizeChanger:true,showQuickJumper:true}}
        />

        <Modal
          title="添加分类"
          visible={isShowAdd}
          onOk={this.addCategory}
          onCancel={() => this.setState({isShowAdd:false})}
        >
          <AddFrom categorys={categorys} setForm={(form) => this.form = form}/>
        </Modal>
      </div>
    )
  }
}

class AddFrom extends Component {

  static propTypes = {
    categorys:propTypes.array.isRequired,
    setForm:propTypes.func.isRequired
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render(){

    const {getFieldDecorator} = this.props.form
    const {categorys} = this.props

    return (
      <Form>
        <Item label='所属分类'>
          {
            getFieldDecorator('parentId',{
              initialValue:'0'
            })(
              <Select>
                <Option key='0' value='0'>一级分类</Option>
                {
                  categorys.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)
                }
              </Select>
            )
          }
        </Item>
        <Item label='分类名称'>
          {
            getFieldDecorator('categoryName',{
              initiaValue:''
            })(
              <Input placeholder='请输入分类名称'/>
            )
          }
        </Item>
      </Form>
    )
  }
}

AddFrom = Form.create()(AddFrom)