import React, { Component } from 'react'
import {Icon,Form,Select,Input,Button, message} from 'antd'

import PicturesWall from './pictures-wall'
import RichTextEditor from './rich-text-editor'
import {reqCategorys,reqAddUpdateCategor} from '../../api'

const Item = Form.Item
const Option = Select.Option
// 商品管理的详情路由组件
class ProductSaveUpdate extends Component {

  state = {
    categorys:[],//一级分类列表
    subCategorys:[],//二级分类列表
  }

  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId)
    const categorys = result.data
    if(parentId === '0'){
      this.setState({
        categorys
      })
    } else {
      this.setState({
        subCategorys:categorys
      })
    }
  }

  // 根据状态中的分类数组动态生成Option数组
  renderOptions = () => {
    const {categorys,subCategorys} = this.state
    const options = categorys.map(c => (
      <Option key={c._id} value={c._id}>{c.name}</Option>
    ))
    const subOptions = subCategorys.map(c => (
      <Option key={c._id} value={c._id}>{c.name}</Option>
    ))

    return {options,subOptions}
  }

  // 显示二级分类列表
  showSubCategory = (parentId) => {
    const product = this.props.location.state || {}
    product.categoryId= ''
    this.getCategorys(parentId)
  }

  // 添加、更新产品
  submit = async () => {
    const {name, desc, price, category1, category2} = this.props.form.getFieldsValue()
    let pCategoryId,categoryId
    if(!category2 || category2 === '未选择'){
      pCategoryId = '0'
      categoryId = category1
    } else {
      pCategoryId = category1
      categoryId = category2
    }
    // 得到富文本输入内容
    const detail = this.refs.editor.getContent()
    // 得到所上传图片的文件名的数组
    const imgs = this.refs.imgs.getImgs()

    const product = {name, desc, price, pCategoryId, categoryId, imgs, detail}
    
    // 如果是更新，指定_id属性
    const p = this.props.location.state
    if(p){
      product._id = p._id
    }
    const result = await reqAddUpdateCategor(product)
    if(result.status === 0){
      message.success('保存商品成功')
      this.props.history.replace('/product/index')
    } else {
      message.error('保存失败，请重新操作')
    } 
  }
  componentDidMount() {
    this.getCategorys('0')
    // 如果当前是更新，且商品所属分类是二级分类(pCategoryId!=0)
    const product = this.props.location.state
    if(product && product.pCategoryId !== '0'){
      this.getCategorys(product.pCategoryId)
    }
  }

  render() {
    const {options,subOptions} = this.renderOptions()
    const product = this.props.location.state || {}
    const {getFieldDecorator} = this.props.form
    const formTailLayout = {
      labelCol:{span:3},
      wrapperCol:{span:12},
    }

    let initValue1 = '请选择分类'
    let initValue2 = '未选择'
    if(product.pCategoryId === '0'){
      initValue1 = product.categoryId
    } else if (product.pCategoryId) {
      initValue1 = product.pCategoryId
      initValue2 = product.categoryId || '未选择'
    }

    return (
      <div>
        <div>
          <h2>
            <a href="javascript:" onClick={() => this.props.history.goBack()}>
              <Icon type='arrow-left'/>
            </a>
            &nbsp;&nbsp;&nbsp;&nbsp;
            {product._id ? '修改商品' : '添加商品'} 

            <Form>
              <Item {...formTailLayout} label='商品名称'>
                {
                  getFieldDecorator('name',{
                    initialValue:product.name
                  })(
                    <Input placeholder='请输入商品名称'/>
                  )
                }
              </Item>

              <Item {...formTailLayout} label='商品描述'>
                {
                  getFieldDecorator('desc',{
                    initialValue:product.desc
                  })(
                    <Input placeholder='请输入商品描述'/>
                  )
                }
              </Item>

              <Item {...formTailLayout} label='商品价格'>
                {
                  getFieldDecorator('price',{
                    initialValue:product.price
                  })(
                    <Input placeholder='请输入商品价格' addonAfter='元'/>
                  )
                }
              </Item>

              <Item {...formTailLayout} label='商品分类'>
                {
                  options.length > 0 ?
                  getFieldDecorator('category1',{
                    initialValue:initValue1
                  })(
                    <Select style={{width:200}} onChange={value => this.showSubCategory(value)}>
                      {options}
                    </Select>
                  ) : null
                }
                &nbsp;&nbsp;&nbsp;&nbsp;
                {
                  subOptions.length > 0 ?
                  getFieldDecorator('category2',{
                    initialValue:initValue2
                  })(
                    <Select style={{width:200}}>
                      {subOptions}
                    </Select>
                  ) : null
                }
              </Item>

              <Item {...formTailLayout} label='商品图片'>
                <PicturesWall imgs={product.imgs} ref='imgs'/ >
              </Item>

              <Item label='商品详情' labelCol={{span:2}} wrapperCol={{span:20}}>
                <RichTextEditor ref='editor' detail={product.detail}/> 
              </Item>

              <Button type='primary' onClick={this.submit} style={{marginLeft:100}}>提交</Button>
            </Form>
          </h2>
        </div>
      </div>
    )
  }
}

export default Form.create()(ProductSaveUpdate)