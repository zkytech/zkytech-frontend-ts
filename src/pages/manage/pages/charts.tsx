import React, {useState} from 'react'
import ArticleRankList from '../../../components/article_rank_list'
import {Card,Statistic,message,Col,Row} from 'antd'
import {getOnlineCount,getClicksCount} from "../../../api/manage"

interface ChartsProps {}

const Charts:React.FC<ChartsProps> = (props)=>{
    const [online,setOnline] = useState<number>(0)
    const [clicks,setClicks] = useState<number>(0)
    getOnlineCount().then(res=>{
        if(res.success){
            setOnline(res.data)
        }else{
            message.error(res.message)
        }
    })

    getClicksCount().then(res=>{
        if(res.success){
            setClicks(res.data)
        }else{
            message.error(res.message)
        }
    })
    return (
        <div>
            <Row>
                <Col lg={18} xs={24}>
                </Col>
                <Col lg={6} xs={24}>
                    <Statistic title="在线用户" value={online} style={{display:'inline-block',marginRight:'10px'}}/>
                    <Statistic title="总点击量" value={clicks} style={{display:'inline-block',marginRight:'10px'}}/>
                    <Card title="点击排行" bordered={false} style={{display:'block'}}>
                        <ArticleRankList/>
                    </Card>
                </Col>
            </Row>
        </div>
    );
}

export default Charts;