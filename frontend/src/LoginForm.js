const LoginForm = (props) => {
    return (
        <body>
            <div className="container">
                <div className="bg-white jumbotron">
                    <h1 className="text-center">Login</h1> 
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input type="text" className="form-control" id="username" onChange={props.updateUsername}></input>
                    </div>
                    <div className="form-group">
                        <label htmlFor="pwd">Password:</label>
                        <input type="password" className="form-control" id="pwd" onChange={props.updatePassword}></input>
                    </div>
                    <div className="btn btn-primary btn-lg" onClick={props.login}>Login</div>
                </div>
            </div>
        </body>
    );
  }
  export default LoginForm;