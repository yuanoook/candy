import React from 'react'

const Login = React.createClass({
    render(){
        return (
            <div>
                <div>Login</div>
                {this.props.children}
            </div>
        )
    }
})

export { Login }