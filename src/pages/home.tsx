import React from 'react'
import { Carousel,message} from 'antd'
import ArticleList from '../components/article_list'
import './home_style.less'
import {Link} from 'react-router-dom'
import style from './style.module.less'
import {getCarouselList} from "../api/carousel"

interface HomePageProps{

}

interface HomePageState{
    carousels:EntityCarousel[]
}

class HomePage extends React.Component<HomePageProps,HomePageState>{
    public state:HomePageState = {
        carousels:[]
    }

    componentWillMount(): void {
        getCarouselList(-1, -1, true).then(res=>{
            if (res.success){
                this.setState({
                    carousels:res.data
                })
            }else{
                message.error(res.message)
            }
        })
    }

    public render = ():JSX.Element => {
        const carouselContent = this.state.carousels.map((v:EntityCarousel)=>{
            return  <Link to={`/article/${v.articleId}`} key={v.id}><img alt={v.title} className={style.carousel_img} src={v.imgUrl}/><h2>{v.title}</h2></Link>
        })
        return (
            <div style={{height:'100%'}}>
                <div style={{width:'100%',textAlign:'center'}}>
                    <div className={style.shadow_box}>
                        <Carousel effect="fade"  arrows={true} autoplay  infinite={true} dots={true} >
                            {carouselContent}
                        </Carousel>
                    </div>
                </div>
                <ArticleList  infinite={true} infiniteLoadSize={4}/>
            </div>
        );
    }
}

export default HomePage;