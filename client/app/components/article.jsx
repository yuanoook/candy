import React from 'react'
import { SubHead } from './subhead'
import { connect } from 'react-redux'

const mapDispatchToProps = (dispatch) => {
    return {
        loadArticle() {
            if (this.props.article.detail_loading) return

            const command = 'find'
            const arg = JSON.stringify({
                collection: "contents",
                data: {
                    _id: this.props.params.id
                }
            })
            const session = this.props.user.info ? this.props.user.info.session : ''

            dispatch({
                type: 'ARTICLE',
                payload: fetch('/post', {
                        method: 'POST',
                        body: `command=${command}&arg=${arg}&session=${session}`
                    })
                        .then((response) => {
                            if (response.status >= 200 && response.status < 300) return response.json()
                            throw new Error(`${response.status} ${response.statusText}`)
                        }),
                meta: {
                    _id: this.props.params.id
                }
            })
        }
    }
}

const mapStateToProps = (state, ownProps) => {
    let article = state.list.info.filter((item)=>{
        return item._id == ownProps.params.id
    })[0]

    return {
        user: state.user,
        list: state.list,
        article: article
    }
}

let Article = React.createClass({
    componentDidMount() {
        !this.props.article.detail_loaded && this.props.loadArticle.call(this)
    },
    render() {
        return (
            <section  className="article-detail-section">
                <SubHead />
                <div>
                    <p className="article-title">
                        <input type="text" placeholder="Type your title" defaultValue={this.props.article.title_1}/>
                    </p>
                    <p className="article-text">
                        <textarea placeholder="Type your text" defaultValue={this.props.article.text_1}></textarea>
                    </p>
                </div>
            </section>
        )
    }
})

Article = connect(
    mapStateToProps,
    mapDispatchToProps
)(Article)

export { Article }