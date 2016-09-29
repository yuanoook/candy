const defaultState = {
    ed: false,
    ing: false,
    error: null,
    user: null
}

const login = (state=defaultState, action)=>{
    let user, error

    switch (action.type) {
    case 'LOGIN_PENDING':
        return Object.assign({}, state, {
            ed: false,
            ing: true,
            error: null,
            user: null
        })
    case 'LOGIN_FULFILLED':
        error = action.payload ? action.payload.err : 'Unknown Error'
        user = !error ? action.payload : null
        return Object.assign({}, state, {
            ed: true,
            ing: false,
            error: error,
            user: user
        })
    case 'LOGIN_REJECTED':
        return Object.assign({}, state, {
            ed: true,
            ing: false,
            error: action.payload && action.payload.toString(),
            user: null
        })
    default:
        return state
    }
}

export { login }