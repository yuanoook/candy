import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

const Head = React.createClass({
    render() {
        return (
            <ul className="head-nav-section">
                <li><Link to="/login">login</Link></li>
                <li><Link to="/register">register</Link></li>
            </ul>
        )
    }
})

export { Head }