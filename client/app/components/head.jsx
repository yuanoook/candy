import React from 'react'
import { Link } from 'react-router'

const Head = React.createClass({
    render: ()=>(
        <ul className="head-nav">
          <li><Link to="/">Home</Link></li>
          <li><Link to="/login">login</Link></li>
          <li><Link to="/register">register</Link></li>
          <li><Link to="/404">404</Link></li>
        </ul>
    )
})

export { Head }