import React from 'react'
import { SubHead } from './subhead'

const Login = React.createClass({
    render() {
        return (
            <div>
                <SubHead />
                <div>Login</div>
                {this.props.children}
            </div>
        )
    }
})

export { Login }