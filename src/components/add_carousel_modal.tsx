import React from 'react'
import {Button, Modal, Tooltip, Icon, Input, Form, InputNumber} from 'antd'
import {addCarousel} from "../api/carousel"
import UploadImage from './upload_image'
import {FormComponentProps} from "antd/lib/form";

interface AddCarouselModalProps extends FormComponentProps<any>{
    onSubmit:()=>any,
    onClose:()=>any,
    visible:boolean
}

interface AddCarouselModalState{
    visible:boolean,
    confirmLoading:boolean,
    uploadVisible:boolean
}

class AddCarouselModal extends React.Component<AddCarouselModalProps,AddCarouselModalState>{

    public state:AddCarouselModalState={
        visible: this.props.visible,
        confirmLoading: false,
        uploadVisible:false
    }

    componentWillReceiveProps(nextProps: Readonly<AddCarouselModalProps>, nextContext: any): void {
        if(nextProps.visible !== this.state.visible){
            this.setState({
                visible:nextProps.visible
            })
        }
    }

    onCancel = ()=> {
        this.props.form.resetFields()
        this.props.onClose()
        this.setState({
            visible:false,
            confirmLoading:false
        })
    }

    onSubmit = (e:any)=> {
        e.preventDefault()
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                this.setState({
                    confirmLoading:true
                })
                const {imgUrl,articleId,title} = values
                addCarousel(imgUrl,articleId,title).then((res)=>{
                    this.props.onSubmit()
                    this.onCancel()
                })
            }
        });
    }

    onUploadSuccess = (url:string)=>{
        this.props.form.setFieldsValue({
            imgUrl: url,
        });
    }

// TODO:文章选择和图片选择应该更加人性化，需要添加可视化选择功能
    render() {
        const {visible, confirmLoading} = this.state;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 6},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 18},
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 6,
                    offset: 18
                },
                sm: {
                    span: 24,
                },
            },
        };
        const {getFieldDecorator} = this.props.form;
        return (
            <div>
                <Modal
                    title="上传图片"
                    visible={this.state.uploadVisible}
                    okButtonProps={{hidden:true}}
                    footer={null}
                    onCancel={()=>{this.setState({ uploadVisible:false })}}
                >
                    <UploadImage
                        modalVisible={this.state.uploadVisible}
                        aspectRatio={16/9}
                        quality={0.5}
                        showAvatar={false}
                        onUploadSuccess={this.onUploadSuccess}
                    />
                </Modal>
                <Modal
                    title="添加轮播图"
                    visible={visible}
                    footer={null}
                    confirmLoading={confirmLoading}
                    onCancel={this.onCancel}
                >

                    <Form {...formItemLayout} onSubmit={this.onSubmit}>
                        <Form.Item
                            label={(
                                <span>
              					图片链接&nbsp;
                                    <Tooltip title="显示在首页的图片">
								<Icon type="question-circle-o"/>
                            </Tooltip>
                        </span>
                            )}
                        >
                            {getFieldDecorator('imgUrl', {
                                rules: [{required: true, message: '请输入图片链接！', whitespace: true}],
                            })(
                                <Input/>
                            )}
                        </Form.Item>
                        <Button onClick={()=>this.setState({uploadVisible:true})}>上传</Button>
                        <Form.Item
                            label={(
                                <span>
              					文章ID&nbsp;
                                    <Tooltip title="链接对应的文章的ID（文章页面URL末尾数字）">
								<Icon type="question-circle-o"/>
                            </Tooltip>
                        </span>
                            )}
                        >
                            {getFieldDecorator('articleId', {
                                rules: [{required: true, type: 'integer',message: '请输入文章ID（整数）',whitespace: true}],
                            })(
                                <InputNumber/>
                            )}
                        </Form.Item>
                        <Form.Item
                            label={(
                                <span>
              					标题&nbsp;
                                    <Tooltip title="轮播图上面展示的标题">
								<Icon type="question-circle-o"/>
                            </Tooltip>
                        </span>
                            )}
                        >
                            {getFieldDecorator('title', {
                                rules: [{required: true, message: '请输入展示标题'}, {type: 'string',message:'请输入正确的字符串！'}],
                            })(
                                <Input/>
                            )}
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}><Button type="primary" htmlType="submit" loading={confirmLoading}>确定</Button></Form.Item>
                    </Form>
                </Modal>
            </div>
        );
    }
}

export default Form.create<AddCarouselModalProps>({name: 'register'})(AddCarouselModal)
