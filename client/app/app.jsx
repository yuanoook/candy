import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'
import { Home, Article, Login, Register, NotFound } from './components'

const App = React.createClass({
  render() {
    return (
      <div>
        {this.props.children}
      </div>
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

render(<Router history={hashHistory} routes={routes} />, document.getElementById('root'))