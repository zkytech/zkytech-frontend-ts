import {Action} from "../actions";

const commentReducer = (state:any = {commentList:[]}, action:{payload:any, type:Action}):any => {
    switch(action.type){
        case Action.GET_COMMENT_LIST:
            return {
                ...state,
                commentList:action.payload.data
            }
        default:
            return state
    }
}

export default commentReducer