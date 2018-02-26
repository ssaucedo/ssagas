const {carReducer} = require('./carReducer')
const {store} = require('./redux/index')
const {sagasMiddleware} = require('./sagas/sagasMiddleware')
const {sagasExecutor, EFFECT_TYPES } = sagasMiddleware
const {helpers} = require('./sagas/helpers')

// -------------------------------------------------------------------

function* asyncBlockTest () {
  console.log('asyncBlockTest called')
  yield
}

function* asyncBlock () {
  console.log('asyncBlock start')
  yield [Promise.resolve(1), helpers.laterReturn(2)] // the second promise takes 2500ms to resolve.
  yield {a: false}
  console.log('asyncBlock end')
}

const logMiddleware = store => next => action => {
  console.log('LOG: ', action)
  next(action)
}

const config = [
  {type: EFFECT_TYPES.TAKE, action: 'CREATE_NEW_CAR_SAGA', gen: asyncBlock},
  {type: EFFECT_TYPES.TAKE, action: 'SAGA_TEST', gen: asyncBlockTest}]

const sagaMiddleware = sagasExecutor(config)

const st = new store({car: {}}, {car: carReducer}, [logMiddleware, sagaMiddleware])

st.dispatch({type: 'CREATE_NEW_CAR_SAGA'})

st.dispatch({type: 'CREATE_NEW_CAR_SAGA'})

st.dispatch({type: 'CREATE_NEW_CAR_SAGA'})
