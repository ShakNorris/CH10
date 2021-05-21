import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter as Router,Switch,Route,Redirect} from 'react-router-dom'
import Authentication from './components/Authorization/Authentication';
import App from './App'
import fire from './config/firebase';
import { withRouter } from 'react-router-dom/cjs/react-router-dom.min';
import {Provider,connect} from 'react-redux';
import {createStore} from 'redux'; 
import {combinedReducers} from './store/reducer';
import {setUser} from './store/actions';
import "semantic-ui-css/semantic.min.css"
import AppLoader from './components/AppLoader/AppLoader'

const store = createStore(combinedReducers);

const Index = (props) => {

  useEffect(() => {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        props.setUser(user);
        props.history.push("/");
      } else {
        props.setUser(null);
        props.history.push("/Authentication");
      }
    })
  }, []);

  console.log(props.currentUser);

  return( <>
  <AppLoader loading={props.loading && props.location.pathname === "/"} />
  <Switch>
    <Route path="/Authentication" component={Authentication} />
    <Route path="/" component={App}/>
  </Switch>
  </>)
}

const mapStateToProps = (state) => {
  return{
    currentUser : state.user.currentUser,
    loading : state.channel.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return{
    setUser : (user) => {dispatch(setUser(user))}
  }
}

const IndexWithRouter = withRouter(connect(mapStateToProps,mapDispatchToProps)(Index));

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router>
        <IndexWithRouter />
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
