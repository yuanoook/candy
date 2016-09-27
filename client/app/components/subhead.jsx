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
            <ul className="head-nav">
                <li><a onClick={this.goBack}>X</a></li>
            </ul>
        )
    }
})

export { SubHead }
                