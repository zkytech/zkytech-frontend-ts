import React from 'react';
import {
    Upload, message, Button, Icon, Col, Row, Steps, Modal,
} from 'antd'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'
import {connect} from "react-redux"
import lrz from 'lrz'
import style from './style.module.less'
import {upload} from "../utils"

const Step = Steps.Step

interface UploadImageState {
    src: string,
    current: number,
    previewVisible: boolean,
    previewImage: string,
    stepStatus: 'process' | 'finish' | 'error',
    fileList: any[],
    uploading: boolean
}

interface ReduxState {
    user: EntityUser
}

interface UploadImageProps extends ReduxState {
    modalVisible: boolean,
    onUploadSuccess?: (imageUrl: string) => any,
    quality?: number,
    showAvatar?: boolean,
    aspectRatio?: number
}

class UploadImage extends React.Component<UploadImageProps, UploadImageState> {

    private cropper: any

    public defaultProps: Partial<UploadImageProps> = {
        quality: 0.5,
        showAvatar: true,
        aspectRatio: 1 / 1
    }

    public state: UploadImageState = {
        src: '',
        current: 0,
        previewVisible: false,
        previewImage: '',
        stepStatus: 'process',
        fileList: [],
        uploading: false
    }

    componentWillReceiveProps(nextProps: Readonly<UploadImageProps>, nextContext: any): void {
        if ((!nextProps.modalVisible) && this.props.modalVisible) {
            // 关闭时初始化所有状态
            this.setState(
                {
                    src: '',
                    current: 0,
                    previewVisible: false,
                    previewImage: '',
                    stepStatus: 'process',
                    fileList: [],
                    uploading: false
                }
            )
        }
    }

    /**
     * 返回false阻止文件上传，并将文件缓存到state中
     * @param file
     * @param fileList
     * @returns {boolean}
     */
    beforeUpload = (file: File, fileList: any[]): false => {
        this.setState({
            fileList
        })
        const fileReader = new FileReader()
        fileReader.onload = (e: any) => {
            const dataURL = e.target.result
            const fileList = [...this.state.fileList]
            fileList[0].url = dataURL
            fileList[0].status = 'finish'
            this.setState({src: dataURL, fileList})
        }

        fileReader.readAsDataURL(file)
        return false
    }

    dataURLtoBlob = (urlData: string): Blob => {
        //去掉url的头，并转换为byte
        const bytes: string = window.atob(urlData.split(',')[1]);
        //处理异常,将ascii码小于0的转换为大于0
        const ab: ArrayBuffer = new ArrayBuffer(bytes.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < bytes.length; i++) {
            ia[i] = bytes.charCodeAt(i);
        }
        return new Blob([ab], {type: 'image/png'});
    }

    cropImage = () => {
        if (this.cropper.getCroppedCanvas() === 'null') {
            return false
        }
        this.setState({
            uploading: true
        })
        let base64Url: string = this.cropper.getCroppedCanvas().toDataURL()
        let fileName: string
        if (this.props.showAvatar) {
            fileName = `avatar_${this.props.user.id}.png`
        } else {
            fileName = `${new Date().toLocaleString()}.png`
        }
        // 图片压缩
        lrz(base64Url, {quality: this.props.quality}).then((result: any) => {
            // base64=>blob
            let blob = this.dataURLtoBlob(result.base64)
            let type = this.props.showAvatar ? 'avatar' : 'carousel'
            // TODO:添加description
            upload(blob, fileName, type).then(res => {
                if (res.status === "finish") {
                    this.setState({
                        src: '',
                        fileList: [],
                        uploading: false
                    })
                    if (this.props.onUploadSuccess) {
                        this.props.onUploadSuccess(res.url)
                    }
                    this.next()
                } else {
                    message.error(res.message)
                    this.setState({
                        src: '',
                        fileList: [],
                        uploading: false,
                        stepStatus: 'error'
                    })
                }

            })
        })
    }

    next = () => this.setState({current:this.state.current + 1});

    prev = () => this.setState({current:this.state.current - 1});

    handleCancel = () => this.setState({previewVisible: false})

    handlePreview = () => this.setState({previewVisible: true,})

    render() {
        const {current, stepStatus, previewVisible, src, uploading,fileList} = this.state
        const nextStepButton = <Button className={style.choose_image_button} onClick={this.next}>下一步</Button>

        const firstStep = (
            <div>
                <div style={{
                    paddingTop: '200px',
                    display: 'inline-grid'
                }}>
                    <Upload beforeUpload={this.beforeUpload}
                            listType="picture-card"
                            fileList={this.state.fileList}
                            onPreview={this.handlePreview}
                            accept={"image/png"}
                    >
                        <Icon type="plus" style={{fontSize: '32px'}}/>
                        <span
                            style={{display: "block", marginTop: '8px', color: '#666'}}>
                            选择图片
                        </span>
                    </Upload>
                    <Modal visible={previewVisible} width={'60vw'} footer={null} onCancel={this.handleCancel}>
                        <img alt="avatar" style={{width: '100%'}} src={src}/>
                    </Modal>
                </div>
                {fileList.length === 1 ? nextStepButton : null}
            </div>
        )

        const avatarPreview = <Row>
            <Col>
                <div className={`img-preview ${style.avatar_preview}`}
                     style={{width: '100px', height: '100px'}}/>
                <div className={`img-preview ${style.avatar_preview}`} style={{width: '50px', height: '50px'}}/>
                <div className={`img-preview ${style.avatar_preview}`} style={{width: '20px', height: '20px'}}/>
            </Col>
        </Row>

        const secondStep = (
            <div>
                <Row>
                    <Col>
                        <Cropper

                            style={{
                                height: '300px',
                                width: '300px',
                                display: 'inline-block',
                                boxShadow: '0 0 10px'
                            }}
                            src={this.state.src}
                            className="company-logo-cropper"
                            ref={cropper => {
                                this.cropper = cropper;
                            }}
                            // Cropper.js options
                            viewMode={1}
                            zoomable={true}
                            aspectRatio={this.props.aspectRatio}
                            guides={false}
                            preview='.img-preview'
                        />
                    </Col>
                </Row>
                {this.props.showAvatar ? avatarPreview : null}
                <Row>
                    <Col>
                        <Button loading={uploading} type={"primary"} onClick={this.cropImage}>
                            上传
                        </Button>
                    </Col>
                </Row>
            </div>
        )
        const thidStep = (
            <span className={style.third_step}>
                上传成功
            </span>
        )

        const steps = [{
            title: '选择图片',
            content: firstStep,
        }, {
            title: '裁剪',
            content: secondStep,
        }, {
            title: '上传',
            content: thidStep,
        }];


        return (
            <div>
                <Steps current={current} status={stepStatus}>
                    {steps.map(item => <Step key={item.title} title={item.title}/>)}
                </Steps>
                <div className={style.steps_content}>{steps[current].content}</div>
                <div className={style.steps_action}>
                </div>
            </div>
        );
    }

}

const mapStateToProps = (state: any): ReduxState => {
    return {user: state.auth.user}
}

export default connect(mapStateToProps)(UploadImage);
