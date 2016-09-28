import { compose, createStore, combineReducers, applyMiddleware } from 'redux'
import persistState from 'redux-localstorage'
import promiseMiddleware from 'redux-promise-middleware'
// import { list, article, login, register } from './reducers'
import { login } from './reducers'

const composeStoreWithMiddleware = applyMiddleware(
  promiseMiddleware()
)(createStore)

const enhancer = compose(
    persistState()
)

const reducer = combineReducers({login})

const store = composeStoreWithMiddleware(reducer, enhancer);

export { store }