import React from 'react'
import Header from "./Header"
import LoginForm from "./LoginForm"

class App extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {userName: "", password: ""}
  }
  
  login = async (event) => {
    event.preventDefault()
    let username = this.state.userName
    username = escape(username)
    let password = this.state.password
    password = escape(password)
    let url = `http://localhost:3001/login`
    await fetch(url, {method: 'POST',  body: encodeURI(`username=${username}&password=${password}`), headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }, credentials: 'include'})

  }
  
  logout = async (event) => {
    event.preventDefault()
    let url = "http://localhost:3001/logout"
    await fetch(url, {method: 'GET', credentials: 'include'}) 
  }

  updateUsername = (event) => {
    event.preventDefault()
    this.setState({userName:event.target.value})    
  }

  updatePassword = (event) => {
    event.preventDefault()
    this.setState({password:event.target.value})    
    
  }

  render() {
    return ( 
      <div> 
        <Header logout={this.logout.bind(this)}></Header>
        <LoginForm login={this.login.bind(this)}
                   updateUsername={this.updateUsername.bind(this)} 
                   updatePassword={this.updatePassword.bind(this)}></LoginForm>
      </div>
      


    );
  }
}

export default App;
