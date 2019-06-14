import {combineReducers} from 'redux'
import articleReducer from './article'
import authReducer from './auth'
import commentReducer from './comment'


const rootReducer = combineReducers({
    article:articleReducer,
    auth:authReducer,
    comment:commentReducer
})

export default rootReducer