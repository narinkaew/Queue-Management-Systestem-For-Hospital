import React, { Component } from 'react';
import logo1 from './../img/logo1.png';
import hospital from './../img/hospital.png';

import backgroundLogin from './../img/backgroundLogin.png'
import { Card, Icon, Image, Button, Form, Segment, Header } from 'semantic-ui-react'
import Login from './../components/login';
class Homeuser extends Component {
    render() {
        return (
            <div style={{
                // backgroundImage: 'url(https://www.picz.in.th/images/2018/10/11/kum9gq.png)',
                backgroundColor: 'white',
                height: '100vh'
            }}>
                <br />
                <br />
                <Image src={hospital}  
                className="ui small centered image" />
                <br />
                <br />
                <center>
                    <Header as='h2' color='teal'>Welcome To Hospital</Header>
                </center>
                <br />
                <br />
                <Login />
            </div>
        );
    }
}



export default Homeuser;