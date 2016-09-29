import React from 'react'
import { SubHead } from './subhead'
import { connect } from 'react-redux'

const mapDispatchToProps = (dispatch) => {
    return {
        loginSubmit(e) {
            e.preventDefault()
            if (this.props.login.ing) return

            const email = this.email_input.value
            const password = this.password_input.value

            dispatch({
                type: 'LOGIN',
                payload: fetch('/login', {
                    method: 'POST',
                    body: `email=${email}&password=${password}`
                })
                .then((response)=>{
                    if(response.status >= 200 && response.status < 300) return response.json()
                    throw new Error(`${response.status} ${response.statusText}`)
                })
            })
        }
    }
}

const mapStateToProps = (state) => {
    return {
        login: state.login
    }
}

var Login = React.createClass({
    render() {
        return (
            <div className="login-section">
                <SubHead />
                <form onSubmit={this.props.loginSubmit.bind(this) } ref={(c) => this.form = c}>
                    <p>
                        <label>Email</label>
                        <input type="email" name="email" required ref={(c) => this.email_input = c}/></p>
                    <p>
                        <label>Password</label>
                        <input type="password" name="password" required ref={(c) => this.password_input = c}/></p>
                    <p>
                        <label></label>
                        <button type="submit" className="long-btn">Login{this.props.login.ing ? ' ...' : ''}</button>
                    </p>
                </form>
            </div>
        )
    }
})

Login = connect(
    mapStateToProps,
    mapDispatchToProps
)(Login)

export { Login }