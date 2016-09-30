import React from 'react'
import { SubHead } from './subhead'
import { connect } from 'react-redux'
import { autoheightTextarea as Textarea } from './utilities/autoheight-textarea'

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
        let details = Object.keys(this.props.article).map((key)=>{
            switch ( key.split('_')[0] ) {
                //handle detail
                case 'title':
                    return  <p className="article-title" key={key}>
                                <input type="text" placeholder="Type your title" defaultValue={this.props.article[key]} disabled />
                            </p>
                case 'text':
                    return  <p className="article-text" key={key}>
                                <Textarea placeholder="Type your text" defaultValue={this.props.article[key]} disabled />
                            </p>
                case 'topublic':
                    return  <p className="article-tags" key={key}>
                                Tags: {
                                    this.props.article[key].map(
                                        (tag,index)=> <input key={index} defaultValue={tag} disabled />
                                    )
                                }
                            </p>
                default:
                    return null
            }
        })

        return (
            <section  className="article-detail-section">
                <SubHead />
                <div>
                    {details}
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