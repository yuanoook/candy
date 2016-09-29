const defaultState = {
    ing: false,
    error: null,
    user: null,

    out_ing: false,
    out_error: null
}

const login = (state=defaultState, action)=>{
    let user, error

    switch (action.type) {

    //handle login
    case 'LOGIN_PENDING':
        return Object.assign({}, state, {
            ing: true,
            error: null,
            user: null
        })
    case 'LOGIN_FULFILLED':
        error = action.payload ? action.payload.err : 'Unknown Error'
        user = !error ? action.payload : null
        return Object.assign({}, state, {
            ing: false,
            error: error,
            user: user
        })
    case 'LOGIN_REJECTED':
        return Object.assign({}, state, {
            ing: false,
            error: action.payload && action.payload.toString(),
            user: null
        })

    //handle logout
    case 'LOGOUT_PENDING':
        return Object.assign({}, state, {
            out_ing: true
        })
    case 'LOGOUT_FULFILLED':
        error = action.payload ? action.payload.err : 'Unknown Error'
        return Object.assign({}, state, {
            out_ing: false,
            out_error: error,
            user: null
        })
    case 'LOGOUT_REJECTED':
        return Object.assign({}, state, {
            out_ing: false,
            out_error: action.payload && action.payload.toString(),
            user: null
        })

    default:
        return state
    }
}

export { login }