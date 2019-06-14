// 文章相关的API

import {myFetch} from "../utils";

export const getArticleList = async (pageSize: number, page: number, option: GetArticleListOption): Promise<MyApiResponse> => {
    let keyword: string = option.keyword  ? option.keyword:''
    let endId: string = option.endId? option.endId.toString() : ''
    let classificationId: string = option.classificationId ? option.classificationId.toString():''
    let url: string = `/api/article/list?pageSize=${pageSize}&page=${page}&keyword=${keyword}&endId=${endId}&classificationId=${classificationId}`
    return myFetch(url, {method: 'GET'})
}

export const getRankList = async (page: number, pageSize: number): Promise<MyApiResponse> => {
    let url: string = `/api/article/rankList?page=${page}&pageSize=${pageSize}`
    return myFetch(url, {method: 'GET'})
}
export const publishArticle = async (article: {title: string, content: string, classificationId: number}): Promise<MyApiResponse> => myFetch(
    `/api/article`,
    {
        method: 'PUT',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(article)
    }
)


export const getArticle = async (id: number): Promise<MyApiResponse> => myFetch(
    `/api/article/${id}`,
    {method: 'GET'}
)


export const editArticle = async (id: number, classificationId: number, content: string, title: string): Promise<MyApiResponse> => myFetch(
    `/api/article`,
    {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({id, classificationId, content, title})
    })

export const deleteArticle = async (id:number):Promise<MyApiResponse> => myFetch(
    `/api/article/${id}`,
    {method:'GET'}
    )

/**
 * 文章点击计数，调用一次即增加一次
 * @param id：文章ID
 */
export const addClick = async (id:number):Promise<MyApiResponse> => myFetch(
    `/api/article/click/${id}`,
    {method:'POST'}
)