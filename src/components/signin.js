import React from 'react';
import { logInWithEmailAndPassword, sendPasswordReset } from '../firebase'

class Signin extends React.Component {
	constructor() {
		super();
		this.state = {
            email: "",
            password: "",
            message: "",
            showForgotPasswordForm: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.signin = this.signin.bind(this);
        this.onResetPasswordReset = this.onResetPasswordReset.bind(this);
	}

	signin = (e) => {
        e.preventDefault();
        if (!this.state.email || !this.state.password) {
            this.setState({message: "Please complete all fields."});
            return;
        }

        const onError = errorMsg => this.setState({message: errorMsg})
		logInWithEmailAndPassword(this.state.email, this.state.password, onError)
	}
    
    handleChange(e) {
		this.setState({
			[e.target.name]: e.target.value
		});
    }
    
    onResetPasswordReset() {
        const onSuccess = () => this.setState({message: 'Email sent to ' + this.state.email + "!"})
        const onError = errorMsg => this.setState({message: errorMsg})
        sendPasswordReset(this.state.email, onSuccess, onError)
    }

    onShowForgotPasswordForm(state) {
        this.setState({showForgotPasswordForm: state, message: null})
    }

	render() {
		return (
            <div>
                {this.props.showForm === 'signin' ? 
                    <form id="signin" onSubmit={e => this.signin(e)} noValidate>
                        <fieldset>
                            <label htmlFor="email">Email: </label>
                            <input type="email" name="email" onChange={this.handleChange} />
                        </fieldset>
                        {this.state.showForgotPasswordForm ? null : 
                            <React.Fragment>
                                <fieldset>
                                    <label htmlFor="password">Password: </label>
                                    <input type="password" name="password" onChange={this.handleChange} />
                                </fieldset>
                                <button type="submit">Sign In</button>
                            </React.Fragment>
                        }
                        
                        
                        { this.state.message ? <div> {this.state.message} </div> : null }
                        
                        <div>
                        
                            {this.state.showForgotPasswordForm === false ? <button className="button-link" onClick={() => this.onShowForgotPasswordForm(true)}>Forgot Password?</button> : null}
                            {this.state.showForgotPasswordForm ? 
                                <div>
                                    
                                    <button onClick={() => this.onResetPasswordReset()}>Send me a password reset email</button> 
                                    <span className="desktop-only">&nbsp;&nbsp;&nbsp;</span>
                                    <button onClick={() => this.onShowForgotPasswordForm(false)}>Cancel</button>
                                </div>
                                
                            : null}

                        </div>

                    </form> :
                    <button onClick={() => this.props.showAuthForm('signin')}>Sign In</button>
                }
			</div>

		);
	}
}

export default Signin;
