import React from 'react'
import { Link } from 'react-router'

const List = React.createClass({
    render(){
        const list = [
            'a', 'b', 'c', 'd'
        ].map((item,index)=>(
            <li key={index}>
                {item}
                <Link to={'/article/'+item}>more></Link>
            </li>
        ))

        return (
            <section className="articles-list-section">
                <ul>
                    {list}
                </ul>
            </section>
        )
    }
})

export { List }