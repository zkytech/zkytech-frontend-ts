// 用户信息相关的API

import {myFetch} from "../utils";

export const editUserInfo = async (options:{username?:string,email?:string}):Promise<MyApiResponse>=>{
    const username = typeof options.username === "undefined"?"":options.username
    const email = typeof options.email === "undefined"?"":options.email
    return myFetch(`/api/user?username=${username}&email=${email}`,{
        method:'POST'
    })
}

export const getUserInfo = async (userId:number):Promise<MyApiResponse>=>myFetch(`/api/user/${userId}`,{method: 'GET'})


export const getUserList = async (page:number,pageSize:number):Promise<MyApiResponse>=>myFetch(`/api/user/list?page=${page}&pageSize=${pageSize}`, {method:"GET"})

/**
 * 封禁/解封用户
 * @param id
 * @param enabled
 */
export const changeUserState = async (id:number,enabled:boolean):Promise<MyApiResponse>=>myFetch(`/api/user/${id}?enabled=${enabled}`,{method:"POST"})
