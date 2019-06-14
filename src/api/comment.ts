// 评论相关的API

import {myFetch} from "../utils";



export const addComment = async( commentInfo:CommentInfo ):Promise<MyApiResponse>=>myFetch(
    '/api/comment',
    {
        method:'PUT',
        body:JSON.stringify(commentInfo),
        headers:{
            'content-type': 'application/json'
        }
    })


export const deleteComment = async(id:number):Promise<MyApiResponse>=>myFetch(
    `/api/comment/${id}`,
    {
        method:'DELETE'
    })


export const getCommentList = async(options:CommentListOption):Promise<MyApiResponse>=>{
    let {articleId, userId, page, pageSize, reply} = options
    let _articleId:''|number= articleId?articleId:''
    let _userId:''|number = userId?userId:''
    let _page:''|number=page?page:''
    let _pageSize:''|number=pageSize?pageSize:''
    let _reply:''|boolean = typeof reply==='undefined'?'':reply
    const uri = `/api/comment/list?page=${_page}&pageSize=${_pageSize}&articleId=${_articleId}&userId=${_userId}&reply=${_reply}`
    return myFetch(uri,{
        method:'GET'
    })
}

export const vote = async(commentId:number,upvote:boolean):Promise<MyApiResponse>=>{
    const data={commentId,upvote}
    return myFetch(`/api/comment/vote`,{
        method:'PUT',
        body:JSON.stringify(data),
        headers:{
            'content-type': 'application/json'
        }
    })
}

/**
 * 获取未读通知的数目
 */
export const getMessageCount = async():Promise<MyApiResponse>=>myFetch(`/api/comment/messageCount`,{method:'GET'})

/**
 * 向服务器发送消息，表示已阅读所有未读信息
 */
export const readMessage = async():Promise<MyApiResponse>=> myFetch(`/api/comment/readMessage`,{method:'POST'})