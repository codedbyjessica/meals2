import React from 'react';
import './App.scss';
// import Signup from './components/signup'
import Signin from './components/signin'
import { auth, logout } from './firebase';
import Footer from './components/footer';
import Meals from './components/meals/meals';

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
				<h1><strong>Welcome to Jessy's Menu</strong></h1>
				{userName ? <p>Logged in as, <span>{userName}</span>! </p> : <p>Sign in if you are Jessy</p>}

				{this.state.user ? 
					<div style={{marginTop: 10}}>
						<button onClick={this.logout}>Log Out</button> 
					</div>
					: 
					<div className="header-button-wrapper">
						<Signin showAuthForm={this.showAuthForm} showForm={this.state.showForm}></Signin>
						{this.state.showForm === "signin" && <button className='button-link' onClick={() => this.setState({showForm: null})}>Nevermind</button>}
						{/* signup works but idk how to handle users collaborating yet */}
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
				<Footer />
			</main>
		)
	}


}

export default App;
