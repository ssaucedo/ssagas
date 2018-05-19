/**
 * This is redux compose implementation.
 * @param {*} funcs
 */


function compose (...funcs) {
  if (funcs.length === 0) {
    return arg => arg
  }

  if (funcs.length === 1) {
    return funcs[0]
  }

  return funcs.reduce((a, b) => (...args) => a(b(...args)))
}

exports.compose = compose

/**
 // Test

 const toCompose = text => next => action => {
  console.log(text)
  console.log(action)
  console.log(next.name || 'annon')
  return next(action)
}

 const composed = compose(
 toCompose('one'),
 toCompose('two'),
 toCompose('three'),
 )(function dispatch() {console.log('NEXT')})


 composed({type: 'TEST_ACTION'})
 **/