import React from 'react';
import {Card, Icon, Avatar, Modal, Input, message, Row, Col, Button, Tag, Popconfirm, Pagination, Tabs} from "antd";
import style from "../components/style.module.less";
import {connect} from 'react-redux'
import UploadImage from '../components/upload_image'
import MyComment from '../components/my_comment'
import {editUserInfo,getUserInfo} from '../api/user'
import {sendVerifyEmail} from "../api/auth";
import {withRouter, Link, RouteComponentProps} from 'react-router-dom'
import {getMailHost} from "../utils";
import {getCommentList,readMessage} from "../api/comment";
import {updateAvatarUrlAction} from "../actions";
import QueueAnim from "rc-queue-anim";
import {Dispatch} from "redux";

const TabPane = Tabs.TabPane;
const Meta = Card.Meta

interface ReduxState {
    user:EntityUser
}

interface ReduxDispatch {
    onUploadSuccess:(url:string) => any
}

interface UserDetailPageProps extends RouteComponentProps<any>{
    pageSize?:number
}

type UserDetailPagePropsWithRedux = ReduxState & ReduxDispatch & UserDetailPageProps

interface UserDetailPageState {
    modalVisible:boolean,
    editUsername:boolean,
    editEmail:boolean,
    username?:string,
    email?:string,
    targetId:number,
    targetInfo:EntityUser,
    loading:boolean,
    commentList:EntityComment[],
    pageSize:number,
    totalElements:number,
    page:number,
    commentList1:EntityComment[],
    totalElements1:number,
    page1:number,
    pageSize1:number,
}

class UserDetailPage extends React.Component<UserDetailPagePropsWithRedux,UserDetailPageState>{

    public defaultProps:Partial<UserDetailPagePropsWithRedux> = {
        pageSize:7,
    }

    public state:UserDetailPageState = {
        modalVisible:false,
        editUsername:false,
        editEmail:false,
        username:this.props.user.username,
        email:this.props.user.email,
        targetId:this.props.match.params.id?this.props.match.params.id:this.props.user.id,
        targetInfo:{},
        loading:false,
        commentList:[],
        pageSize:this.props.pageSize as number,
        totalElements:0,
        page:1,
        commentList1:[],
        totalElements1:0,
        page1:1,
        pageSize1:this.props.pageSize as number
    }

    componentWillMount():void {
        const {targetId}  = this.state
        if(this.state.targetId){
            if (targetId && (targetId !== this.props.user.id)){
                // 查看本人的详细信息
                getUserInfo(targetId).then(
                    res=> {this.setState({
                        targetInfo:res.data
                    })
                    }
                )
                // 将未读回复标记为已读
                readMessage().then(res=>{
                    if(!res.success){
                        message.error(res.message)
                    }
                })
            }
            this.getComments({page:1}).then(res=>{

                this.setState({
                    commentList:res.data.content,
                    totalElements:res.data.totalElements
                })
            })

            this.getComments({page:1,reply:true}).then(res=>{

                this.setState({
                    commentList1:res.data.content,
                    totalElements1:res.data.totalElements
                })
            })
        }}

    componentWillReceiveProps(nextProps: Readonly<UserDetailPagePropsWithRedux>, nextContext: any): void {
        const {username, targetId} = this.state

        if(nextProps.user && !username){
            this.setState({
                username:nextProps.user.username
            })
        }

        if(nextProps.user !== this.props.user && !targetId){
            this.setState({
                targetId:nextProps.user.id as number,
                targetInfo:nextProps.user
            })
            this.getComments({userId:nextProps.user.id as number}).then(res=>{
                this.setState({
                    commentList:res.data.content,
                    totalElements:res.data.totalElements
                })
            })
        }else{
            // 将未读回复标记为已读
            readMessage().then(res=>{
                if(!res.success){
                    message.error(res.message)
                }
            })
        }
    }

    private getComments = (options:CommentListOption) => {
        return getCommentList({userId:this.state.targetId, pageSize:this.state.pageSize,...options})
    }

