/// <reference types="react-scripts" />
declare module '*.module.less'

declare module 'lrz'

interface ApiResponse<T> {success: boolean,message: string | null,data: any | null|T}

declare type MyApiResponse = ApiResponse | any

interface UserInf {username: string,password: string,}

declare interface AuthInf extends UserInf {rememberMe: boolean}

declare interface SignupInf extends UserInf {email: string,code: string}

declare type GetArticleListOption = { keyword?: string|null, endId?: number|null, classificationId?: number|null }

declare type CommentInfo = { content: string, articleId: number, targetId: number, floor: number, targetFloor: number, targetUserId: number }

declare type CommentListOption = { articleId?: number, userId?: number, page?: number, pageSize?: number, reply?: boolean }

declare interface EntityClassification {id:number,classificationName:string}

declare interface EntityArticle {title: string,content: string,classification: EntityClassification,id:number,createdDate:string,lastModifiedDate:string,clicks?:number}

declare interface EntityComment {
    id:number,
    articleId:number,
    userId:number,
    targetUserId:number,
    content:string,
    floor:number,
    insideFloor:number,
    targetId:number,
    targetFloor:number,
    upvote:number,
    downvote:number,
    createdDate:string,
    read:boolean,
    avatar:string,
    author:string,
    targetUsername:string,
    articleTitle:string
}

declare interface EntityUser {
    id?:number,
    username?:string,
    userType?:string,
    avatar?:string,
    email?:string,
    verified?:boolean,
    createdDate?:string,
    enabled?:boolean,
}

declare interface EntityCarousel {
    id:number,
    imgUrl:string,
    articleId:number,
    title:string,
    rank:number,
    active:boolean,
    createdDate:string,
    lastModifiedDate:string,
    articleTitle:string
}

declare interface EntityImage {id:number,imgUrl:string,description:string,createdDate:string}

declare interface SpringDataPage<T>{
    content:T[],
    pageable:{
        sort:{
            sorted:boolean,
            unsorted:boolean,
            empty:boolean
        },
        pageSize:number,
        pageNumber:number,
        offset:number,
        unpaged:boolean,
        paged:boolean
    },
    last:boolean,
    totalPages:number,
    totalElements:number,
    first:boolean,
    sort:{
        sorted:boolean,
        unsorted:boolean,
        empty:boolean
    },
    numberOfElements:number,
    size:number,
    number:number,
    empty:boolean
}

