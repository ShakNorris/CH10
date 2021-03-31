import React, { Component } from 'react';
import './Login.css'


class Login extends Component {
    render(){
        const {
            user,
            setUser,
            firstName,
            setFirstName,
            lastName,
            setLastName,
            email,
            setEmail,
            password,
            setPassword,
            handleLogin,
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
                            <p>Don't have an account? <span onClick={()=> setHasAccount(!hasAccount)}>Sign Up</span></p>
                            </>
                        ) : (
                            <>
                            <label>First Name</label>
                            <input type="text" required value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}/>
                            <label>Last Name</label>
                            <input type="text" required value={lastName}
                            onChange={(e) => setLastName(e.target.value)}/>
                            <label>Username</label>
                            <input type="text" required value={user}
                            onChange={(e) => setUser(e.target.value)}/>
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
                        )}
                    </div>
                </div>
            </section>
        )
    }
}

export default Login;