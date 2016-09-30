import React from 'react'
import { render } from 'react-dom'
import { Router, hashHistory as History, applyRouterMiddleware } from 'react-router'
import { useHistoryRestoreScroll, useRouterRestoreScroll } from 'react-router-restore-scroll'
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

const routerHistory = useHistoryRestoreScroll(() => History)()
const routerRender = applyRouterMiddleware(
  useRouterRestoreScroll()
)

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

render(<Router history={routerHistory} routes={routes} render={routerRender}/>, document.getElementById('root'))