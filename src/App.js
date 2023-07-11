import React from 'react';
import './App.scss';
// import Signup from './components/signup'
import Signin from './components/signin'
import Meals from './components/meals'
import { auth, logout } from './firebase';

console.log(auth)

class App extends React.Component {
	constructor() {
		super();
		this.state = {
			user: null,
			showForm: null,
		}
		this.showAuthForm = this.showAuthForm.bind(this)
	}

	componentDidMount() {
		auth.onAuthStateChanged((user) => {
			console.log('user', user)
			if (user) {
				this.setState({ user });
			} 
		});
	}

	logout  = () => {
		const onSuccess = () => this.setState({user: null})
		logout(onSuccess)
	}

	showAuthForm(id) {
		this.setState({showForm: id})
	}

	renderUser() {
		const userName = this.state.user ? this.state.user.email : null

		return (
			<div className='header-user'>
				{userName ? <p>Welcome, <span>{userName}</span>! </p> : <p>Hello.</p>}

				{this.state.user ? 
					<div style={{marginTop: 10}}>
						<button onClick={this.logout}>Log Out</button> 
					</div>
					: 
					<div className="header-button-wrapper">
						<Signin showAuthForm={this.showAuthForm} showForm={this.state.showForm}></Signin>
						{this.state.showForm === "signin" && <button className='button-link' onClick={() => this.setState({showForm: null})}>Nevermind</button>}
						{/* <Signup showAuthForm={this.showAuthForm} showForm={this.state.showForm}></Signup> */}
					</div>
				}  
			</div>

		);
	}

	render() {
		return (
			<main>
				<header>{this.renderUser()}</header>
				<Meals user={this.state.user} />
				<footer>
					just a place for <a href="https://codedbyjessica.com/" target="_blank" rel="noreferrer">me</a> to keep my recipes in one place <br />
					</footer>
			</main>
		)
	}


}

export default App;
