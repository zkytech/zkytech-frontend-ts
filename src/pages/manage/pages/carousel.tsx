import React from 'react'
import {Col, Row, message, Transfer, Button, Icon, Carousel, Popconfirm} from 'antd'
import {getCarouselList,editCarousels,deleteCarousel} from '../../../api/carousel'
import AddCarouselModal from '../../../components/add_carousel_modal'
import style from '../../style.module.less'
import {TransferItem} from "antd/lib/transfer";


type CarouselData = EntityCarousel & {key:string}

interface CarouselProps {maxCarousel?:number}

interface CarouselState {
    modalVisible:boolean,
    loading:boolean,
    originData:CarouselData[],
    dataSource:CarouselData[],
    targetKeys:string[],
    selectedKeys:string[],
    previewItem:TransferItem|null
}

class CarouselPage extends React.Component<CarouselProps,CarouselState> {
    static defaultProps:Partial<CarouselProps> = {
        maxCarousel:6
    }

    public state:CarouselState = {
        modalVisible:false,
        loading:false,
        originData:[],
        dataSource:[],
        targetKeys:[],
        selectedKeys:[],
        previewItem:null
    }

    private previewItem = (item:TransferItem) => this.setState({previewItem:item})

    private refreshDataSource = (updateTargetKeys:boolean) => {
        getCarouselList().then(res=>{
            if (res.success){
                const carouselList:EntityCarousel[] = res.data
                let targetKeys:string[] = []
                let temp:string[] = []
                let dataSource = carouselList.map(value => {
                    if (value.active) temp[value.rank] = value.id.toString()
                    return {
                        ...value,
                        key:value.id.toString()
                    }
                })

                for (let i = 0; i < Object.keys(temp).length;i++){
                    targetKeys.push(temp[i])
                }

            if (updateTargetKeys) {
                this.setState({
                    dataSource,
                    targetKeys,
                    originData:JSON.parse(JSON.stringify(dataSource))
                })
            }else{
                this.setState(
                    {
                        dataSource,
                        originData:JSON.parse(JSON.stringify(dataSource))
                    }
                )
            }
            } else{
                message.error(res.message)
            }
            return res
        })
    }

    private handleChange = (nextTargetKeys:string[],direction:string,moveKeys:string[]) => {
        this.setState({targetKeys:nextTargetKeys})
        let {dataSource} = this.state
        if(nextTargetKeys.length >= (this.props.maxCarousel as number)){ // 达到最大容量
            dataSource = dataSource.map(value => {
                if (nextTargetKeys.indexOf(value.key) === -1){
                    value.active = true
                }
                return value
            })
        }else{
            dataSource = dataSource.map(value =>{
                value.active = false
                return value
            })
        }
        this.setState({dataSource})
    }

    private handleSelectChange = (sourceSelectedKeys:string[], targetSelectedKeys:string[]) => {
        const selectedKeys = [...sourceSelectedKeys,...targetSelectedKeys]
        let {dataSource} = this.state
        if((sourceSelectedKeys.length + this.state.targetKeys.length)===this.props.maxCarousel){
            dataSource = dataSource.map(value=>{
                if(sourceSelectedKeys.indexOf(value.key)=== -1 && this.state.targetKeys.indexOf(value.key)===-1){
                    value.active = true
                    return value
                }else{
                    return value
                }
            })
        }else{
            dataSource = dataSource.map(value=>{
                value.active = false
                return value
            })
        }
        this.setState({ selectedKeys, dataSource});
    }

    private moveUp = (e:any,key:string) => {
        e.stopPropagation()
        let targetKeys = this.state.targetKeys
        const index = targetKeys.indexOf(key)
        targetKeys[index] = targetKeys[index-1]
        targetKeys[index -1] = key
        this.setState({targetKeys})
    }

    private moveDown = (e:any,key:string) => {
        e.stopPropagation()
        let targetKeys = this.state.targetKeys
        const index = targetKeys.indexOf(key)
        targetKeys[index] = targetKeys[index + 1]
        targetKeys[index + 1] = key
        this.setState({
            targetKeys
        })
    }

    private showUp=(key:string)=>{
        if(this.state.targetKeys.indexOf(key) !==-1 && this.state.targetKeys[0] !== key ){
            return true
        }else{
            return false
        }
    }
    private showDown=(key:string)=>{
        let targetKeys = this.state.targetKeys
        if(targetKeys.indexOf(key) !==-1 && targetKeys[targetKeys.length-1] !== key ){
            return true
        }else{
            return false
        }
    }

