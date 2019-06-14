import {Action} from "../actions";

const articleReducer = (state:any={list:[],article:{classificationId:-1,content:'',title:''},total:0, totalPages: 999},action:{payload:any,type:Action}) => {
    switch(action.type){
        case Action.EDIT_ARTICLE:
            return {
                ...state,
                article:action.payload
            }
        default:
            return state
    }
}

export default articleReducer