import React from 'react'
import { SubHead } from './subhead'

const Article = React.createClass({
    render() {
        return (
            <div>
                <SubHead />
                <h1>Article</h1>
                <p>{this.props.params.id}</p>
            </div>
        )
    }
})

export { Article }