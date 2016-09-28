import React from 'react'
import { hashHistory } from 'react-router'

const SubHead = React.createClass({
    contextTypes: {
        router: React.PropTypes.object.isRequired
    },
    goBack(e) {
        window.history.length ? this.context.router.goBack() : this.context.router.push('/')
    },
    render() {
        return (
            <ul className="head-nav-section">
                <li>
                    <a onClick={this.goBack} className="close-cross">
                        <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" version="1.1" stroke="#000" strokeWidth="2">
                            <line x1="5" y1="5" x2="55" y2="55"></line>
                            <line x1="5" y1="55" x2="55" y2="5"></line>
                        </svg>
                    </a>
                </li>
            </ul>
        )
    }
})

export { SubHead }
                