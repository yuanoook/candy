import { compose, createStore } from 'redux'
import persistState from 'redux-localstorage'

const enhancer = compose(
    persistState()
)

const defaultState = {
    login_ing: false
}

const reducer = (state, action) => {
    switch (action.type) {
    case 'LOGIN':
        return Object.assign({},state,{
            login_ing: true
        })
    default:
        return state
    }
}

const store = createStore(reducer, defaultState, enhancer);

export { store }