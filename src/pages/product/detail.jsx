import React, { Component } from 'react'
// 商品管理的详情路由组件
export default class ProductDetail extends Component {
  render() {

    const product = this.props.location.state || {}

    return (
      <div>
        ProductDetail
      </div>
    )
  }
}
