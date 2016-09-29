import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

const mapDispatchToProps = (dispatch) => {
    return {
        loadList() {
            if (this.props.list.list_ing) return

            const command = 'find'
            const arg = JSON.stringify({ collection: "contents", data: {} })
            const session = this.props.user.info ? this.props.user.info.session : ''

            dispatch({
                type: 'LIST',
                payload: fetch('/post', {
                    method: 'POST',
                    body: `command=${command}&arg=${arg}&session=${session}`
                })
                    .then((response) => {
                        if (response.status >= 200 && response.status < 300) return response.json()
                        throw new Error(`${response.status} ${response.statusText}`)
                    })
            })
        }
    }
}

const mapStateToProps = (state) => {
    return {
        user: state.user,
        list: state.list
    }
}

let List = React.createClass({
    componentDidMount() {
        !this.props.list.info.length && this.props.loadList.call(this)
    },
    render() {
        const list = this.props.list.info.map((article) => (
            <li key={article._id}>
                <Link to={'/article/' + article._id}>{article.title_1}</Link>
                <pre>{article.text_1}</pre>
            </li>
        ))

        return (
            <section className="articles-list-section">
                <ul>
                    {list}
                </ul>
            </section>
        )
    }
})

List = connect(
    mapStateToProps,
    mapDispatchToProps
)(List)

export { List }