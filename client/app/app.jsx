import React from 'react'
import { render } from 'react-dom'
import { Router, hashHistory as History } from 'react-router'
import { Provider } from 'react-redux'
import { Home, Article, Login, Register, NotFound } from './components'
import { store } from './store'

const App = React.createClass({
  render() {
    return (
      <Provider store={store}>
        {this.props.children}
      </Provider>
    )
  }
})

const routes = [
  {
    path: '/',
    component: App,
    indexRoute: { component: Home },
    childRoutes: [
      { path: 'article/:id', component: Article },
      { path: 'register', component: Register },
      { path: 'login', component: Login }
    ]
  },
  {
    path: '*',
    component: NotFound
  }
]

render(<Router history={History} routes={routes} />, document.getElementById('root'))