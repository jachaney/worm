import { Meteor } from 'meteor/meteor';
import React from 'react';
import { Router,
    Route,
    Switch,
    Redirect,
    withRouter,
    Link } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

import Dashboard from '../ui/dashboard';
import Login from '../ui/login';
import Signup from '../ui/signup';

const unAuthPages = ['/','/signup','/login'];
const authPages = ['/dashboard'];
const pathname = location.pathname;
const isUnAuthPage = unAuthPages.includes(pathname);
const isAuthPage = authPages.includes(pathname);
const isAuth = !!Meteor.userId();
const history = createHistory();

const PublicRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    !isAuth ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/dashboard',
        state: { from: props.location }
      }}/>
    )
  )}/>
);

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    isAuth ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
);

export const Routing = (
  <Router history = { history }>
    <Switch>
      <PublicRoute exact path="/" component={ Login }/>
      <PublicRoute exact path="/login" component={ Login }/>
      <PublicRoute exact path="/signup" component={ Signup }/>
      <PrivateRoute exact path="/dashboard" component={ Dashboard }/>
    </Switch>
  </Router>
);
