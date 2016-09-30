import { compose, createStore, combineReducers, applyMiddleware } from 'redux'
import persistState from 'redux-localstorage'
import promiseMiddleware from 'redux-promise-middleware'
// import { list, article, user } from './reducers'
import { list, user } from './reducers'

const enhancer = compose(
    applyMiddleware(
        promiseMiddleware()
    ),
    persistState([
        'user',
        'list'
    ], {
        key: 'redux-loc',
        slicer: (paths)=>{
            return (state)=>{
                let subset = {}
                paths.forEach((path) => {
                    if(path==='user'){
                        subset[path] = {}
                        subset[path]['info'] = state[path]['info']
                    }else{
                        subset[path] = state[path]
                    }
                })
                return subset
            }
        }
    })
)

const reducer = combineReducers({ list, user })

const store = createStore(reducer, enhancer);

export { store }