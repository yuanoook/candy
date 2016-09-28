const defaultState = {
    ing: false,
    error: false
}

const login = (state=defaultState, action)=>{
    switch (action.type) {
    // case 'LOGIN':
    //     return Object.assign({}, state, {
    //         ing: true
    //     })
    case 'LOGIN_PENDING':
        return Object.assign({}, state, {
            ing: true
        })
    case 'LOGIN_FULFILLED':
        return Object.assign({}, state, {
            ing: false
        })
    case 'LOGIN_REJECTED':
        return Object.assign({}, state, {
            ing: false,
            error: true
        })
    default:
        return state
    }
}

export { login }