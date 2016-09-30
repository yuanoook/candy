import React from 'react'

const autoheightTextarea = React.createClass({
    autoResize() {
        this.textarea.style.height = 'auto'
        this.textarea.style.height = this.textarea.scrollHeight+'px'
    },
    componentDidMount() {
        this.textarea.style.overflowY = 'hidden'
        this.textarea.style.height = this.textarea.scrollHeight+'px'
    },
    render() {
        return <textarea {...this.props} onInput={this.autoResize} ref={(c) => this.textarea = c}></textarea>
    }
})

export { autoheightTextarea }