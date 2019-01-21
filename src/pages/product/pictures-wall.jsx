import React from 'react'
import PropTypes from 'prop-types'

import { Upload, Icon, Modal, message,  } from 'antd' 
import {reqDeleteImg} from '../../api'

// 管理商品图片的组件
export default class PicturesWall extends React.Component {

  static propTypes = {
    imgs:PropTypes.array
  }

  state = {
    previewVisible: false,//是否显示大图预览
    previewImage: '',//大图的url
    fileList: []//所有需要显示的图片信息对象的数组
  } 

  // 关闭大图预览
  handleCancel = () => this.setState({ previewVisible: false })

  // 大图预览
  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    }) 
  }

  handleChange = async ({ file,fileList }) => {
    if(file.status === 'done'){
      const result = file.response
      if(result.status === 0){
        message.success('上传成功')
        const {name,url} = result.data
        file = fileList[fileList.length-1]
        file.name = name
        file.url = url 
      } else {
        message.error('上传失败')
      } 
    } else if(file.status === 'removed'){
      const result = await reqDeleteImg(file.name)
      if(result.status === 0){
        message.success('删除成功')
      } else {
        message.error('删除失败')
      }
    }
    // 更新状态
    this.setState({ fileList })
  }
  
  // 判断初始显示
  ifDisplay = () => {
    const imgs = this.props.imgs
    if(imgs && imgs.length > 0){
      const fileList = imgs.map((img,index) => ({
        uid:-index,
        name:img,
        status:'done',
        url:'http://localhost:5000/upload/'+img
      }))
      this.setState({
        fileList:fileList
      })
    }
  }

  // 得到当前已上传的图片文件名的数组
  getImgs = () => {
    return this.state.fileList.map(file => file.name)
  }

  componentWillMount() {
    this.ifDisplay()
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state 
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">Upload</div>
      </div>
    ) 
    return (
      <div className="clearfix">
        <Upload
          action="/manage/img/upload"
          accept='image/*'
          name='image'
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 3 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    ) 
  }
}
