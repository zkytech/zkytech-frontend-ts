// 文章分类相关的API

import {myFetch} from "../utils";

export const addClasificationName = async(classificationName:string):Promise<MyApiResponse>=>{
    const data = {classificationName}
    return myFetch('/api/classification',{
        method:'PUT',
        body:JSON.stringify(data),
        headers: {
            'content-type': 'application/json'
        }
    })
}

export const getClassificationNameList = async():Promise<MyApiResponse>=>myFetch('/api/classification/list',{method:'GET'})

export const editClassificationName = async(classificationName:string,id:number):Promise<MyApiResponse>=>{
    const data = {classificationName, id}
    return myFetch('/api/classification',{
        method:'POST',
        body:JSON.stringify(data),
        headers:{
            'content-type': 'application/json'
        }
    })
}