import React from 'react';
import firebase from '../firebase';

class Signup extends React.Component {
	constructor() {
		super();
		this.state = {
            email: '',
            password: '',
            confirm: '',
            errors: null,
            // users: []
        }
        this.handleChange = this.handleChange.bind(this);
        this.signup = this.signup.bind(this);
    }

	signup(e) {
        e.preventDefault();
        if (this.state.password !== this.state.confirm) {
            this.setState({errors: 'Passwords do not match'})
            return;
        }

		if (this.state.password === this.state.confirm){
			firebase.auth()
                .createUserWithEmailAndPassword(this.state.email, this.state.password)
			    .catch((error) => {
					this.setState({errors: error.message})
                })
        }
    }


    handleChange(e) {
		this.setState({
            [e.target.name]: e.target.value,
            errors: null
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
                        { this.state.errors ? <div> {this.state.errors} </div> : null }
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
