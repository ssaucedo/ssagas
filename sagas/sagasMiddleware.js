const {carReducer} = require('../reduxPlayground/carReducer')
const {store} = require('../redux/index')
const {asyncCodeExecutor} = require('../generators/index')
const {helpers} = require('./helpers')

/*
 - config
 Listen for 'NEW_CAR' and execut a generator.
 */


// start with CALL effect

/*
 An effect has the following shape:
 type: oneOf(['CALL', 'TAKE'])
 gen:  {Generator}
 */

const EFFECT_TYPES = {
  CALL: 'CALL',
  TAKE: 'TAKE',
}

const sagasExecutor = (config) => {
  const sagas = {
    effects: config.reduce((res, eff) => {
      res[eff.action] = [...(res[eff.action] || []), eff]
      return res
    }, {})
  }
  return sagasMiddleware(sagas)
}

const sagasMiddleware = sagas => store => next => action => {
  console.log('SAGAS: ',action)
  const actionEffects = sagas.effects[action.type]
  if (actionEffects && actionEffects.length !== 0) {
    for (eff of actionEffects) {
      try {
        asyncCodeExecutor(eff.gen())
      } catch (e) {
        console.log('ERROR WHILE EXECUTING TASK')
      }

    }
  }
}

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
