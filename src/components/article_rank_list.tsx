import React from 'react';
import {getRankList} from "../api/article";
import {message,Pagination} from 'antd'
import {Link} from 'react-router-dom'
import style from './style.module.less'
import QueueAnim from "rc-queue-anim";

interface ArticleRankListProps{

}

interface ArticleRankListState{
    rankList:Partial<EntityArticle>[],
    page:number,
    pageSize:number,
    total:number
}

class ArticleRankList extends React.Component<ArticleRankListProps,ArticleRankListState>{
    public state:ArticleRankListState = {
        rankList:[],
        page:1,
        pageSize:10,
        total:0
    }

    public componentWillMount(): void {
        const {page,pageSize} = this.state
        getRankList(page,pageSize).then(res=>{
            if(res.success){
                this.setState({
                    rankList:res.data.content,
                    total:res.data.totalElements
                })
            }else{
                message.error(res.message)
            }
        })
    }

    private pageChange = (page:number,pageSize?:number):void => {
        if(pageSize){
            getRankList(page,pageSize).then(res=>{
                if(res.success){
                    this.setState({
                        page,pageSize,
                        rankList:res.data.content,
                        total:res.data.totalElements
                    })
                }else{
                    message.error(res.message)
                }
            })
        }
    }

    private getClassName = (index:number):string =>{
        switch (index) {
            case 1:
                return style.rank_first
            case 2:
                return style.rank_second
            case 3:
                return style.rank_third
            default:
                return ""
        }
    }

    public render = ():JSX.Element =>{
        let { page, pageSize, rankList, total} = this.state
        const myRankList:JSX.Element[] = rankList.map((v:Partial<EntityArticle>,i:number)=>{
            const rank = i+1+(page-1)*pageSize
            return (
                <li key={i} className={this.getClassName(rank)}>
                    <span > {rank} </span><Link to={`/article/${v.id}`}>{v.title}</Link> <span>{v.clicks}</span>
                </li>
            )
        })
        return (<div>

                <ul className={style.rank_list}>
                    <QueueAnim
                        type={['right', 'left']}
                        duration={300}
                        interval={50}
                    >
                        {myRankList}
                    </QueueAnim>
                </ul>
                <Pagination simple current={page} total={total} onChange={this.pageChange} />
            </div>

        );
    }
}

export default ArticleRankList;