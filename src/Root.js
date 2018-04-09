import React, { Component } from 'react';
import Homeuser from './containners/Homeuser';
import App from './App';
import Admin from './containners/Admin';
import Adminhome from './containners/Adminhome';
import Adminfilter from './containners/Adminfilter';
import Home from './containners/Home';
import {
    BrowserRouter as Router,
    Route,
    Switch
} from 'react-router-dom';

export default class Root extends Component{
    render(){
        return(
            <Router>
                <Switch>
                    <Route exact path="/" component={Homeuser}/>
                    <Route path="/App" component={App}/>
                    <Route path="/Admin" component={Admin}/>
                    <Route path="/Adminhome" component={Adminhome}/>
                    <Route path="/Home" component={Home}/>
                    <Route path="/Adminfilter" component={Adminfilter}/>
                </Switch>
            
            
            </Router>



        );




    }



};