import { createStore } from 'redux'

const defaultState = {
    toggle: false
}

const store = createStore(function(state = defaultState,action){
    switch (action.type) {
    case 'TOGGLE':
        return Object.assign({},state,{
        toggle: !state.toggle
        })
    default:
        return state
    }
})

export { store }