import React, { Component } from 'react';
import './Login.css'


class Login extends Component {
    render(){
        const {
            user,
            setUser,
            username,
            setUsername,
            email,
            setEmail,
            password,
            setPassword,
            handleLogin,
            handleGoogleAuth,
            handleSignUp,
            hasAccount,
            setHasAccount,
            emailError,
            passwordError
        } = this.props;
    
        return(
            <section className="login">
                <div className="loginContainer">
                    <div className="btnContainer">
                        {hasAccount ? (
                            <>
                            <label>Username</label>
                            <input type="text" required value={username}
                            onChange={(e) => setUsername(e.target.value)}/>
                            <label>Password</label>
                            <input type="password"
                            required value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                            <p className="errorMsg">{passwordError}</p>
                            <label>Email</label>
                            <input type="text"
                            autoFocus required value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                            <p className="errorMsg">{emailError}</p>
                            <button className="Authbutton" onClick={handleSignUp}>Sign Up</button>
                            <p>Have an account? <span onClick={()=> setHasAccount(!hasAccount)}>Sign In</span></p>
                            </>
                        ) : (
                            <>
                            <label>Email</label>
                            <input type="text"
                            autoFocus required value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            />
                            <p className="errorMsg">{emailError}</p>
                            <label>Password</label>
                            <input type="password"
                            required value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            />
                            <p className="errorMsg">{passwordError}</p>
                            <button className="Authbutton" onClick={handleLogin}>Sign In</button>
                            <button className="Authbutton" onClick={handleGoogleAuth}>Login With Google</button>
                            <p>Don't have an account? <span onClick={()=> setHasAccount(!hasAccount)}>Sign Up</span></p>
                            </>
                        )}
                    </div>
                </div>
            </section>
        )
    }
}

export default Login;