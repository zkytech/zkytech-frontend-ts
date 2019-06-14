// 身份认证相关的API

import {myFetch} from "../utils";





export const login = async (authInf:AuthInf):Promise<MyApiResponse> => {
    let formData:FormData = new FormData()
    formData.append('username',authInf.username)
    formData.append('password',authInf.password)
    formData.append('rememberMe',authInf.rememberMe.toString())
    return myFetch(`/api/auth/login`,{
        method:'POST',
        body:formData,
    })
}

export const logout = async ():Promise<MyApiResponse> => myFetch(`/api/auth/logout`,{
        method:'POST'
    }
)

export const signup = async (signupInf:SignupInf):Promise<MyApiResponse> => myFetch(
    `/api/auth/signup`,
    {
        method:'POST',
        body:JSON.stringify(signupInf),
        headers: {
            'content-type': 'application/json'
        }
    }
)

/**
 * 检查用户名、邮箱是否已被注册
 * @param info
 */
export const checkSignupInfo = async (info:{username?:string,email?:string}):Promise<MyApiResponse> => {
    let {username, email} = info
    username = typeof username === "undefined" ? '':username
    email = typeof email === "undefined" ? '': email
    return myFetch(`/api/auth/check?username=${username}&email=${email}`,
        {
            method:'GET',
        })
}

/**
 * 获取登录状态
 */
export const checkRememberMe =async ():Promise<MyApiResponse>=>myFetch(`/api/auth/checkRememberMe`,{method:'GET'})

/**
 * 发送验证邮件
 */
export const sendVerifyEmail =async ():Promise<MyApiResponse>=>myFetch(`/api/auth/sendEmail`,{method:'POST'})

/**
 * 验证码图片的地址
 */
export const codeUrl:string = '/api/auth/code'