const {EFFECT_TYPES} = require('../sagas/effects')

function next (gen, res, sagas, store) {
  let {value, done} = gen.next(res)
  if (!done) {
    if (value && isPromise(value)) {
      resolvePromise(value, gen, sagas)
    } else if (Array.isArray(value)) {
      if (value.every(isPromise)) {
        resolvePromise(Promise.all(value), gen, sagas)
      } else {
        next(gen, value, sagas, store)
      }
    } else if (isTakeEffect(value)) {
      console.log('TAKE:', JSON.stringify(value))
      sagas.state.taking[value.action] = [
        ...(sagas.state.taking[value.action] || []),
        {type: EFFECT_TYPES.TAKE, action: value.action, task: gen}
      ]
    } else if (isPutEffect(value)) {
      console.log('PUT:', JSON.stringify(value.action))
      store.dispatch(value.action)
      next(gen, value, sagas, store)
    } else {
      next(gen, value, sagas, store)
    }
  }
}

function resolvePromise (val, gen, sagas) {
  val.then(r => {
    next(gen, r, sagas)
  })
}

function isPromise (val) {
  return typeof val.then === 'function'
}

function isEffect(effect, value) {
  const {action, type} = value
  return (action && type === effect)
}

const isPutEffect = isEffect.bind(null, EFFECT_TYPES.PUT)

const isTakeEffect = isEffect.bind(null, EFFECT_TYPES.TAKE)

function asyncCodeExecutor (gen, sagas, store) {
  next(gen, null, sagas, store)
}

exports.asyncCodeExecutor = asyncCodeExecutor