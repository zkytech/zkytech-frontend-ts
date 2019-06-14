import {Redirect, Route, RouteProps} from "react-router-dom";
import React from 'react';
import { connect } from 'react-redux'

interface ReduxState{
    userType:string|undefined,
}

type PrivateRouteProps = ReduxState & RouteProps

const PrivateRoute:React.FC<PrivateRouteProps> = (props:PrivateRouteProps):JSX.Element=>{
    if(props.userType === "ADMIN"){
        return <Route {...props}/>
    }else{
        return <Redirect  to={{
            pathname: "/login",
            state: {from: props.path}
        }}
        />
    }
}

const mapStateToProps= (state:any):ReduxState=>{
    return {
        userType:state.auth.user.userType
    }
}

export default connect(mapStateToProps)(PrivateRoute)


