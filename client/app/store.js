import { compose, createStore, combineReducers, applyMiddleware } from 'redux'
import persistState from 'redux-localstorage'
import promiseMiddleware from 'redux-promise-middleware'
// import { list, article, login, register } from './reducers'
import { login } from './reducers'

const enhancer = compose(
    applyMiddleware(
        promiseMiddleware()
    ),
    persistState([
        'login'
    ], {
        key: 'redux-loc',
        slicer: (paths)=>{
            return (state)=>{
                let subset = {}
                paths.forEach((path) => {
                    if(path==='login'){
                        subset[path] = {}
                        subset[path]['user'] = state[path]['user']
                    }else{
                        subset[path] = state[path]
                    }
                })
                return subset
            }
        }
    })
)

const reducer = combineReducers({login})

const store = createStore(reducer, enhancer);

export { store }