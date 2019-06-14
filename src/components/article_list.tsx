import React, {ReactNode} from 'react'
import {Link, RouteComponentProps, withRouter} from "react-router-dom"
import style from './style.module.less'
import {Divider, message,Spin, Pagination} from 'antd'
import {getArticleList} from "../api/article"
import marked from 'marked'
import Highlighter from "react-highlight-words"
import QueueAnim from "rc-queue-anim";
import InfiniteScroll from 'react-infinite-scroller';


interface MyListItemProps {title:string|ReactNode,description:string|ReactNode,content:string|ReactNode,link:string}


const MyListItem : React.FC<MyListItemProps> = ({title,description,content,link})=>{
    return (
        <div className={style.my_list_item}>
            <Link to={link}>
                <div className={style.my_list_title}><strong>{title}</strong></div>
                <div className={style.my_list_description}>{description}</div>
                <div className={style.my_list_content} >{content}</div>
            </Link>
        </div>
    )
}

interface ArticleListProps extends RouteComponentProps<any>{
    infinite?:boolean,
    infiniteLoadSize?:number,
    pageSize?:number,
    keyword?:string
}
interface ArticleListState {
    page:number,
    pageSize:number,
    total:number,
    totalPages:number,
    loading:boolean,
    hasMore:boolean,
    articleList:Array<EntityArticle>,
    initialEndId:number,
    initLoading:boolean,
    classificationId:number|null,
    keyword:string
}

class ArticleList extends React.Component<ArticleListProps,ArticleListState>{

    /**
     * 设置props的默认值
     */
    public static defaultProps:Partial<ArticleListProps> = {
        infinite: false,
        infiniteLoadSize: 3,
        pageSize: 10,
    }

    /**
     * 初始化state
     */

    public state:ArticleListState= {
        page: 1,
        pageSize: this.props.pageSize as number,
        total: 0,
        totalPages: 0,
        loading: false,
        hasMore: true,
        articleList: [],
        initialEndId: 0,
        initLoading: true,
        classificationId: (new URLSearchParams(this.props.location.search)).get('id')?Number((new URLSearchParams(this.props.location.search)).get('id')):null,
        keyword: (new URLSearchParams(this.props.location.search)).get('keyword')?(new URLSearchParams(this.props.location.search)).get('keyword') as string:'',
    }

    private onGetPage=async (pageSize:number,page:number,option:GetArticleListOption):Promise<MyApiResponse>=>{
        this.setState({
            initLoading:true,
            page,
            pageSize
        })
        return getArticleList(pageSize,page,option)
    }

    private initState = (props:Readonly<ArticleListProps>)=> {
        let params:URLSearchParams = new URLSearchParams(props.location.search)
        let keyword:string = params.get('keyword')?params.get('keyword') as string:''
        let classificationId = params.get('id')?Number(params.get('id')):null
        this.setState({
            page: 1,
            pageSize: props.pageSize as number,
            total: 0,
            totalPages: 0,
            loading: false,
            hasMore: true,
            articleList: [],
            initialEndId: 0,
            initLoading: true,
            classificationId,
            keyword
        })
    }
    // 初始请求
    private initRequest = ():void => {
        let params:URLSearchParams = new URLSearchParams(this.props.location.search)
        let keyword:string = params.get('keyword')?params.get('keyword') as string:''
        const {page,pageSize,classificationId} = this.state
        this.onGetPage(pageSize,page,{keyword,classificationId}).then(
            res=>{
                if (res.success){
                    this.setState({
                        articleList:res.data.content,
                        initialEndId: res.data.content[res.data.content.length - 1] ? res.data.content[res.data.content.length - 1].id : 0,
                    })
                }else{
                    message.error(res.message)
                }
            }
        )
    }

    /**
     * 滚动加载处理方法
     */
    private handleInfiniteOnLoad = ():void => {
        this.setState({
            loading:true
        })
        if(this.state.page >= this.state.totalPages) {
            // 已加载完所有数据
            this.setState({
                hasMore:false,
                loading:false
            })
        }
        if(this.state.articleList.length > this.state.pageSize){
            this.setState({
                page:this.state.page + 1
            })
        }
        getArticleList(this.props.infiniteLoadSize as number, this.state.page, {endId: this.state.initialEndId}).then(
            res=>{
                this.setState({
                    loading: false,
                    articleList: this.state.articleList.concat(res.data.content),
                    total: res.data.totalElements,
                    totalPages: res.data.totalPages
                })
            }
        )
    }

