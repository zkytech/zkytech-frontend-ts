import React, {FormEvent} from 'react'
import {Button, Form, Icon, Input, message, Checkbox} from "antd";
import {connect} from 'react-redux'
import QueueAnim from "rc-queue-anim";
import {loginAction} from "../actions";
import {codeUrl} from "../api/auth";
import {Dispatch} from "redux";
import {FormComponentProps} from "antd/lib/form";

interface LoginFormReduxState{}

interface LoginFormReduxDispatch{
    onLogin:(authInf:AuthInf) => Promise<MyApiResponse>
}

interface LoginFormProps {
    loginSuccess:()=>any
}

type LoginFormPropsWithRedux = LoginFormProps & LoginFormReduxState & LoginFormReduxDispatch & FormComponentProps<any>

interface LoginFormState{message:string,codeUrl:string,requireCode:boolean,loading:boolean}

class LoginForm extends React.Component<LoginFormPropsWithRedux, LoginFormState>{
    public state = {
        message:'',
        codeUrl,
        requireCode:false,
        loading:false
    }

    handleSubmit = (e:FormEvent) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values:AuthInf) => {
            if (!err) {
                this.setState({
                    loading:true
                })
                this.props.onLogin(values).then(res=>{
                    this.setState({
                        loading:false
                    })
                    if(res.success){
                        message.success(res.message)
                        this.props.loginSuccess()
                    }else{
                        message.error(res.message)
                        this.setState({message:res.message})
                    }
                })
            }
        });
    }

    //TODO:实现多次认证失败后要求输入验证码
    /** 刷新验证码 */
    refreshCode(){
        const timeStamp:number = (new Date()).getTime()
        this.setState({
            codeUrl:`/auth/code?timeStamp=${timeStamp}`
        })
    }

    public render = ():JSX.Element => {
        const {getFieldDecorator} = this.props.form
        const {message,loading} = this.state


        return (
            <Form id={'myLoginForm'} onSubmit={this.handleSubmit}>
                <QueueAnim
                    type={['right', 'left']}
                    duration={300}
                    interval={50}
                >
                    <Form.Item key={'1'}
                    >
                        {getFieldDecorator('username', {
                            rules: [{
                                required: true, message: '请输入用户名或邮箱'
                            }],
                        })(
                            <Input name={'email'} prefix={<Icon type="user" />} placeholder={'用户名/邮箱'}/>
                        )}
                    </Form.Item>

                    <Form.Item key={'2'}
                    >
                        {getFieldDecorator('password', {
                            rules: [{
                                required: true, message: '请输入你的密码',
                            }],
                        })(
                            <Input name={'password'} prefix={<Icon type="lock"/>} type="password" />
                        )}
                    </Form.Item>
                    <Form.Item key={'4'}>
                        <p style={{color:'red'}}>{message}</p>
                        {getFieldDecorator('rememberMe', {
                            valuePropName: 'rememberMe',
                            initialValue: false,
                        })(
                            <Checkbox name={'rememberMe'} style={{display:'block'}}>记住我</Checkbox>
                        )}
                        <Button loading={loading} type="primary" htmlType="submit" style={{width:'100%'}}>登录</Button>
                    </Form.Item>
                </QueueAnim>
            </Form>
        )
    }
}

const mapStateToProps= (state:any):LoginFormReduxState => {
    return {}
}

const mapDispatchToProps = (dispatch:Dispatch):LoginFormReduxDispatch => {
    return {
        onLogin:(authInf:AuthInf) => loginAction(dispatch, authInf)
    }
}

export default connect<LoginFormReduxState,LoginFormReduxDispatch,LoginFormProps,{}>(mapStateToProps,mapDispatchToProps)(Form.create<LoginFormProps & FormComponentProps<any>>({name:'login'})(LoginForm))
