const defaultState = {
    list_ing: false,
    list_error: null,
    info: []
}

const list = (state = defaultState, action) => {
    let info, error

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

        default:
            return state
    }
}

export { list }