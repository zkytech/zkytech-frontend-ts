import React from 'react'
import {RouteComponentProps, withRouter} from "react-router";
import {addComment} from "../api/comment";
import {Button, message,Form,Input} from "antd";
import {Dispatch} from "redux";
import {getCommentListAction} from "../actions";
import {connect} from "react-redux";

const {TextArea} = Input

interface MyTextAreaReduxDispatch {onSubmitSuccess:(articleId:number)=>Promise<MyApiResponse>}

interface MyTextAreaReduxState {user:EntityUser}

interface MyTextAreaProps extends RouteComponentProps<any> {
    articleId: number,
    floor: number,
    onSubmit?: () => any,
    targetFloor: number,
    targetId: number,
    targetUserId: number,
    id?:string
}

type MyTextAreaPropsWithRedux = MyTextAreaReduxDispatch & MyTextAreaReduxState & MyTextAreaProps

interface MyTextAreaState {comment: string,submitLoading: boolean}

class MyTextArea extends React.Component<MyTextAreaPropsWithRedux, MyTextAreaState> {

    public state: MyTextAreaState = {comment: '', submitLoading: false}

    private submitComment = ():void => {
        if (!this.state.submitLoading) {
            this.setState({
                submitLoading: true
            })
            // 提交评论
            addComment({
                content: this.state.comment,
                articleId: this.props.articleId,
                targetId: this.props.targetId,
                floor: this.props.floor,
                targetFloor: this.props.targetFloor,
                targetUserId: this.props.targetUserId
            }).then(res => {
                this.setState({
                    submitLoading: false
                })
                if (res.success) {
                    this.props.onSubmitSuccess(this.props.articleId)
                    this.setState({
                        comment: ''
                    })
                    message.success(res.message)
                    if (this.props.onSubmit) {
                        // 处理回调
                        this.props.onSubmit()
                    }
                } else {
                    message.error(res.message)
                }
            })
        }
    }

    private goLoginPage = ():void => this.props.history.push(`/login`)

    private verifyEmail = ():void => this.props.history.push(`/userDetail/${this.props.user.id}`)

    public render = ():JSX.Element=>{
        const {verified} = this.props.user
        let button:JSX.Element
        if(typeof verified === "undefined"){
            // 用户未登录
            button = <Button type={'primary'} onClick={this.goLoginPage}>登录</Button>
        }else{
            if (verified === false){
                //  邮箱未验证
                button = <div>
                    <p>验证邮箱后即可进行评论</p>
                    <Button type={'primary'} onClick={this.verifyEmail}>立即验证邮箱</Button>
                </div>
            } else {
                button = <Button type={"primary"} onClick={this.submitComment}>确定</Button>
            }
        }

        return (
            <div id={this.props.id}>
                <Form.Item>
                    <TextArea
                        disabled={!verified}
                        autosize={false}
                        style={{
                            height: '200px',
                            resize: "none"
                        }}
                        value={this.state.comment}
                        onChange={e => this.setState({comment: e.target.value})}
                    />
                </Form.Item>
                <Form.Item>
                    {button}
                </Form.Item>
            </div>
        )
    }

}

const mapDispatchToPropsMyTextArea = (dispatch:Dispatch):MyTextAreaReduxDispatch => {
    return {onSubmitSuccess:(articleId:number) => getCommentListAction(dispatch,{articleId})}
}

const mapStateToPropsMyTextArea = (state:any):MyTextAreaReduxState => {
    return {user:state.auth.user}
}

export default connect(mapStateToPropsMyTextArea,mapDispatchToPropsMyTextArea)(withRouter(MyTextArea))