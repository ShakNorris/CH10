import React, { Component } from 'react';
import { Grid, Form, Segment, Header, Icon, Button, Message } from 'semantic-ui-react'
import './Login.css'


class Login extends Component {
    render(){
        const {
            userState,
            setuserState,
            errorState,
            seterrorState,
            isLoading,
            setIsLoading,
            isSuccess,
            setIsSuccess,
            handleGoogleAuth,
            hasAccount,
            setHasAccount,
            handleInput,
            checkForm,
            isFormEmpty,
            formaterrors,
            checkPassword,
            onSubmitRegister,
            onSubmitLogin,
            updateuserDetails,
            saveUserInDB,
        } = this.props;
    
        return(
            <section className="login">
                <div className="loginContainer">
                    <div className="btnContainer">
                        {hasAccount ? (
                            <>
                            <Grid verticalAlign="middle" textAlign="center">
                                <Grid.Column style={{ maxWidth: '500px' }}>
                                    <Header icon as="h2">
                                        <img src={process.env.PUBLIC_URL + '/homer.ico'} /> 
                                        <br/>
                                        Register
                                    </Header>
                                    <Form onSubmit={onSubmitRegister}>
                                            <Form.Input
                                                name="userName"
                                                value={userState.userName}
                                                icon="user"
                                                iconPosition="left"
                                                onChange={handleInput}
                                                type="text"
                                                placeholder="User Name"
                                            />
                                            <Form.Input
                                                name="email"
                                                value={userState.email}
                                                icon="mail"
                                                iconPosition="left"
                                                onChange={handleInput}
                                                type="email"
                                                placeholder="User Email"
                                            />
                                            <Form.Input
                                                name="password"
                                                value={userState.password}
                                                icon="lock"
                                                iconPosition="left"
                                                onChange={handleInput}
                                                type="password"
                                                placeholder="User Password"
                                            />
                                            <Form.Input
                                                name="confirmpassword"
                                                value={userState.confirmpassword}
                                                icon="lock"
                                                iconPosition="left"
                                                onChange={handleInput}
                                                type="password"
                                                placeholder="Confirm Password"
                                            />
                                        <Button className="Authbutton" disabled={isLoading} loading={isLoading}>Register</Button>
                                    </Form>
                                    <p>Already have an account? <span onClick={()=> setHasAccount(!hasAccount)}>Sign In</span></p> 
                                    {errorState.length > 0 && <Message error>
                                        <h3>Errors</h3>
                                        {formaterrors()}
                                    </Message>
                                    }
                                    {isSuccess && <Message success>
                                        <h3>Successfully Registered</h3>
                                    </Message>
                                    }
                                </Grid.Column>
                            </Grid>
                            </>
                        ) : (
                            <>
                            <Grid verticalAlign="middle" textAlign="center">
                                    <Grid.Column style={{ maxWidth: '500px' }}>
                                        <Header icon as="h2">
                                        <img src={process.env.PUBLIC_URL + '/homer.ico'} /> 
                                        <br/>
                                        Login
                                        </Header>
                                        <Form onSubmit={onSubmitLogin}>
                                                <Form.Input
                                                    name="email"
                                                    value={userState.email}
                                                    icon="mail"
                                                    iconPosition="left"
                                                    onChange={handleInput}
                                                    type="email"
                                                    placeholder="User Email"
                                                />
                                                <Form.Input
                                                    name="password"
                                                    value={userState.password}
                                                    icon="lock"
                                                    iconPosition="left"
                                                    onChange={handleInput}
                                                    type="password"
                                                    placeholder="User Password"
                                                />
                                            <Button className="Authbutton" disabled={isLoading} loading={isLoading}>Login</Button>
                                            <Button className="Authbutton" onClick={handleGoogleAuth}>Login with Google</Button>
                                        </Form>
                                        <p>Don't have an account? <span onClick={()=> setHasAccount(!hasAccount)}>Sign Up</span></p> 
                                        {errorState.length > 0 && <Message error>
                                            <h3>Errors</h3>
                                            {formaterrors()}
                                        </Message>
                                        }
                                    </Grid.Column>
                                </Grid>
                            </>
                        )}
                    </div>
                </div>
            </section>
        )
    }
}

export default Login;