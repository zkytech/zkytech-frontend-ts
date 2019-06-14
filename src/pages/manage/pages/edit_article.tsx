import React from 'react';
import {
    Input, Switch, Button, message, Row, Col, Select, Divider, Icon, Tooltip
} from "antd";
import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.css';
import marked from 'marked'
import '../../article_style.less'
import style from '../../style.module.less'
import {
    getClassificationNameList,
    addClasificationName
} from '../../../api/classification'
import {editArticle, publishArticle} from '../../../api/article'
import {connect} from "react-redux";
import {RouteComponentProps} from "react-router";

const {Option} = Select
const {TextArea} = Input

interface ReduxState{
    article:EntityArticle
}

type EditArticlePageProps = ReduxState & RouteComponentProps<any>

interface EditArticlePageState{
    classificationNameList:EntityClassification[],
    article: EntityArticle|null,
    content:string,
    showPreview: boolean,
    classificationId: number,
    id:number|null,
    selectLoading:boolean
}

class EditArticlePage extends React.Component<EditArticlePageProps,EditArticlePageState>{

    public state:EditArticlePageState = {
        selectLoading:false,
        classificationNameList:[],
        article: null,
        content:'',
        showPreview: true,
        classificationId: -1,
        id:(new URLSearchParams(this.props.location.search)).get('id')?Number((new URLSearchParams(this.props.location.search)).get('id')):null
    }

    public mouseLocation:'left'|'right'|null = null

    public left:HTMLElement|null = null

    public right:HTMLElement|null = null


    componentWillMount(): void {
        marked.setOptions({
            highlight: code => hljs.highlightAuto(code).value,
        })  // 设置代码高亮

        if(this.state.id !==  null){
            this.setState(
                {
                    article:this.props.article,
                    content:this.props.article.content,
                    classificationId:this.props.article.classification.id
                }
            )
        }
        getClassificationNameList().then(res => {
            if (!res.success) {
                message.error(res.message)
            }
            if (res.data.length > 0) {
                this.setState(
                    {
                        classificationNameList: res.data,
                        selectLoading: false
                    }
                )
                if(this.state.id === null){
                    this.setState({
                        classificationId:res.data[0].id
                    })
                }
                return
            }
            this.setState(
                {
                    selectLoading: false
                }
            )
        })
    }

    componentDidMount(): void {
        this.left = window.document.getElementById('edit_left') as HTMLElement
        this.right = window.document.getElementById('edit_right') as HTMLElement

        this.left.addEventListener('scroll', this.leftScroll)
        this.left.addEventListener('mouseover', (e) => {
            this.mouseLocation = 'left'
        })
        this.right.addEventListener('scroll', this.rightScroll)
        this.right.addEventListener('mouseover', (e) => {
            this.mouseLocation = 'right'
        })
        window.addEventListener('resize', this.autoEditorHeight)
        this.autoEditorHeight()
    }

    componentDidUpdate(prevProps: Readonly<ReduxState & RouteComponentProps<any>>, prevState: Readonly<EditArticlePageState>, snapshot?: any): void {
        if (!prevState.showPreview && this.state.showPreview) {
            this.right = window.document.getElementById('edit_right') as HTMLElement
        }
    }

    articleChange=(e:any):void=>{
        this.setState({
            content: e.target.value
        })

    }

    leftScroll=(e:any):void=> {
        if (this.mouseLocation === 'left') {
            this.right = this.right as HTMLElement

            this.right.scrollTop = e.target.scrollTop * (this.right.scrollHeight - this.right.clientHeight) / (e.target.scrollHeight - e.target.clientHeight)
        }
    }

    rightScroll=(e:any):void=>{

        if (this.mouseLocation === 'right') {
            this.left = this.left as HTMLElement

            this.left.scrollTop = e.target.scrollTop * (this.left.scrollHeight - this.left.clientHeight) / (e.target.scrollHeight - e.target.clientHeight)
        }
    }

    switchChange=(checked:boolean):void => {
        if (checked) {
            this.setState({
                showPreview: true
            })
        } else {
            this.setState({
                showPreview: false
            })
        }
    }

    autoEditorHeight=():void=> {
        const windowHeight = document.body.clientHeight
        const editorHeight = windowHeight - 70 - 36 - 69 - 5 - 0.5;
        (this.left as HTMLElement).style.height = editorHeight + 'px';
        (this.right as HTMLElement).style.height = editorHeight + 'px'
    }

    getTitle=(article:string):string => {
        const patt = /#+\s+(.+)\n/
        var result = article.match(patt) as RegExpExecArray
        return result[1]
    }

    publish=():void=> {
        const content = this.state.content
        const title = this.getTitle(content)
        const classificationId = this.state.classificationId
        // 提交的标题与正文内容不能为空
        if (title === '' || content === '') {
            message.warning('正文或标题不能为空！')
        } else {

            if(this.state.id){
                editArticle(this.state.id,classificationId, content, title).then(res=>{
                        if (res.success) {
                            message.success(res.message)
                        } else {
                            message.error(res.message)
                        }
                    }

                )
            }else{
                publishArticle({title, content,classificationId}).then(res => {
                    if (res.success) {
                        message.success(res.message)
                        this.setState({
                            article: null
                        })
                    } else {
                        message.error(res.message)
                    }
                })
            }
        }
    }

    render() {
        const edit_right_hidden:boolean = !this.state.showPreview
        const spanLeft:number = this.state.showPreview ? 12 : 24
        let {classificationNameList,classificationId} = this.state
        if(classificationId === -1) {
            classificationId = 1
        }
        const options:JSX.Element[] = classificationNameList.map(v=>(
            <Option value={v.id} key={v.id}>{v.classificationName}</Option>
        ))

        return (
            <div>
                <Row>
                    <Col span={24}>
                        <ul className={style.control_panel}>
                            <li><Switch defaultChecked checkedChildren='预览' unCheckedChildren='预览'
                                        onChange={this.switchChange.bind(this)}/></li>
                            <li>
                                <Select defaultValue = {classificationId}
                                        onChange={value => {
                                            this.setState({
                                                classificationId:value
                                            })
                                }}>
                                    {options}
                                </Select>
                                {/*<MySelector onChange={v =>{ this.setState({classificationId: v})} }classificationId={this.state.classificationId}/>*/}
                            </li>
                            <li><Button type='primary' icon='cloud-upload' onClick={this.publish.bind(this)}>发布</Button>
                            </li>
                        </ul>
                    </Col>
                </Row>
                <Row>
                    <Col span={spanLeft}>
                        <TextArea autoFocus id='edit_left' style={{clear: 'both', resize: "none"}}
                                  className={style.edit_article_textarea}
                                  autosize={false} value={this.state.content} onChange={this.articleChange.bind(this)}/>
                    </Col>
                    <Col span={24 - spanLeft}>
                        <div id='edit_right' className={style.preview_article_div}
                             dangerouslySetInnerHTML={{__html: marked(this.state.content)}} hidden={edit_right_hidden}/>
                    </Col>
                </Row>
            </div>
        );
    }

}

const mapStateToProps = (state:any):ReduxState => {
    return {article:state.article.article}
}

export default connect(mapStateToProps)(EditArticlePage)
