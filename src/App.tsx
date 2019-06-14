import {BrowserRouter, Route} from "react-router-dom";
import React from 'react';
import Index from './pages/index';
import Scrollbars from 'react-custom-scrollbars'
import {checkRememberMeAction} from "./actions";
import {connect} from "react-redux";
import {Dispatch} from "redux";

interface ReduxDispatch {
  onCheckRememberMe:()=>any
}

interface AppProps extends ReduxDispatch{

}


const App: React.FC<AppProps> = ({onCheckRememberMe}) => {
  onCheckRememberMe()
  return (
      <Scrollbars style={{height:'100vh'}} id={'myScroll'} autoHide>
        <BrowserRouter>
          <Route component={Index}/>
        </BrowserRouter>
      </Scrollbars>
  );
}

const mapStateToProps = (state:any):any =>({})

const mapDispatchToProps = (dispatch:Dispatch):ReduxDispatch =>{
  return {onCheckRememberMe:()=>checkRememberMeAction(dispatch)}
}

export default connect<{},ReduxDispatch,{},{}>(mapStateToProps,mapDispatchToProps)(App);
