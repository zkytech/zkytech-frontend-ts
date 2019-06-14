import React  from 'react';
import hljs from 'highlight.js';
import 'highlight.js/styles/monokai-sublime.css';
import marked from 'marked'
import './article_style.less'
import style from './style.module.less'
import { Anchor, Col, Row, BackTop, message, Button, Affix, Skeleton } from 'antd'
import {addClick, deleteArticle, getArticle} from "../api/article";
import {RouteComponentProps, withRouter} from 'react-router-dom'
import { editArticleAction } from "../actions";
import { connect } from "react-redux";
import Comments from '../components/comments'
import QueueAnim from "rc-queue-anim";
import {Dispatch} from "redux";

const { Link } = Anchor

const MyLink = (child:JSX.Element|JSX.Element[], href:string, title:string|JSX.Element, index:string|number) => {
    return <Link href={href} title={title} key={index}>
        {child}
    </Link>
}

interface MyTitle {level:number,title:string,index:number,parent:number}

/**
 * 递归创建组件树
 * @param ChildrenList
 * @param parent
 * @returns {*}
 */
const makeTree = (ChildrenList:MyTitle[], parent?:MyTitle):any=> {
    let pIndex
    if (!parent) {
        pIndex = -1
    } else {
        pIndex = parent.index
    }
    let possibleChildrenList = JSON.parse(JSON.stringify(ChildrenList))
    let children = []


    for (let index in possibleChildrenList) {
        let pcl = possibleChildrenList[index]

        if (pcl.parent === pIndex) {
            children.push(makeTree(possibleChildrenList.slice(Number(index)+1), pcl))
        }
    }

    if (parent) {
        // 已经配置marked.js自动为标题创建了id，这里的正则处理是为了配合marked.js的id命名规则
        // eslint-disable-next-line no-useless-escape
        return MyLink(children, `#${parent.title.replace(/[.()\/]/g,'').replace(/ /g,'-').toLowerCase()}`, parent.title, parent.index)
    } else {
        return children
    }
}

const LinkTree = (article:string) => {
    const titles = article.match(/#+\s.+\n/g)
    let titleTree:any[] = []
    if(titles){
        titles.forEach((value, index) => {
            let level = (value.match(/#/g) as RegExpMatchArray).length

            let title = (/#+ +(.+)/g.exec(value) as RegExpExecArray)[1]
            let parent = -1
            titleTree.forEach(v => {
                if (v.level === (level - 1)) {
                    parent = v.index
                }
            })
            titleTree.push({level, title, index, parent})
        })
        titleTree.forEach((value, index) => {
            let counter = 1
            titleTree.slice(index + 1).forEach(
                (v, i) => {
                    if (v.title === value.title) {
                        titleTree[v.index].title = `${v.title}-${counter}`
                        counter++
                    }
                }
            )
        })
        return makeTree(titleTree)
    }else{
        return null
    }
}
interface ReduxState{
    user:EntityUser
}

interface ReduxDispatch{
    onEditArticle : (article:EntityArticle) => any
}


interface ArticlePageProps extends RouteComponentProps<any>{

}

type ArticlePagePropsWithRedux = ReduxState & ReduxDispatch & ArticlePageProps

interface ArticlePageState {

    id:number,
    article:EntityArticle|null,
    loading:boolean
}

class ArticlePage extends React.Component<ArticlePagePropsWithRedux,ArticlePageState>{

    public state:ArticlePageState = {

        id: this.props.match.params.id,
        article: null,
        loading:true
    }

    componentWillMount(): void {
        const {id} = this.state
        marked.setOptions({
            highlight: code => hljs.highlightAuto(code).value,
            headerIds: true,
        }) // 设置代码高亮
        getArticle(id).then(res => {
            if (res.success) {
                this.setState({
                    loading:false,
                    article: res.data
                })
            } else {
                message.error(res.message)
            }
        })
        addClick(id) //增加一次点击量
    }

    render() {
        const {article, id, loading} = this.state
        let content:string
        if (!article) {
            content = ''
        } else {
            content = article.content
        }
        const adminTools = <Row>
            <Col span={24}>
                <Affix offsetTop={80} className={style.admin_button_affix}>
                    <Button type={'link'} className={style.admin_button_edit} onClick={() => {
                        this.props.onEditArticle(article as EntityArticle);
                        this.props.history.push(`/admin/manage/edit?id=${id}`)
                    }}>编辑</Button>
                    <Button type={'link'} className={style.admin_button_delete} onClick={() => {
                        deleteArticle(id).then(res => message.success(res.message));
                        this.props.history.goBack()
                    }}>删除</Button>
                </Affix>
            </Col>
        </Row>

        return (
            <div>
                {this.props.user.userType === "ADMIN"?adminTools:null}
                <Row>
                    <Col xs={0} xl={4} key={'1'}>
                        <Anchor offsetTop={100}
                                getContainer={() => ((window.document.getElementById("myScroll") as HTMLElement).childNodes[0] as HTMLElement)}
                        >
                            <Skeleton loading={loading} active={true} paragraph={{ rows: 5 }} title={{width:'100px'}} >
                                <QueueAnim
                                    type={['left', 'right']}
                                    duration={700}
                                >
                                    {content ? LinkTree(content) : null}
                                </QueueAnim>
                            </Skeleton>
                        </Anchor>
                    </Col>
                    <Col xs={24} xl={20} key={'2'}>
                        <BackTop className={style.back_to_top} target={() => ((window.document.getElementById('myScroll') as HTMLElement).childNodes[0]) as HTMLElement}/>
                        <Skeleton loading={loading} active={true} paragraph={{ rows: 20 }} title={{width:'300px'}} >
                            <QueueAnim
                                type={['right', 'left']}
                                duration={700}
                            >
                                <div className={style.article_page}
                                     key={1}
                                     dangerouslySetInnerHTML={{__html: marked(content)}}/>
                            </QueueAnim>
                        </Skeleton>
                        <Comments articleId={id}/>
                    </Col>
                </Row>
            </div>
        );
    }
}

const mapDispatchToProps = (dispatch:Dispatch):ReduxDispatch => {
    return {
        onEditArticle:(article:EntityArticle) => editArticleAction(dispatch,article)
    }
}

const mapStateToProps = (state:any):ReduxState => {
    return {
        user:state.auth.user
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(ArticlePage))