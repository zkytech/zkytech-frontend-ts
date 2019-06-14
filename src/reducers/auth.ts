import {Action} from "../actions";

const authReducer = (state:any={user:{}}, action:{payload:any, type:Action}) => {
    switch (action.type) {
        case Action.UPDATE_AVATAR_URL:
            let user = {...state.user}
            user.avatar = `${action.payload}?date=${Date.now()}`
            return {
                ...state,user
            }
        case Action.CHECK_REMEMBER_ME:
        case Action.AUTH_LOGIN:
            return {
                ...state,
                user:action.payload.success?action.payload.data:{}
            }
        case Action.AUTH_LOGOUT:
            return {
                ...state,
                user:{}
            }
        default:
            return state
    }
}

export default authReducer