import { compose, createStore, combineReducers } from 'redux'
import persistState from 'redux-localstorage'
// import { list, article, login, register } from './reducers'
import { login } from './reducers'

const enhancer = compose(
    persistState()
)

const defaultState = {}

const reducer = combineReducers({login})

const store = createStore(reducer, defaultState, enhancer);

export { store }