const defaultState = {
    list_ing: false,
    list_error: null,
    info: []
}

const updateArticleInList = (list = [], _id, obj) => {
    let article_index = 0
    let article = list.filter((item, index)=>{
        if( item._id == _id ){
            article_index = index
            return true
        }
    })[0]
    let temp_list = {}
    temp_list[article_index] = Object.assign({}, article, obj)
    return Object.assign([], list, temp_list)
}

const list = (state = defaultState, action) => {
    let info, error, article

    switch (action.type) {

        //handle list
        case 'LIST_PENDING':
            return Object.assign({}, state, {
                list_ing: true,
                list_error: null,
                info: []
            })
        case 'LIST_FULFILLED':
            error = action.payload ? action.payload.err : 'Unknown Error'
            info = !error ? action.payload : null
            return Object.assign({}, state, {
                list_ing: false,
                list_error: error,
                info: info
            })
        case 'LIST_REJECTED':
            return Object.assign({}, state, {
                list_ing: false,
                list_error: action.payload && action.payload.toString(),
                info: []
            })

        //handle list
        case 'ARTICLE_PENDING':console.log(action)
            return Object.assign({}, state, {
                info: updateArticleInList(state.info, action.meta._id, {
                    detail_loaded: false,
                    detail_loading: true,
                    detail_error: null
                })
            })
        case 'ARTICLE_FULFILLED':console.log(action)
            error = action.payload ? action.payload.err : 'Unknown Error'
            error = !error ? (action.payload[0] ? action.payload.err : 'Unknown Error') : error
            article = !error ? action.payload[0] : null
            return Object.assign({}, state, {
                info: updateArticleInList(
                    state.info,
                    action.meta._id,
                    Object.assign({
                        detail_loaded: true,
                        detail_loading: false,
                        detail_error: error
                    },article)
                )
            })
        case 'ARTICLE_REJECTED':console.log(action)
            return Object.assign({}, state, {
                info: updateArticleInList(
                    state.info,
                    action.meta._id,
                    Object.assign({
                        detail_loaded: false,
                        detail_loading: false,
                        detail_error: action.payload && action.payload.toString()
                    },article)
                )
            })

        default:
            return state
    }
}

export { list }