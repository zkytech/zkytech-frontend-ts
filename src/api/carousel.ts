// 轮播图相关的API

import {myFetch} from "../utils";

export const getCarouselList = async (pageSize?:number, page?:number, active?:boolean):Promise<MyApiResponse>=>{
    let _pageSize:string|number = typeof pageSize === "undefined" || pageSize === -1 ?'':pageSize
    let _page:string|number = typeof page === "undefined" || page === -1?'':page
    let _active:string|boolean = typeof active === "undefined"?'':active
    return myFetch(`/api/carousel/list?pageSize=${_pageSize}&page=${_page}&active=${_active}`,{
        method:'GET'
    })
}



export const addCarousel = async (imgUrl:string, articleId:number, title:string):Promise<MyApiResponse>=>myFetch(
    '/api/carousel',
    {
        method:'PUT',
        body:JSON.stringify({imgUrl, articleId, title}),
        headers:{
            'content-type': 'application/json'
        }
    })


export const deleteCarousel = async (id:number ):Promise<MyApiResponse>=>myFetch(
    `/api/carousel/${id}`,
    {
        method:'DELETE'
    })

export const editCarousel = async (id:number,imgUrl:string,articleId:number,rank:number,active:boolean):Promise<MyApiResponse>=> myFetch(
    '/api/carousel',
    {
        method:'POST',
        body:JSON.stringify({id,imgUrl,articleId,rank,active}),
        headers:{
            'content-type': 'application/json'
        }
    })

/**
 * 批量修改轮播图的是否展示以及展示顺序
 * @param carouselList
 */
export const editCarousels = async (carouselList:Array<any>):Promise<MyApiResponse> =>myFetch(
    '/api/carousel/list',
    {
        method:'POST',
        body:JSON.stringify(carouselList),
        headers:{
            'content-type': 'application/json'
        }
    })
