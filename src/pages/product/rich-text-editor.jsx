import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { EditorState, convertToRaw,ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'

// 用来指定商品详情信息的富文本编辑器组件
export default class RichTextEditor extends Component {

    static propTypes = {
        detail:PropTypes.string
    }

    state = {
        editorState: EditorState.createEmpty(),
      }
    
      onEditorStateChange = (editorState) => {
        this.setState({
          editorState,
        })
      }

    //   获取富文本输入内容
    getContent = () => {
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }

    componentWillMount (){
        const detail = this.props.detail
        if(detail){
            const blocksFromHtml = htmlToDraft(this.props.detail)
            const {contentBlocks,entityMap} = blocksFromHtml
            const contentState = ContentState.createFromBlockArray(contentBlocks,entityMap)
            const editorState = EditorState.createWithContent(contentState)
            this.setState({
                editorState : editorState
            })
        }
    }

    render() {
        const { editorState } = this.state
        return (
          <div>
            <Editor
              editorState={editorState}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              onEditorStateChange={this.onEditorStateChange}
            />
          </div>
        )
    }
}