    private onPageChange = (page:number) => {
        this.getComments({page}).then(res=>{
            if(res.success){
                this.setState({
                    totalElements:res.data.totalElements,
                    commentList:res.data.content,
                    page
                })
            }else{
                message.error(res.message)
            }
        })
    }

    private onShowSizeChange = (curr:number,size:number):void =>{
        this.getComments({page:curr,pageSize:size}).then(res=>{
            if(res.success){
                this.setState({
                    totalElements:res.data.totalElements,
                    commentList:res.data.content,
                    page:curr
                })
            }else{
                message.error(res.message)
            }
        })
    }


    private onPageChange1 = (page:number):void => {
        this.getComments({page:page,reply:true}).then(res=>{
            if(res.success){
                this.setState({
                    totalElements1:res.data.totalElements,
                    commentList1:res.data.content,
                    page1:page
                })
            }else{
                message.error(res.message)
            }
        })

    }

    onShowSizeChange1 = (curr:number,size:number):void => {
        this.getComments({page:curr,pageSize:size,reply:true}).then(res=>{
            if(res.success){
                this.setState({
                    totalElements1:res.data.totalElements,
                    commentList1:res.data.content,
                    page1:curr
                })
            }else{
                message.error(res.message)
            }
        })
    }

    private showModal = () => this.setState({modalVisible:true})

    private saveUsername = ():void => {

        if(this.state.username !== this.props.user.username){
            // 确定用户名发生了改变
            editUserInfo({username:this.state.username}).then(res=>{
                if(res.success){
                    this.setState({
                        editUsername:false
                    })
                    message.success("用户名修改成功，请重新登录")
                    this.props.history.push("/login")
                }else{
                    message.error(res.message)
                }
            })

        }else{
            this.setState({
                editUsername:false
            })
        }
    }

    private onSendEmail = ():void => {
        this.setState({
            loading:true
        })
        sendVerifyEmail().then(res=>{
            if(res.success){
                this.setState({
                    loading:false
                })
                message.success(res.message)
            }else{
                message.error(res.message)
            }
        })
    }
    private getTargetCards = ():JSX.Element|null =>{
        const {email,id,verified} = this.props.user
        const {loading,commentList,commentList1,totalElements,totalElements1,page,pageSize,page1,pageSize1,targetId,targetInfo} = this.state
        const mailHost = email?getMailHost(email):""
        const verifyEmailBox = verified || id !== targetId?null:(
            <QueueAnim
                type={['bottom', 'left']}
                duration={300}
            >
                <Card type={'inner'} key={1}>
                    您的邮箱&emsp;{email}&emsp;尚未验证<br/>
                    验证后可以进行评论&emsp;&emsp;&emsp;&emsp;<a href={`https://${mailHost}`} target={'_blank'}>打开邮箱>>>></a><br/>
                    <Button onClick={this.onSendEmail} loading={loading}>重新发送验证邮件</Button>
                </Card></QueueAnim>
        )
        let comments = commentList.map((v,i)=>{
            return <Card title={<Link to={`/article/${v.articleId}`}>{v.articleTitle}</Link>}
                         key = {i}
                         type={"inner"} >
                <MyComment
                    comment = {v}
                />
            </Card>
        })


        let replys = commentList1.map(v=>{
            return <Card title={<Link to={`/article/${v.articleId}`}>{v.articleTitle}</Link>}
                         key = {v.id}
                         type={"inner"} >
                <MyComment
                    comment = {v}
                />
            </Card>
        })

        const commentsTab =  <TabPane tab="历史评论" key="1">
            <QueueAnim
                type={['bottom', 'top']}
                duration={300}
                interval={100}
            >
                {comments}
            </QueueAnim>
            <Pagination
                style={{marginTop:'20px'}}
                size="small"
                total={totalElements}
                showSizeChanger
                showQuickJumper
                onChange={this.onPageChange}
                onShowSizeChange={this.onShowSizeChange}
                pageSize={pageSize}
                current={page}
                hideOnSinglePage={true}
                pageSizeOptions={['7','10','20','50']}
                defaultCurrent={1}
                showTotal={(total, range) => `第${range[0]}-${range[1]}条  共${total}条`}
            />
        </TabPane>

        const replysTab = <TabPane tab="回复我的" key="2">
            {replys}
            <Pagination
                style={{marginTop:'20px'}}
                size="small"
                total={totalElements1}
                showSizeChanger
                showQuickJumper
                onChange={this.onPageChange1}
                onShowSizeChange={this.onShowSizeChange1}
                pageSize={pageSize1}
                current={page1}
                hideOnSinglePage={true}
                pageSizeOptions={['7','10','20','50']}
                defaultCurrent={1}
                showTotal={(total, range) => `第${range[0]}-${range[1]}条  共${total}条`}
            />
        </TabPane>
        return <Card bordered={false}>
            {verifyEmailBox}
            <Tabs defaultActiveKey="2" >
                {commentsTab}
                {targetId==id?replysTab:null}
            </Tabs>
        </Card>

    }

