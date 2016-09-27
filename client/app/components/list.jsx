import React from 'react'

const List = React.createClass({
    render(){
        const list = [
            'a', 'b', 'c', 'd'
        ].map((item,index)=>(
            <li key={index}>{item}</li>
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