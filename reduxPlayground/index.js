const {carReducer} = require('./carReducer')
const {store} = require('../redux/index')
const {compose} = require('../redux/compose')



/**
const middleware = store => next => action => {
  if (action.type === 'RETURN_THE_NUMBER_5') {
    return 5
  } else {
    return next(action)
  }
}
**/

const log2Middleware = store => next => action => {
  console.log('LOG 2: ', action)
  next(action)
}

const logMiddleware = store => next => action => {
  console.log('LOG 1: ', action)
  next(action)
}

const st = new store({car: {}}, {car: carReducer}, [logMiddleware, log2Middleware])
console.log(st.getState())
st.dispatch({type: 'ACTION_TEST'})
st.dispatch({type: 'NEW_CAR'})
console.log(st.getState())