    /**
     * 获取文章列表中缩略展示的文章内容
     * @param article
     */
    private getContent =(article:string):string=>{
        const {keyword} = this.state
        // strLength必须为偶数
        const strLength:number = 300
        const patt:RegExp = new RegExp("#+\\s+.+\\n")
        // 这里做了断言，因为博客中的文章必定会有标题
        const title:string = (patt.exec(article) as RegExpExecArray)[0]
        // 将标题去掉，只保留文章内容
        article = article.replace(title,'')
        // 定位需要高亮的关键字
        const keywordIndex = article.indexOf(keyword)
        if (keyword && keywordIndex !== -1 && (article.length - 1) >= 400) {
            let start:number =  keywordIndex - (strLength/2)
            let end:number = keywordIndex + (strLength/2)
            // 谁触底就以谁为标准
            if(start < 0){
                start = 0
                end = start + strLength
            }
            if(end > (article.length - 1)){
                end = article.length - 1
                start = end - strLength
            }
            return article.slice(start,end) + '......'
        }else {
            return article.slice(0,strLength) + '......'
        }
    }

    private onPageChange = (page:number,pageSize?:number):void=>{
        this.onGetPage(pageSize as number,page,{keyword:this.state.keyword})
    }

    private getMyList = ():ReactNode => {
        let {articleList,keyword} = this.state
        let Articles:Array<ReactNode> = articleList.map((item:EntityArticle) => (
            <MyListItem
                key={item.id}
                link={`/article/${item.id}`}
                title={<strong><Highlighter
                    searchWords={[keyword]}
                    autoEscape={true}
                    highlightStyle={{backgroundColor: 'yellow'}}
                    textToHighlight={item.title}
                /></strong>}
                description={`发布时间：${item.createdDate}\t\t${item.createdDate === item.lastModifiedDate ? '' : `最后更新时间：${item.lastModifiedDate}`}`}
                content={<Highlighter
                    searchWords={[keyword]}
                    autoEscape={true}
                    highlightStyle={{backgroundColor: 'yellow'}}
                    textToHighlight={marked(this.getContent(item.content)).replace(/<[^>]+>/g, "")}
                />}
            />
        ))
        let MyList:ReactNode = <QueueAnim
            type={['right','left']}
            duration={[300,0]}
        >
            {Articles}
        </QueueAnim>
        return MyList
    }

    componentWillMount=(): void=>{
        this.initRequest()
    }

    componentWillReceiveProps=(nextProps: Readonly<ArticleListProps>, nextContext: any): void =>{
        let params:URLSearchParams = new URLSearchParams(nextProps.location.search)
        let keyword:string = params.get('keyword')?params.get('keyword') as string:''
        // 搜索关键字改变或浏览器地址改变，将所有状态初始化
        if((keyword && keyword !== this.state.keyword) || (nextProps.location.pathname !== this.props.location.pathname)){
            this.initState(nextProps)
            this.initRequest()
        }
    }

    render = ():ReactNode=>{
        const {keyword,loading,hasMore,total,page,pageSize} = this.state
        const {infinite} = this.props

        const myList:ReactNode = this.getMyList()
        let infiniteList = (
            <InfiniteScroll
                initialLoad={false}
                pageStart={1}
                loadMore={this.handleInfiniteOnLoad.bind(this)}
                hasMore={!loading && hasMore}
                useWindow={false}
                getScrollParent={() => (document.getElementById("myScroll") as HTMLElement).children[0] as HTMLElement }
            >
                {myList}
                {infinite && loading && hasMore && (
                    <div className={style.loading_container}>
                        <Spin/>
                    </div>
                )}
                {infinite && !hasMore && (
                    <Divider>已经到底了</Divider>
                )}
            </InfiniteScroll>
        )

        let pagination = <Pagination
            style={{marginTop: '10px',marginBottom:'50px'}}
            total={total}
            defaultPageSize={10}
            pageSize={pageSize}
            pageSizeOptions={['10', '20', '30', '40']}
            current={page}
            onShowSizeChange={(current, size) => {
                this.onGetPage(size, current, {keyword:keyword})
            }}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
            onChange={this.onPageChange}
        />

        return (
            <div>
                {infinite ? infiniteList : myList}
                {infinite ? null : pagination}
            </div>
        );
    }
}

export default withRouter(ArticleList)