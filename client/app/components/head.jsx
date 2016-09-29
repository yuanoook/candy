import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

const mapDispatchToProps = (dispatch) => {
    return {
        logoutSubmit(e) {
            e.preventDefault()
            if (this.props.user.out_ing) return

            dispatch({
                type: 'LOGOUT',
                payload: fetch('/logout', {
                    method: 'POST',
                    body: `session=${this.props.user.info.session}`
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

let Head = React.createClass({
    render() {
        return this.props.user.info
            ?   <ul className="head-nav-section">
                    <li>
                    {
                        this.props.user.out_ing 
                        ? <span>Out ...</span>
                        : <a href="javascript:;" onClick={this.props.logoutSubmit.bind(this)}>Logout</a>
                    }
                    </li>
                    <li><span>{this.props.user.info.name}</span></li>
                </ul>
            :   <ul className="head-nav-section">
                    <li><Link to="/register">Register</Link></li>
                    <li><Link to="/login">Login</Link></li>
                </ul>
    }
})

Head = connect(
    mapStateToProps,
    mapDispatchToProps
)(Head)

export { Head }