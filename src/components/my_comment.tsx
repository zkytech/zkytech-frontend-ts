import React from 'react'
import {RouteComponentProps, withRouter} from "react-router";
import { vote} from "../api/comment";
import {Avatar, Icon, message,Comment} from "antd";
import style from './style.module.less'
import MyTextArea from './my_text_area'
import {Tooltip} from "antd";


interface MyCommentProps extends RouteComponentProps<any> {
    children?: JSX.Element | JSX.Element[],
    comment: EntityComment
}

interface MyCommentState {
    showTextArea: boolean,
    likes: number,
    dislikes: number,
    action: 'liked' | 'disliked' | null
}

class MyComment extends React.Component<MyCommentProps, MyCommentState> {

    public state: MyCommentState = {
        showTextArea: false,
        likes: this.props.comment.upvote,
        dislikes: this.props.comment.downvote,
        action: null
    }

    private showTextArea = (): void => this.setState({showTextArea: true})

    private hideTextArea = (): void => this.setState({showTextArea: false})

    private switchTextAreaVisible = (): void => this.setState({showTextArea: !this.state.showTextArea})

    private mapVoteToState = (voteAction: 'up' | 'down' | 'deleteUp' | 'deleteDown' | 'upToDown' | 'downToUp'): void => {
        let {likes, dislikes, action} = this.state
        switch (voteAction) {
            case 'up':
                action = 'liked';
                likes += 1;
                break
            case 'down':
                action = 'disliked';
                dislikes += 1;
                break
            case 'deleteUp':
                action = null;
                likes -= 1;
                break
            case 'deleteDown':
                action = null;
                dislikes -= 1;
                break
            case 'upToDown':
                action = 'disliked';
                likes -= 1;
                dislikes += 1;
                break
            case 'downToUp':
                action = 'liked';
                likes += 1;
                dislikes -= 1;
                break
        }
        this.setState({likes, dislikes, action})
    }

    private onVote = (upvote: boolean): void => {
        vote(this.props.comment.id, upvote).then(res => {
            if (res.sucess) {
                this.mapVoteToState(res.data)
            } else {
                message.info(res.message)
            }
        })
    }

    goUserDetailPage = (): void => this.props.history.push(`/userDetail/${this.props.comment.userId}`)

    render = (): JSX.Element => {
        const {id, articleId, userId, targetUsername, floor, insideFloor, targetFloor, content, author, avatar, createdDate} = this.props.comment
        const {showTextArea,likes, dislikes, action} = this.state
        const myTextArea = (
            <div>
                <Icon type={'close'} className={style.close_comment} onClick={this.hideTextArea} />
                <MyTextArea
                    id={`textarea-${id}`}
                    targetUserId={userId}
                    articleId={articleId}
                    targetId={id}
                    floor={floor}
                    onSubmit={this.hideTextArea}
                    targetFloor={insideFloor}
                />
            </div>
        )
        const mycontent = <p>{targetFloor === -1 ? null : `回复 ${targetFloor}#  ${targetUsername}： `}{content}</p>
        const actions = [
            <span>
            <Tooltip title="支持">
              <Icon
                  type="like"
                  theme={action === 'liked' ? 'filled' : 'outlined'}
                  onClick={()=>this.onVote(true)}
              />
            </Tooltip>
            <span style={{paddingLeft: 8, cursor: 'auto'}}>
              {likes}
            </span>
      </span>,
            <span>
            <Tooltip title="反对">
              <Icon
                  type="dislike"
                  theme={action === 'disliked' ? 'filled' : 'outlined'}
                  onClick={()=>this.onVote(false)}
              />
            </Tooltip>
            <span style={{paddingLeft: 8, cursor: 'auto'}}>
              {dislikes}
            </span>
      </span>,
            <span onClick={this.switchTextAreaVisible}>回复</span>
        ]

        return (
            <div className={insideFloor === -1 ? null : style.comment_child}>
                <div className={style.floor_num}>{insideFloor === -1 ? `${floor} 楼` : `${insideFloor}#`}</div>
                <Comment
                    actions={actions}
                    author={author}
                    avatar={avatar ? (
                        <div onClick={this.goUserDetailPage}>
                            <Avatar
                                src={avatar}
                                alt={author}
                            />
                        </div>
                    ) :
                        <div onClick={this.goUserDetailPage}>
                            <Avatar
                                icon={'user'}
                                className={style.comment_avatar}
                            />
                        </div>
                    }
                    content={mycontent}
                    datetime={createdDate}
                >
                    {showTextArea?myTextArea:null}
                    {this.props.children}
                </Comment>
            </div>
        )
    }
}

export default withRouter(MyComment)