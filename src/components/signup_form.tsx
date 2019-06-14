import React, {FormEvent} from 'react';
import {Button, Input, Form,Row, Col ,message} from 'antd'
import {checkSignupInfo, signup,codeUrl} from "../api/auth";
import QueueAnim from "rc-queue-anim";
import {FormComponentProps} from "antd/lib/form";

interface SignupFormProps{
    signupSuccess:(signupInf:SignupInf)=>any
}

interface SignupFormState {
    confirmDirty:boolean,
    message:string,
    loading:boolean,
    codeUrl:string
}

class SignupForm extends React.Component<SignupFormProps & FormComponentProps<any>,SignupFormState>{
    public state:SignupFormState = {
        confirmDirty: false,
        message:'',
        loading:false,
        codeUrl:codeUrl
    }

    private handleSubmit = (e:FormEvent):void=> {

        e.preventDefault();

        this.props.form.validateFieldsAndScroll((err, values:SignupInf) => {

            if (!err) {

                this.setState({loading:true})
                signup(values).then(res=>{

                    if(res.success){
                        message.success(res.message)
                        setTimeout(()=>this.props.signupSuccess(values),500)
                        this.setState({message:''})
                    }else{
                        message.error(res.message)
                        this.setState({message:res.message})
                    }
                    this.setState({loading:false})
                })
            }
        });
    }

    /** 刷新验证码 */
    private refreshCode=():void=>{
        let timeStamp = (new Date()).getTime()
        this.setState({
            codeUrl:`${codeUrl}?timeStamp=${timeStamp}`
        })
    }

    private handleConfirmBlur = (e:any) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }

    compareToFirstPassword = (rule:any, value:string, callback:(message?:string)=>any) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次输入的密码不一致');
        } else {
            callback();
        }
    }

    validateToNextPassword = (rule:any, value:string, callback:(message?:string)=>any) => {

        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        if(value.length<6 || value.length>20){
            callback('密码长度必须为6-20位')
        }else{
            callback();
        }
    }

    checkUsernameExist = (rule:any, value:string, callback:(message?:string)=>any) => {
        if(value){
            checkSignupInfo({username:value}).then(res=>{
                if(!res.success){
                    this.props.form.setFields({
                        username: {
                            value: value,
                            errors: [new Error(res.message)],
                        },
                    });
                }
            })
        }
        if(value.length>20){
            callback('用户名长度不得超过20个字符')
        }else{
            callback()
        }
    }

    checkEmailExist = (rule:any, value:string, callback:(message?:string)=>any) => {
        if(value){
            checkSignupInfo({email:value}).then(
                res=>{
                    if(!res.success){
                        this.props.form.setFields({
                            email:{
                                value:value,
                                errors:[new Error(res.message)],
                            }
                        })
                    }
                }
            )
        }
        callback()
    }

    render() {
        const { getFieldDecorator } = this.props.form;

        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                span:24
            },
        };

        const {message, loading, codeUrl} = this.state
        return (

            <Form {...formItemLayout} onSubmit={this.handleSubmit}>
                <QueueAnim
                    type={['right', 'left']}
                    duration={300}
                    interval={50}
                >
                    <Form.Item
                        key={1}
                        label="E-mail"
                    >
                        {getFieldDecorator('email', {
                            rules: [{
                                type: 'email', message: '请检查邮箱地址格式',
                            }, {
                                required: true, message: '我们需要你的邮箱地址进行注册验证',
                            },
                                {
                                    validator:this.checkEmailExist
                                }
                            ],
                        })(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item
                        key={2}
                        label="密码"
                    >
                        {getFieldDecorator('password', {
                            rules: [{
                                required: true, message: '请输入你的密码',
                            }, {
                                validator: this.validateToNextPassword,
                            }],
                        })(
                            <Input type="password" />
                        )}
                    </Form.Item>
                    <Form.Item
                        key={3}
                        label="验证密码"
                    >
                        {getFieldDecorator('confirm', {
                            rules: [{
                                required: true, message: '请再次输入密码进行验证',
                            }, {
                                validator: this.compareToFirstPassword,
                            }],
                        })(
                            <Input type="password" onBlur={this.handleConfirmBlur} />
                        )}
                    </Form.Item>
                    <Form.Item
                        key={4}
                        label='用户名'
                    >
                        {getFieldDecorator('username', {
                            rules: [{
                                required: true, message: '请输入用户名'
                            }, {
                                validator: this.checkUsernameExist,
                            }],
                        })(
                            <Input />
                        )}
                    </Form.Item>
                    <Form.Item
                        key={5}
                        label="验证码"
                        extra="请输入右侧的验证码"
                    >
                        <Row gutter={8}>
                            <Col span={12}>
                                {getFieldDecorator('code', {
                                    rules: [{ required: true, message: '请输入验证码' }],
                                })(
                                    <Input />
                                )}
                            </Col>
                            <Col span={6}>
                                <img src={codeUrl} alt="刷新" onClick={this.refreshCode}/>
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout} key={6}>
                        <p style={{color:'red'}}>{message}</p>
                        <Button loading={loading} type="primary" htmlType="submit" style={{width:'100%'}}>注册</Button>
                    </Form.Item>
                </QueueAnim>
            </Form>

        );
    }

}

export default Form.create<SignupFormProps & FormComponentProps<any>>({name: 'signup'})(SignupForm)