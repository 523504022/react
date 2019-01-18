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
import {reqCategorys,reqAddCategory,reqUpdateCategorys} from '../../api' 

const Item = Form.Item
const Option = Select.Option

// 分类管理路由组件
export default class Category extends Component {

  state = {
    parentId:'0',//当前分类列表的parentid
    parentName:'',//父分类的名称
    categorys:[],//一级分类列表
    subCategorys:[],//二级分类列表
    isShowAdd:false,//是否显示添加的框
    isShowUpdate:false //是否显示更新的框
  }

  // 获取一/二级分类列表
  getCategorys = async (pId) => {
    const parentId = pId || this.state.parentId
    const result = await reqCategorys(parentId)
    if(result.status === 0){
      const categorys = result.data
      // 更新状态
      if(parentId === '0'){//更新一级分类
        this.setState({
          categorys
        })
      } else {//更新二级分类
        this.setState({
          subCategorys:categorys 
        })
      }
    }
  }
  
  // 显示更新分类界面
  showUpdate = (category) => {
    // 保存分类对象
    this.category = category
    // 显示更新分类的modal
    this.setState({
      isShowUpdate:true
    })
  }
  // 显示二级分类列表
  showSubCategorys = (category) => {
    this.setState({
      parentId:category._id,
      parentName:category.name
    },() => {
      this.getCategorys()
    })
  }

  // 更新分类
  updateCategory = async() => { 
    // 隐藏框
    this.setState({
      isShowUpdate:false
    })
    // 收集数据
    const categoryId = this.category._id
    const categoryName = this.form.getFieldValue('categoryName')
    // 重置表单项
    this.form.resetFields()
    // 发ajax请求
    const result = await reqUpdateCategorys({categoryId,categoryName})
    if(result.status === 0){
      message.success('修改分类成功')
      this.getCategorys()
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
    // 重置表单项
    this.form.resetFields()
    // 提交添加分类请求
    const result = await reqAddCategory(parentId,categoryName)
    if(result.status === 0){
       message.success('添加成功')
       if(parentId === this.state.parentId || parentId === '0'){
        this.getCategorys(parentId)
       }
    }
  }
  // 显示一级分类列表
  showCategorys = () => { 
    this.setState({
      parentId:'0',
      parentName:'',
      subCategorys:[]
    })
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
            <a href="javascript:" onClick={() => this.showUpdate(category)}>修改分类</a>
            <a href="javascript:" style={{float:'right'}} onClick={() => this.showSubCategorys(category)}>查看子分类</a>
          </span>
        )
      }
    },]
  }

  render() {
    // 所有列的数组
    const columns = this.columns
    // 得到分类的数组
    const {categorys,isShowAdd,isShowUpdate,subCategorys,parentId,parentName} = this.state
    const category = this.category || {}

    return (
      <div>
        <Card>
          {
            parentId === '0'
            ? <span style={{fontSize:20}}>一级分类列表</span>
            : (
              <span>
                <a href="javascript:" onClick={this.showCategorys}>一级分类</a>
                &nbsp;&nbsp;&nbsp;
                <Icon type='arrow-right'/>
                &nbsp;&nbsp;&nbsp;
                <span>{parentName}</span>
              </span>
            )
          }
          
          <Button type='primary' style={{float:'right'}} onClick={() => this.setState({isShowAdd:true})}>
            <Icon type='plus'></Icon>
            添加分类
          </Button>
        </Card>
        <Table 
        bordered
        rowKey='_id'
        columns={columns} 
        dataSource={parentId==='0' ? categorys : subCategorys}
        loading={categorys.length === 0}
        pagination={{defaultPageSize:10,showSizeChanger:true,showQuickJumper:true}}
        />

        <Modal
          title="更新分类"
          visible={isShowUpdate}
          onOk={this.updateCategory}
          onCancel={() => this.setState({isShowUpdate:false})}
        >
          <UpdateFrom categoryName={category.name} setForm={(form) => this.form = form}/>
        </Modal>

        <Modal
          title="添加分类"
          visible={isShowAdd}
          onOk={this.addCategory}
          onCancel={() => this.setState({isShowAdd:false})}
        >
          <AddFrom categorys={categorys} parentId={parentId} setForm={(form) => this.form = form}/>
        </Modal>
      </div>
    )
  }
}
// 添加分类的form组件
class AddFrom extends Component {

  static propTypes = {
    categorys:propTypes.array.isRequired,
    setForm:propTypes.func.isRequired,
    parentId:propTypes.string.isRequired
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render(){

    const {getFieldDecorator} = this.props.form
    const {categorys,parentId} = this.props

    return (
      <Form>
        <Item label='所属分类'>
          {
            getFieldDecorator('parentId',{
              initialValue:parentId
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

// 更新分类的from组件
class UpdateFrom extends Component {

  static propTypes = {
    categoryName:propTypes.string,
    setForm:propTypes.func.isRequired
  }

  componentWillMount() {
    this.props.setForm(this.props.form)
  }

  render(){

    const {getFieldDecorator} = this.props.form
    const {categoryName} = this.props

    return (
      <Form>
        <Item>
          {
            getFieldDecorator('categoryName',{
              initiaValue:categoryName
            })(
              <Input placeholder='请输入要修改的分类名称'/>
            )
          }
        </Item>
      </Form>
    )
  }
}

UpdateFrom = Form.create()(UpdateFrom)