    getSelfCards = ():JSX.Element|null=>{
        const {email, verified, avatar} = this.props.user
        const {editUsername,username,modalVisible } = this.state
        const avatarOptions = {
            onClick:this.showModal,
            size:45,
            className:style.avatar,
        }
        const myAvatar = avatar?<Avatar  {...avatarOptions} src={avatar}/>:<Avatar  {...avatarOptions} icon={'user'}/>
        const title =editUsername?(
            <div>
                <Input style={{width:'120px'}} value={username} onChange={(e)=>this.setState({username:e.target.value})} size={"small"}/>
                <Popconfirm placement="bottomRight" title={"确定修改吗？\n修改后将会注销当前登录状态"} onConfirm={this.saveUsername} onCancel={()=>this.setState({editUsername:false})} okText="确定" cancelText="取消">
                    <Icon style={{cursor:'pointer',paddingLeft:'20px'}} type={'save'}/>
                </Popconfirm>
            </div>
        ):(
            <div>
                <label>{this.props.user.username}</label>
                {/*<Icon type={'edit'} onClick = {()=>this.setState({editUsername:true})} style={{cursor:'pointer',paddingLeft:'20px'}}/>*/}
            </div>
        )
        const description = verified?
            (<div>{email}<Tag style={{marginLeft:'10px'}} color="green">已验证</Tag></div>):
            (<div>{email}<Tag style={{marginLeft:'10px'}}>待验证</Tag></div>)

        return !this.props.user.id?null:(<div>
            <Card
                style={{ width: '100%', marginTop: 16 ,float:"right"}}
                actions={[<Icon type="edit" onClick={()=>this.setState({editUsername:true})} />]}
            >
                <Meta
                    avatar={myAvatar}
                    title={title}
                    description={description}/>
            </Card>

            <Modal
                title="上传头像"
                visible={modalVisible}
                okButtonProps={{hidden:true}}
                footer={null}
                onCancel={()=>{this.setState({ modalVisible:false })}}
            >
                <UploadImage modalVisible={modalVisible}
                             onUploadSuccess={this.props.onUploadSuccess}
                />
            </Modal>
        </div>)
    }

    render() {
        return (
            <Row>
                <Col lg={19} md={15} xs={24} key={'1'}>
                    {this.getTargetCards()}
                </Col>
                <QueueAnim
                    type={['right', 'left']}
                    duration={700}
                >
                    <Col lg={5}  md={9} xs={0} key={'2'}>
                        {this.getSelfCards()}
                    </Col>
                </QueueAnim>
            </Row>
        );
    }

}

const mapStateToProps = (state:any):ReduxState => {
    return {user:state.auth.user}
}

const mapDispatchToProps = (dispatch:Dispatch):ReduxDispatch => {
    return {
        onUploadSuccess:(url:string) => updateAvatarUrlAction(dispatch,url)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(withRouter(UserDetailPage))



