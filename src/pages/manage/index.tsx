import React from 'react';
import {Col, Icon, Menu, Row} from "antd";
import PrivateRoute from '../../components/private_route'
import ImageList from './pages/image_list'
import {Link,Switch} from 'react-router-dom'
import Carousel from './pages/carousel'
import EditArticle from "./pages/edit_article";
import Charts from './pages/charts'
import QueueAnim from "rc-queue-anim";
import User from './pages/user'
import Comment from './pages/comment'

const { SubMenu } = Menu;

interface IndexProps {

}

interface IndexState {
    menuMode:"inline"|"horizontal"
}

class Index extends React.Component<IndexProps,IndexState>{

    public state:IndexState = {
        menuMode:"inline"
    }

    onWindowResize = ()=>{
        let width = document.body.clientWidth
        if(width<=576 && this.state.menuMode === "inline"){

            this.setState({
                menuMode:"horizontal"
            })
        }else{
            if(width>576 && this.state.menuMode === "horizontal"){
                this.setState({
                    menuMode:"inline"
                })
            }
        }
    }

    getSelectedKey = ()=>{
        const paths = decodeURI(window.location.pathname).split('/')
        return [paths[paths.length - 1]]

    }

    componentWillMount = (): void=> {
        window.addEventListener("resize",this.onWindowResize)
        this.onWindowResize()
    }

    componentWillUnmount(): void {
        window.removeEventListener("resize",this.onWindowResize)
    }

    render = ():JSX.Element => {

        return (
            <Row>
                <QueueAnim
                    type={['left', 'right']}
                    duration={700}
                >
                    <Col lg={3} md={6} sm={6} xs={24} key={1}>

                        <Menu
                            mode={this.state.menuMode}
                            selectedKeys={this.getSelectedKey()}
                            style={{ height: '100%', borderRight: 0 }}
                        >
                            <Menu.Item key="manage">
                                <Link to={`/admin/manage`}>
                                    <Icon type="pie-chart" />
                                    <span>统计信息</span>
                                </Link>
                            </Menu.Item>
                            <Menu.Item key="edit">
                                <Link to={`/admin/manage/edit`}>
                                    <Icon type="edit" />
                                    <span>编辑文章</span>
                                </Link>
                            </Menu.Item>
                            <SubMenu
                                key="manage1"
                                title={<span>
									<Icon type="desktop" />
									<span>管理</span>
								</span>
                                }
                            >
                                <Menu.Item key="user">
                                    <Link to={`/admin/manage/user`}>
                                        <Icon type="user" />
                                        <span>用户</span>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key="image">
                                    <Link to={`/admin/manage/manage/image`}>
                                        <Icon type="picture" />
                                        <span>图片</span>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key='interface'>
                                    <Link to={`/admin/manage/interface`}>
                                        <Icon type='notification'/>
                                        <span>轮播图</span>
                                    </Link>
                                </Menu.Item>
                                <Menu.Item key='comment'>
                                    <Link to={`/admin/manage/comment`}>
                                        <Icon type='message'/>
                                        <span>评论</span>
                                    </Link>
                                </Menu.Item>
                            </SubMenu>
                        </Menu>
                    </Col>
                </QueueAnim>
                <QueueAnim
                    type={['right', 'left']}
                    duration={700}
                >
                    <Col lg={21} md={18} sm={6} xs={24} key={2}>
                        <Switch>
                            <PrivateRoute exact={true} path={'/admin/manage/interface'} component={Carousel}/>
                            <PrivateRoute exact={true} path={'/admin/manage/edit'} component={EditArticle}/>
                            <PrivateRoute exact={true} path={'/admin/manage/manage/image'} component={ImageList}/>
                            <PrivateRoute exact={true} path={'/admin/manage/user'} component={User}/>
                            <PrivateRoute exact={true} path={'/admin/manage/comment'} component={Comment}/>
                            <PrivateRoute exact={true} path={'/admin/manage'} component={Charts}/>
                        </Switch>
                        {/*路由嵌套时需保证父级路由的exact为false*/}
                    </Col>
                </QueueAnim>
            </Row>
        )
    }
}

export default Index