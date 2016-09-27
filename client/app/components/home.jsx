import React from 'react'
import { Head } from './head'
import { List } from './list'

const Home = React.createClass({
    render: ()=>(
        <div>
            <Head />
            <List />
        </div>
    )
})

export { Home }