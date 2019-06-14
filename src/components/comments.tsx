import React from 'react'
import { getCommentList} from "../api/comment";
import { message} from "antd";
import {connect} from "react-redux";
import MyTextArea from './my_text_area'
import MyComment from './my_comment'
import QueueAnim from 'rc-queue-anim';

const buildComments = (commentList:EntityComment[]):JSX.Element[] => {
    let comments:JSX.Element[] = []
    commentList.forEach((comment) => {
        if (comment.targetId === -1) {
            let children:JSX.Element[] = []
            commentList.forEach(v => {
                if (v.floor === comment.floor && v.insideFloor !== -1) {
                    children.push(
                        <MyComment
                            comment={v}
                            key={v.id}
                        />
                    )
                }
            })

            comments.push(
                <MyComment
                    comment={comment}
                    key={comment.id}
                    children={children}
                />
            )

        }
    })
    return comments
}

interface CommentsReduxState {
    user:EntityUser,
    commentList:EntityComment[]
}

interface CommentsProps extends CommentsReduxState{
    articleId:number
}

interface CommentsState{
    commentList:EntityComment[]
}

class Comments extends React.Component<CommentsProps,CommentsState>{
    public state:CommentsState = {
        commentList:[]
    }

    componentWillMount(): void {
        const {articleId} = this.props
        getCommentList({articleId}).then(res => {
            if (res.success) {
                this.setState({
                    commentList: res.data
                })
            } else {
                message.error(res.message)
            }
        })
    }

    componentWillReceiveProps(nextProps: Readonly<CommentsProps>, nextContext: any): void {
        if (nextProps.commentList !== this.props.commentList) {
            this.setState({
                commentList: nextProps.commentList
            })
        }
    }

    render(): JSX.Element{
        const comments = buildComments(this.state.commentList)
        return (
            <div>
                <QueueAnim
                    type={['right', 'left']}
                    duration={700}
                    interval={200}
                >
                    {comments}

                    <MyTextArea
                        key={'99999'}
                        articleId={this.props.articleId}
                        floor={-1}
                        targetId={-1}
                        targetUserId={-1}
                        targetFloor={-1}
                    />
                </QueueAnim>
            </div>
        )
    }

}

const mapStateToProps = (state:any):CommentsReduxState=>{
    return {
        user:state.auth.user,
        commentList:state.comment.commentList
    }
}

export default connect(mapStateToProps)(Comments)