    private showDelete=(key:string)=>{
        let targetKeys = this.state.targetKeys
        if(targetKeys.indexOf(key) === -1){
            return true
        }else{
            return false
        }
    }

    private submitChange = ()=>{
        this.setState({
            loading:true
        })
        let {originData,dataSource,targetKeys} = this.state
        dataSource = dataSource.map(value=>{
            let index = targetKeys.indexOf(value.key)
            if(index !== -1){
                value.active = true
                value.rank = index
            }else{
                value.active = false
                value.rank = 0
            }
            delete value.active
            return value
        })

        let temp:Array<CarouselData|null> = dataSource.map(value => {
            let result:CarouselData|null = null
            originData.forEach(v=>{
                if (v.key === value.key && (v.rank !== value.rank || v.active !== value.active)){
                    result = value
                }
            })
            return result
        })
        let diff:CarouselData[] = []
        temp.forEach(v =>{
            if(v){
                diff.push(v)
            }
        })
        editCarousels(diff).then(res=>{
            if(res.success){
                message.success(res.message)
            }else{
                message.error(res.message)
            }
            this.setState({
                loading:false
            })
        })
    }

    private deleteCarousel = (e:any,key:string)=>{
        deleteCarousel(Number(key)).then(res=>{
            if(res.success){
                message.info(res.message)
                this.refreshDataSource(false)
            }else{
                message.error(res.message)
            }
        })
    }

    componentWillMount(): void {
        this.refreshDataSource(true)
    }

    render =():JSX.Element => {
        const { targetKeys, selectedKeys, dataSource, loading} = this.state
        const carouselContent = targetKeys.map(key=>{
            let result = null
            dataSource.forEach(v=>{
                if(v.key === key ){
                    result = <div key = {key}><img alt={v.title} className={style.carousel_img} src={v.imgUrl}/><h3>{v.title}</h3></div>
                }
            })
            return result
        })
        const itemRender = (item:TransferItem)=>{
            return<Row style={{display:'inline-block',width:'100%',verticalAlign:'middle'}} onClick={()=>this.previewItem(item)}>
                <Col xs={10} md={14} lg={18} style={{ overflow:'hidden',textOverflow:'ellipsis!important' }}>
                    { item.title }
                </Col>
                <Col xs={10} md={10} lg={6}>
                    <Icon type='down' style={{paddingLeft:'10px',paddingRight:'10px',display:this.showDown(item.key)?"inline-block":"none"}} onClick={(e)=>this.moveDown(e,item.key)} />
                    <Icon type='up' style={{paddingRight:'10px',paddingLeft:'10px',display:this.showUp(item.key)?"inline-block":"none"}} onClick={(e)=>this.moveUp(e,item.key)}/>
                    <Popconfirm placement="topRight" title={"确定删除吗？\n删除后将无法恢复"} onConfirm={(e)=>this.deleteCarousel(e,item.key)} okText="删除" cancelText="取消">
                        <Icon type='delete' style={{paddingRight:'10px',paddingLeft:'10px',display:this.showDelete(item.key)?"inline-block":"none"}} />
                    </Popconfirm>
                </Col>
            </Row>
        }

        return (
            <Row>
                <Col lg={{span:15,offset:1}} sm={24}>
                    <Transfer
                        style={{paddingTop:'20px'}}
                        listStyle={{width:'40%', height:'500px'}}
                        dataSource={dataSource}
                        targetKeys={targetKeys}
                        selectedKeys = {selectedKeys}
                        onChange={this.handleChange}
                        onSelectChange={this.handleSelectChange}
                        render={itemRender}
                    />
                    <Button onClick={()=>this.setState({modalVisible:true})}>添加</Button>
                    <Button onClick={this.submitChange} loading = {loading}>提交修改</Button>
                    <AddCarouselModal visible={this.state.modalVisible} onClose={()=>this.setState({modalVisible:false})} onSubmit={()=>this.refreshDataSource(false)}/>
                </Col>
                <Col lg={{span:8}} sm={24}>
                    <div className={style.shadow_box}>
                        <Carousel effect="fade" autoplay  infinite={true} dots={true} >
                            {carouselContent}
                        </Carousel>
                    </div>
                    <div className={style.preview_image}>
                        <img src={this.state.previewItem?this.state.previewItem.imgUrl:''} className={style.carousel_img} alt={this.state.previewItem?this.state.previewItem.title:''}/>
                    </div>
                </Col>
            </Row>
        )
    }
}

export default CarouselPage
