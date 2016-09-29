import React from 'react'
import { SubHead } from './subhead'
import { connect } from 'react-redux'

const mapDispatchToProps = (dispatch) => {
    return {
        loginSubmit(e) {
            e.preventDefault()
            if (this.props.user.log_ing) return

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
        user: state.user
    }
}

let Login = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    goBack(e) {
        window.history.length ? this.context.router.goBack() : this.context.router.push('/')
    },
    componentWillReceiveProps(nextProps) {
        // goBack if login success
        nextProps.user && nextProps.user.info && this.goBack()
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        return !(nextProps.user && nextProps.user.info)
    },
    render() {
        return (
            <div className="user-io-section">
                <SubHead />
                <form onSubmit={this.props.loginSubmit.bind(this)}>
                    <p>
                        <label>Email</label>
                        <input type="email" required ref={(c) => this.email_input = c}/>
                    </p>
                    <p>
                        <label>Password</label>
                        <input type="password" required ref={(c) => this.password_input = c}/>
                    </p>
                    <p>
                        <label></label>
                        <button type="submit" className="long-btn">{this.props.user.log_ing ? 'In ...' : 'Login'}</button>
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