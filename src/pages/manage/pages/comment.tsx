import React from 'react';
import {Avatar, Button, Icon, message, Pagination} from "antd";
import style from "../../style.module.less";
import {Link} from "react-router-dom";
import {getCommentList,deleteComment} from "../../../api/comment";
import QueueAnim from "rc-queue-anim";

interface MyTableRowProps extends EntityComment{
    onDelete:(commentId:number)=>any
}

const MyTableRow:React.FC<MyTableRowProps> = ({author, id, content, articleId,articleTitle, userId, upvote, downvote,avatar,onDelete}) => {
    return <div className={style.comment_table_tr}>
        <div><Link to={`/userDetail/${userId}`}><Avatar size={'small'} src={avatar}/>{author}</Link></div>
        <div>{content}</div>
        <div><Link to={`/article/${articleId}`}>{articleTitle}</Link></div>
        <div><Icon type="like"/>{upvote}</div>
        <div><Icon type="dislike"/>{downvote}</div>
        <div><Button type={'danger'} onClick={()=>onDelete(id)}>删除</Button></div>
    </div>
}

interface CommentProps {
    page?:number,pageSize?:number
}

interface CommentState {
    page:number,
    pageSize:number,
    commentList:Array<EntityComment>,
    total:number
}

class Comment extends React.Component<CommentProps,CommentState>{
    public state:CommentState ={
        page:this.props.page as number,
        pageSize:this.props.pageSize as number,
        commentList:[],
        total:0
    }

    static defaultProps:Partial<CommentProps> = {
        page:1,pageSize:10
    }

    componentWillMount(): void {
        getCommentList({page:this.state.page,pageSize:this.state.pageSize}).then(res=>{
            if(res.success){
                this.setState({
                    commentList:res.data.content,
                    total:res.data.totalElements
                })
            }else{
                message.error(res.message)
            }
        })
    }

    private getList = (page:number,pageSize?:number): void => {
        if (!pageSize) return
        getCommentList({page,pageSize}).then(res=>{
            if(res.success){
                this.setState({
                    commentList:res.data.content,
                    total:res.data.totalElements,
                    page,
                    pageSize
                })
            }else{
                message.error(res.message)
            }
        })
    }

    private onDelete = (id:number)=>{
        deleteComment(id).then(res=>{
            if(res.success){
                message.success(res.message)
                let commentList = this.state.commentList
                commentList = commentList.filter(item => item.id!==id )
                this.setState({
                    commentList
                })

            }else{
                message.error(res.message)
            }
        })
    }

    render() {
        const {page,pageSize, commentList,total} = this.state
        const comments = commentList.map((v,i)=><MyTableRow key={v.id} {...v} onDelete={this.onDelete}/>)
        return (
            <div style={{margin:'50px'}}>

                <QueueAnim
                    type={['right', 'left']}
                    duration={300}
                    interval={100}
                >
                    {comments}
                </QueueAnim>
                <Pagination
                    size="small"
                    total={total}
                    onChange={this.getList}
                    onShowSizeChange={this.getList}
                    current={page}
                    pageSize={pageSize}
                    pageSizeOptions={['10','20','50']}
                    showSizeChanger
                    hideOnSinglePage
                    showQuickJumper />
            </div>
        );
    }

}

export default Comment