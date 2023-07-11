import React from 'react';
import { registerWithEmailAndPassword } from '../firebase';

class Signup extends React.Component {
	constructor() {
		super();
		this.state = {
            email: '',
            password: '',
            confirm: '',
            message: null,
            // users: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.signup = this.signup.bind(this);
    }

	signup(e) {
        e.preventDefault();
        if (this.state.password !== this.state.confirm) {
            this.setState({message: 'Passwords do not match'})
            return;
        }

		if (this.state.password === this.state.confirm){
            const onError = errorMsg => this.setState({message: errorMsg})
            registerWithEmailAndPassword(this.state.email, this.state.password, onError)
        }
    }

    handleChange(e) {
		this.setState({
            [e.target.name]: e.target.value,
            message: null
		});
	}

    render() {
		return (
            <div>
                {this.props.showForm === 'signout' ? 
                    <form onSubmit={this.signup} noValidate>
                        <fieldset>
                            <label htmlFor="email">Email: </label>
                            <input type="email" name="email" onChange={this.handleChange} />
                        </fieldset>
                        <fieldset>
                            <label htmlFor="password">Password: </label>
                            <input type="password" name="password" onChange={this.handleChange} />
                        </fieldset>
                        <fieldset>
                            <label htmlFor="confirm">Confirm: </label>
                            <input type="password" name="confirm" onChange={this.handleChange} />
                        </fieldset>
                        { this.state.message ? <div> {this.state.message} </div> : null }
                        <button type="submit">Sign Up</button>
                    </form> 
                    : 
                    <button onClick={() => this.props.showAuthForm('signout')}>Sign Up</button>
                }
			</div>
        )
	}
  }

export default Signup;
