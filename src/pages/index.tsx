import {Redirect, Link, Route, Switch, RouteComponentProps} from "react-router-dom";
import { Layout, Menu, Input, Row, Col, Divider, message,Avatar,Dropdown,Badge } from "antd";
import React from 'react';
import QueueAnim from "rc-queue-anim";
import { connect } from 'react-redux'
import {getClassificationNameList} from "../api/classification";
import {getMessageCount} from "../api/comment";
import {logoutAction} from "../actions";
import Loading from '../components/loading'
import Loadable from 'react-loadable';
import ArticleList from "../components/article_list";
import PrivateRoute from '../components/private_route'
import style from './style.module.less'
import {Dispatch} from "redux";

const { Search } = Input;
const { Header, Content } = Layout;

const MyLoadingComponent = ({isLoading,error }:any) => {
    // Handle the loading state
    if (isLoading) {
        return <Loading/>
    }
    // Handle the error state
    else if (error) {
        return <div>Sorry, there was a problem loading the page.</div>;
    }
    else {
        return null;
    }
};

// 懒加载
const LoginPage = Loadable({
    loader: () => import('./login'),
    loading: MyLoadingComponent
});

const AdminManagePage = Loadable({
    loader: ()=> import('./manage/index'),
    loading:MyLoadingComponent
})

const UserDetailPage = Loadable({
    loader:()=>import('./manage/pages/user'),
    loading:MyLoadingComponent

})

const ArticlePage = Loadable({
    loader:()=>import('./article'),
    loading:MyLoadingComponent

})

const HomePage = Loadable({
    loader:()=>import('./home'),
    loading:MyLoadingComponent
})

interface ReduxState {
    user:EntityUser
}

interface ReduxDispatch {
    onLogout:()=>any
}


type IndexProps = ReduxState & ReduxDispatch & RouteComponentProps<any>

interface IndexState {
    selectedKey: string,
    pathname: null|string,
    classificationList:EntityClassification[],
    messageCount:number
}

class Index extends React.Component<IndexProps,IndexState>{

    public state:IndexState = {
        selectedKey: '',
        pathname: null,
        classificationList:[],
        messageCount:0
    }

    private updatePath = ()=>{
        const paths = decodeURI(window.location.pathname).split('/')
        let selectedKey = paths[1]
        if(selectedKey === 'list'){
            selectedKey = `list/${paths[2]}`
        }

        if (this.state.selectedKey !== selectedKey) {
            this.setState({
                selectedKey,
                pathname:selectedKey
            })
        }
    }

    onLogout = ()=>{
        this.props.onLogout().then((res:any)=>{
            if(res.success){
                message.success(res.message)
            }else{
                message.error(res.message)
            }
            window.history.go(0)    // 刷新页面
        })
    }

    private goSearchPage = (v:string|null) => {
        if (v !== '' && v !== null) {
            this.props.history.push(`/search?keyword=${v}`)
        }
    }

    private goUserDetailPage = ()=>{
        this.props.history.push('/userDetail')
    }


    private getMessageCount = ()=>{
        if(this.props.user.id){
            getMessageCount().then(res=>{
                if(res.success){
                    if(res.data !== this.state.messageCount){
                        this.setState({
                            messageCount:res.data
                        })
                    }
                }else{
                    message.error(res.message)
                }
            })
        }
    }


    componentWillUpdate(nextProps: Readonly<IndexProps>, nextState: Readonly<IndexState>, nextContext: any): void {
        this.updatePath()
        this.getMessageCount()
    }


    componentWillMount(): void {
        getClassificationNameList().then(res=>{
            if(res.success){
                this.setState({
                    classificationList:res.data
                })
            }
        })
        this.getMessageCount()
        this.updatePath()
    }

    render() {

        const classifications = this.state.classificationList.map(v=>{
            return <Menu.Item key={`list/${v.classificationName}`}><Link to={{pathname:`/list/${v.classificationName}`,search:`?id=${v.id}`}}>{v.classificationName}</Link></Menu.Item>
        })
        const Login = <Link to={'/login'} style={{position:'absolute',right:'20px',top:'0'}} >登录</Link>
        let user = this.props.user?this.props.user:{}

        let avatar = <div onClick = {this.goUserDetailPage}>{user.avatar?<Avatar size={45}  src={user.avatar}/>:<Avatar size={45}  icon={'user'}/>}</div>

        avatar = <Badge count={this.state.messageCount} className={style.avatar}>{avatar}</Badge>
        const menu = (
            <Menu>
                <Menu.Item>
                    <Link to={'/userDetail'}>账户</Link>
                </Menu.Item>
                <Menu.Item style={{display:this.state.messageCount===0?"none":"inline-block"}}>
                    <Link to={'/userDetail'}>回复我的<span style={{color:'red'}}>({this.state.messageCount})</span></Link>
                </Menu.Item>
                <Menu.Item>
                    <button className={style.logoutButton} onClick={this.onLogout}>注销</button>
                </Menu.Item>
            </Menu>
        )

        const dropDown = (
            <Dropdown overlay={menu} className={style.avatar}>
                {avatar}
            </Dropdown>
        )



        return (
            <Layout>
                <Header className={style.router_header}>
                    <Row align={"middle"}>
                        {/*<div className="logo"/>*/}
                        <Col xxl={4} md={2} sm={0}/>
                        <Col xxl={4} md={6} sm={0}>
                            <Search
                                placeholder="input search text"
                                onSearch={this.goSearchPage.bind(this)}
                                className={style.search_box}
                            />

                        </Col>
                        {/*<Col xxl={8} md={8} sm={0}/>*/}

                        <Col xxl={16} md={16} sm={24} key={1}>
                            <QueueAnim
                                type={['top', 'bottom']}
                                duration={800}
                                delay={300}
                            >
                                <Menu
                                    key={1}
                                    theme="light"
                                    mode="horizontal"
                                    style={{lineHeight: '62px'}}
                                    selectedKeys={[this.state.selectedKey]}
                                >
                                    <Menu.Item key={'home'}><Link to="/home" >首页</Link></Menu.Item>
                                    {classifications}
                                    <Menu.Item key={'admin'}><Link to="/admin/manage"  hidden={this.props.user.userType !== 'ADMIN'}>管理</Link></Menu.Item>
                                </Menu>
                            </QueueAnim>
                        </Col>

                        {user.username?dropDown:Login}
                    </Row>
                    <Divider style={{margin:0,zIndex:2}}/>
                </Header>

                <Content className={style.router_content}>

                    <Switch
                    >
                        <Route

                            exact
                            path="/"
                            render={() => <Redirect to="/home" />}
                        />
                        <Route

                            exact
                            path="/index.html"
                            render={() => <Redirect to="/home" />}
                        />
                        <Route  path={'/home'} exact={true} component={HomePage}/>
                        <PrivateRoute path={ '/admin/manage'} exact={false} component={AdminManagePage}/>
                        <Route  path={'/list/:classificationName'} exact={true} component={ArticleList}/>
                        <Route  path={'/article/:id'} exact={true} component={ArticlePage}/>
                        <Route  path={'/search'} exact={true} component={ArticleList}/>
                        <Route  path={'/login'} exact={true} component={LoginPage}/>
                        <Route  path={'/userDetail/:id?'} exact={true} component={UserDetailPage}/>
                    </Switch>
                </Content>
            </Layout>
        );
    }
}

const mapStateToProps=(state:any):ReduxState=>{
    return {
        user:state.auth.user
    }
}

const mapDispatchToProps=(dispatch:Dispatch):ReduxDispatch=>{
    return {
        onLogout:()=> logoutAction(dispatch)
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Index)