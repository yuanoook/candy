import { compose, createStore, combineReducers, applyMiddleware } from 'redux'
import persistState from 'redux-localstorage'
import promiseMiddleware from 'redux-promise-middleware'
// import { list, article, login, register } from './reducers'
import { login } from './reducers'

const enhancer = compose(
    applyMiddleware(
        promiseMiddleware()
    ),
    persistState()
)

const reducer = combineReducers({login})

const store = createStore(reducer, enhancer);

export { store }