import { checkRememberMe, login, logout} from "../api/auth"
import { getCommentList} from "../api/comment";
import {Dispatch} from "redux";

export enum Action {
    AUTH_LOGIN='AUTH_LOGIN',
    AUTH_LOGOUT='AUTH_LOGOUT',
    EDIT_ARTICLE='EDIT_ARTICLE',
    CHECK_REMEMBER_ME='CHECK_REMEMBER_ME',
    UPDATE_AVATAR_URL='UPDATE_AVATAR_URL',
    GET_COMMENT_LIST='GET_COMMENT_LIST'
}

export const loginAction = async(dispatch:Dispatch, authInf:AuthInf):Promise<MyApiResponse> => login(authInf).then(
    res=>{
        dispatch({
            type:Action.AUTH_LOGIN,
            payload:res
        })
        return res
    }
)

export const logoutAction = async (dispatch:Dispatch):Promise<MyApiResponse> => logout().then(
    res=>{

        dispatch({
            type:Action.AUTH_LOGOUT,
            payload:res
        })
        return res
    }
)

export const editArticleAction = (dispatch:Dispatch, article:any):void => {
    dispatch({
        type:Action.EDIT_ARTICLE,
        payload:article
    })
}

export const checkRememberMeAction = async (dispatch:Dispatch):Promise<MyApiResponse> => checkRememberMe().then(
    res=>{
        dispatch({
            type:Action.CHECK_REMEMBER_ME,
            payload:res
        })
        return res
    }
)

export const updateAvatarUrlAction = (dispatch:Dispatch, url:string):void=>{
    dispatch({
        type:Action.UPDATE_AVATAR_URL,
        payload:url
    })
}

export const getCommentListAction = async (dispatch:Dispatch, options:CommentListOption) => getCommentList(options).then(
    res=>{
        if(res.success){
            dispatch(
                {
                    type:Action.GET_COMMENT_LIST,
                    payload:res
                }
            )
        }
        return res
    }
)