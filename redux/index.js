const {compose} = require('./compose')

/*

 Read https://github.com/reactjs/redux/blob/master/docs/recipes/reducers/BeyondCombineReducers.md
 Read https://github.com/reactjs/redux/blob/master/src/applyMiddleware.js

 Comments:
 On this basic implementation reducers is an object whose values are reducer functions.
 On redux combine reducers strictly combines the reducers returning a new one.
 On redux there is a isDispatching boolean that works blocks the users from dispatching an action from a
 reducer. We don't need that now.
 This implementation does not support store enhancers. The store constructor function might receive an array of
 middlewares that are going to be executed on action dispatching.
 */

/**
 * @param {*} defaultState
 * @param {*} reducers
 * @param {*} middlewares
 */
const store = function (defaultState, reducers, middlewares) {

  _reduxDispatch = _reduxDispatch.bind(this)

  this.state = defaultState

  this.reducers = reducers

  this.middlewares = _applyMiddlewares(middlewares || [])

  this.listeners = []

  this.getState = function () {
    return this.state
  }

  this.subscribe = function (listener) {
    this.listeners = [...this.listeners, listener]
  }

  this.dispatch = function (action) {
    this.middlewares(action)
  }

  function _reduxDispatch (action) {
    for (rk of Object.keys(this.reducers)) {
      this.state = {
        ...this.state,
        [rk]: this.reducers[rk](this.state[rk], action)
      }
    }

    this.listeners.forEach(lis => {
      lis(this.state)
    })
  }

  function _applyMiddlewares (middlewares) {
    const chain = middlewares.map(m => m({
      dispatch: this.dispatch,
      state: this.state,
    }))

    return compose(...chain)(_reduxDispatch)
  }

}

exports.store = store
