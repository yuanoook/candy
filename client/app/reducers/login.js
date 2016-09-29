const defaultState = {
    ing: false,
    error: false
}

const login = (state=defaultState, action)=>{
    switch (action.type) {
    case 'LOGIN_PENDING':
        return Object.assign({}, state, {
            ing: true
        })
    case 'LOGIN_FULFILLED':
        console.log(action)
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