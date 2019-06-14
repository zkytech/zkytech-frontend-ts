import React from 'react';
import {Row,Col,Tabs,Icon,notification,Button } from 'antd'
import SignupForm from '../components/signup_form'
import LoginForm from '../components/login_form'
import {RouteComponentProps, withRouter} from 'react-router-dom'
import {getMailHost} from '../utils'
import QueueAnim from "rc-queue-anim";

const TabPane = Tabs.TabPane

interface LoginPageProps extends RouteComponentProps{}

interface LoginPageState {
    activateKey:string
}

class LoginPage extends React.Component<LoginPageProps,LoginPageState>{

    public state:LoginPageState = {
        activateKey:'1'
    }

    /**
     * 注册成功后转到登录页
     * @param userInf
     */
    private signupSuccess=(userInf:EntityUser)=>{
        this.setState({
            activateKey:'1'
        })
        const key:string = `open${Date.now()}`;
        const btn = (
            <Button type="primary" size="small" onClick={() =>{ window.open(`https://${getMailHost(userInf.email?userInf.email:'')}`);notification.close(key)}}>
                验证邮箱
            </Button>
        );
        notification.open({
            message: '注册成功！',
            description: '刚刚我们向您的邮箱发送了一封验证邮件，点击下方按钮进入邮箱验证',
            btn,
            key
        });
    }

    /**
     * 登陆成功后跳转到首页
     */
    private loginSuccess=()=>{
        let { from } =(typeof this.props.location!== "undefined") && (typeof this.props.location.state !== "undefined")? this.props.location.state:{from:''}
        if(from){
            this.props.history.push(from)
        }else{
            this.props.history.goBack()
        }

    }

    private handleChange=(activateKey:string)=>{
        this.setState({
            activateKey
        })
    }


    public render = ():JSX.Element => {
        return (
            <Row style={{marginTop:'50px'}}>
                <Col xs={0} md={6} lg={9}/>
                <Col xs={24} md={12} lg={6}>
                    <QueueAnim
                        type={['right', 'left']}
                        duration={100}
                    >
                        <Tabs activeKey={this.state.activateKey} onChange={this.handleChange} key={1}>
                            <TabPane tab={<span><Icon type="user" />登录</span>} key="1">
                                <LoginForm loginSuccess={this.loginSuccess}/>
                            </TabPane>
                            <TabPane tab={<span><Icon type="solution" />注册</span>} key="2">
                                <SignupForm signupSuccess={this.signupSuccess}/>
                            </TabPane>
                        </Tabs>
                    </QueueAnim>
                </Col>
                <Col xs={0} md={6} lg={9}/>
            </Row>
        );
    }

}

export default withRouter(LoginPage);

