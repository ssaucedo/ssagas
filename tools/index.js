const {store} = require('./redux/index')
const {sagasMiddleware} = require('./sagas/sagasMiddleware')
const {sagasExecutor, EFFECT_TYPES } = sagasMiddleware
const {helpers} = require('./sagas/helpers')

// -------------------------------------------------------------------

function* asyncBlockTest () {
    console.log('asyncBlockTest called')
    yield
}

/**
 * REDUX ACTION
 * @param action
 * @return {{type: string, action: *}}
 */
function put(action) {
    return {type: EFFECT_TYPES.PUT, action}
}

function take(action) {
    return {type: EFFECT_TYPES.TAKE, action}
}

function* asyncBlock () {
    console.log('asyncBlock start')
    yield [Promise.resolve(1), helpers.laterReturn(2)] // the second promise takes 2500ms to resolve.
    yield {a: false}
    yield take('USER_CLICK_DUDE')
    console.log('asyncBlock end')
}

function * asyncUser () {
    console.log('asyncUser start')
    console.log('user clicks')
    yield put({type: 'USER_CLICK_DUDE'})
    console.log('asyncUser completed')
}

const logMiddleware = store => next => action => {
    next(action)
}

const config = [
    {type: EFFECT_TYPES.TAKE_ALL, action: 'START_USER_INTERACTION', gen: asyncUser},
    {type: EFFECT_TYPES.TAKE_ALL, action: 'CREATE_NEW_CAR_SAGA', gen: asyncBlock},
    {type: EFFECT_TYPES.TAKE_ALL, action: 'SAGA_TEST', gen: asyncBlockTest}]

const sagaMiddleware = sagasExecutor(config)

const st = new store({car: {}}, {car: carReducer}, [logMiddleware, sagaMiddleware])

st.dispatch({type: 'CREATE_NEW_CAR_SAGA'})

setTimeout(() => {st.dispatch({type: 'START_USER_INTERACTION'})}, 3000)



// st.dispatch({type: 'CREATE_NEW_CAR_SAGA'})

// st.dispatch({type: 'CREATE_NEW_CAR_SAGA'})
