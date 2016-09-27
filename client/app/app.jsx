import React from 'react'
import { render } from 'react-dom'
import { Router, Route, IndexRoute, Link, hashHistory } from 'react-router'
import { Home, Article, Login, Register } from './components'

const About = React.createClass({
    render:()=>(
        <Article />
    )
})
const NoMatch = React.createClass({
    render:()=>(
        <Login />
    )
})

const App = React.createClass({
  render() {
    return (
      <div>
        <h1>App</h1>
        {/* change the <a>s to <Link>s */}
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/login">login</Link></li>
          <li><Link to="/login/register">register</Link></li>
        </ul>
        {this.props.children}
      </div>
    )
  }
})

const routes = {
  path: '/',
  component: App,
  indexRoute: { component: Home },
  childRoutes: [
    { path: 'about', component: About },
    { path: 'login', component: Login , childRoutes: [
      {
        path: 'register', component: Register
      }
    ]},
  ]
}

render(<Router history={hashHistory} routes={routes} />, document.getElementById('root'))