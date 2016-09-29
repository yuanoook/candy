const defaultState = {
    log_ing: false,
    log_error: null,
    info: null,

    out_ing: false,
    out_error: null,

    reg_ing: false,
    reg_error: null
}

const user = (state=defaultState, action)=>{
    let info, error

    switch (action.type) {

    //handle login
    case 'LOGIN_PENDING':
        return Object.assign({}, state, {
            log_ing: true,
            log_error: null,
            info: null
        })
    case 'LOGIN_FULFILLED':
        error = action.payload ? action.payload.err : 'Unknown Error'
        info = !error ? action.payload : null
        return Object.assign({}, state, {
            log_ing: false,
            log_error: error,
            info: info
        })
    case 'LOGIN_REJECTED':
        return Object.assign({}, state, {
            log_ing: false,
            log_error: action.payload && action.payload.toString(),
            info: null
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
            info: null
        })
    case 'LOGOUT_REJECTED':
        return Object.assign({}, state, {
            out_ing: false,
            out_error: action.payload && action.payload.toString(),
            info: null
        })

    //handle register
    case 'REGISTER_PENDING':
        return Object.assign({}, state, {
            reg_ing: true,
            reg_error: null,
            info: null
        })
    case 'REGISTER_FULFILLED':
        error = action.payload ? action.payload.err : 'Unknown Error'
        info = !error ? action.payload : null
        return Object.assign({}, state, {
            reg_ing: false,
            reg_error: error,
            info: info
        })
    case 'REGISTER_REJECTED':
        return Object.assign({}, state, {
            reg_ing: false,
            reg_error: action.payload && action.payload.toString(),
            info: null
        })

    default:
        return state
    }
}

export { user }