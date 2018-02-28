const EFFECT_TYPES = {
  CALL: 'CALL',
  TAKE: 'TAKE',
  TAKE_ALL: 'TAKE_ALL',
  TAKE_ONE: 'TAKE_ONE',
  TAKE_LATEST: 'TAKE_LATEST',
  TAKE_AND_DELAY: 'TAKE_AND_DELAY',
}

function next (gen, res, sagas) {
  let {value, done} = gen.next(res)
  if (!done) {
    if (value && isPromise(value)) {
      resolvePromise(value, gen, sagas)
    } else if (Array.isArray(value)) {
      if (value.every(isPromise)) {
        resolvePromise(Promise.all(value), gen, sagas)
      } else {
        next(gen, value, sagas)
      }
    } else if (isTakeEffect(value)) {
      console.log('isTakeEffect')
      sagas.state.taking[value.action] = [
        ...(sagas.state.taking[value.action] || []),
        {type: EFFECT_TYPES.TAKE, action: value.action, task: gen}
      ]
    } else {
      next(gen, value, sagas)
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

function isTakeEffect (value) {
  const {action, type} = value
  return (action && type === EFFECT_TYPES.TAKE)
}

function asyncCodeExecutor (gen, sagas) {
  next(gen, null, sagas)
}

exports.asyncCodeExecutor = asyncCodeExecutor