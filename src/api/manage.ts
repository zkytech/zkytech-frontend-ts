// 管理页面相关的API

import {myFetch} from "../utils";

/**
 * 在线用户计数
 */
export const getOnlineCount = async ():Promise<MyApiResponse>=>myFetch('/api/manage/online',{method:'GET'})


/**
 * 点击量计数
 */
export const getClicksCount = async ():Promise<MyApiResponse>=>myFetch('/api/manage/clicks',{method:'GET'})
