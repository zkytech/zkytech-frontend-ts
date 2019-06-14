// 图片管理相关的API

import {myFetch} from "../utils";

export const getImageList = async ():Promise<MyApiResponse> => myFetch(`/api/image/list`,{method:'GET'})

export const deleteImage = async (id:number):Promise<MyApiResponse> => myFetch(`/api/image/${id}`,{method:'DELETE'}
)