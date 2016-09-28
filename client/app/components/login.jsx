import React from 'react'
import { SubHead } from './subhead'
import { connect } from 'react-redux'

const mapDispatchToProps = (dispatch) => {
  return {
    login(e) {
        e.preventDefault()
        const email = this.email_input.value
        const password = this.password_input.value
        dispatch({
            type: 'LOGIN',
            payload: {
                email: email,
                password: password
            }
        })
    }
  }
}

const mapStateToProps = (state) => {
  return {
    login_ing: state.login_ing
  }
}

var Login = React.createClass({
    render() {
        return (
            <div className="login-section">
                <SubHead />
                <form onSubmit={this.props.login.bind(this)}>
        			<p>
                        <label>Email</label>
                        <input type="email" name="email" required ref={(c) => this.email_input = c}/></p>
        			<p>
                        <label>Password</label>
                        <input type="password" name="password" required ref={(c) => this.password_input = c}/></p>
        			<p>
        			    <label></label>
                        <button type="submit" className="long-btn">Login{this.props.login_ing ? ' ...' : ''}</button>
        			</p>
        		</form>
            </div>
        )
    }
})

Login = connect(
  mapStateToProps,
  mapDispatchToProps
)( Login )

export { Login }