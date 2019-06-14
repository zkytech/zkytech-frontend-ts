



export const checkStatusCode =(res:Response):MyApiResponse =>{
    if(res.status === 200){
        return res.json()
    }
    else{
        return {
            success:false,
            message:res.statusText
        }
    }
}


export const myFetch =async (url:string,options?:RequestInit):Promise<MyApiResponse> => {
    options = options?options:{}
    // 发送请求时携带cookie
    options.credentials = 'include'
    return fetch(url,options).then(res=>checkStatusCode(res))
}

export const getMailHost= (mail:string):string => {
    let t = mail.split('@')[1];
    t = t.toLowerCase();
    if (t === '163.com') {
        return 'mail.163.com';
    } else if (t === 'vip.163.com') {
        return 'vip.163.com';
    } else if (t === '126.com') {
        return 'mail.126.com';
    } else if (t === 'qq.com' || t === 'vip.qq.com' || t === 'foxmail.com') {
        return 'mail.qq.com';
    } else if (t === 'gmail.com') {
        return 'mail.google.com';
    } else if (t === 'sohu.com') {
        return 'mail.sohu.com';
    } else if (t === 'tom.com') {
        return 'mail.tom.com';
    } else if (t === 'vip.sina.com') {
        return 'vip.sina.com';
    } else if (t === 'sina.com.cn' || t === 'sina.com') {
        return 'mail.sina.com.cn';
    } else if (t === 'tom.com') {
        return 'mail.tom.com';
    } else if (t === 'yahoo.com.cn' || t === 'yahoo.cn') {
        return 'mail.cn.yahoo.com';
    } else if (t === 'tom.com') {
        return 'mail.tom.com';
    } else if (t === 'yeah.net') {
        return 'www.yeah.net';
    } else if (t === '21cn.com') {
        return 'mail.21cn.com';
    } else if (t === 'hotmail.com') {
        return 'www.hotmail.com';
    } else if (t === 'sogou.com') {
        return 'mail.sogou.com';
    } else if (t === '188.com') {
        return 'www.188.com';
    } else if (t === '139.com') {
        return 'mail.10086.cn';
    } else if (t === '189.cn') {
        return 'webmail15.189.cn/webmail';
    } else if (t === 'wo.com.cn') {
        return 'mail.wo.com.cn/smsmail';
    } else if (t === '139.com') {
        return 'mail.10086.cn';
    } else {
        return '';
    }
};


/**
 *
 * @param blob: blob文件
 * @param fileName :文件名
 * @param type :'avatar' or 'carousel'
 * @returns {Promise<any | never>}
 */
export const upload= async (blob:Blob, fileName:string, type:string):Promise<MyApiResponse> =>{
    let formData = new FormData()
    formData.set('file', blob, fileName)
    return fetch(`/api/upload/${type}`, {
        method: "POST",
        body: formData,
        headers: {
            // 注意这里不能自己设置content-type，否则服务器会无法识别
        }
    }).then(res=>res.json())	// 这里
}

export const deleteFromArray = <T>(target:T,array:T[]) => array.filter(v=>v!==target)
