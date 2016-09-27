import React from 'react'
import { Link } from 'react-router'
import { connect } from 'react-redux'

const mapDispatchToProps = (dispatch) => {
  return {
    toggleNav() {
      dispatch({
          type: 'TOGGLE'
      })
    }
  }
}

const mapStateToProps = (state) => {
  return {
    toggle: state.toggle
  }
}

var Head = React.createClass({
    render() {
        return (
            <ul className="head-nav" style={{
                background: this.props.toggle ? 'red' : 'gray'
            }}>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/login">login</Link></li>
                <li><Link to="/register">register</Link></li>
                <li><Link to="/404">404</Link></li>
                <li><a href="javascript:;" onClick={this.props.toggleNav}>Toggle</a></li>
            </ul>
        )
    }
})

Head = connect(
  mapStateToProps,
  mapDispatchToProps
)( Head )

export { Head }