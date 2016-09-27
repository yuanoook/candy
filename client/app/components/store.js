import { compose, createStore } from 'redux'
import persistState from 'redux-localstorage'

const enhancer = compose(
    persistState()
)

const defaultState = {
    toggle: false
}

const reducer = (state, action) => {
    switch (action.type) {
    case 'TOGGLE':
        return Object.assign({},state,{
        toggle: !state.toggle
        })
    default:
        return state
    }
}

const store = createStore(reducer, defaultState, enhancer);

export { store }