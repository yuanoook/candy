import React from 'react'
import { SubHead } from './subhead'
import { connect } from 'react-redux'

const mapDispatchToProps = (dispatch) => {
    return {
        loginSubmit(e) {
            e.preventDefault()
            if (this.props.login.reg_ing) return

            const name = this.name_input.value
            const email = this.email_input.value
            const password = this.password_input.value

            dispatch({
                type: 'REGISTER',
                payload: fetch('/register', {
                    method: 'POST',
                    body: `name=${name}&email=${email}&password=${password}`
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

let Register = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    goBack(e) {
        window.history.length ? this.context.router.goBack() : this.context.router.push('/')
    },
    componentWillReceiveProps(nextProps) {
        // goBack if login success
        nextProps.login && nextProps.login.user && this.goBack()
    },
    shouldComponentUpdate: function(nextProps, nextState) {
        return !(nextProps.login && nextProps.login.user)
    },
    render() {
        return (
            <div className="login-section">
                <SubHead />
                <form onSubmit={this.props.loginSubmit.bind(this)}>
                    <p>
                        <label>Name</label>
                        <input type="text" required ref={(c) => this.name_input = c}/>
                    </p>
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
                        <button type="submit" className="long-btn">{this.props.login.reg_ing ? 'In ...' : 'Register'}</button>
                    </p>
                </form>
            </div>
        )
    }
})

Register = connect(
    mapStateToProps,
    mapDispatchToProps
)(Register)

export { Register }