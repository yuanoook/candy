const defaultState = {
    ing: false
}

const login = (state=defaultState, action)=>{console.log(state, action)
    switch (action.type) {
    case 'LOGIN':
        return Object.assign({}, state, {
            ing: true
        })
    default:
        return state
    }
}

export { login }