const {handleAction} = require('./internals')
const {EFFECT_TYPES} = require('./effects')


const sagasExecutor = (config) => {
  const sagas = {
    register: config.reduce((red, ef) => {
      red[ef.type] = (red[ef.type] || {})
      red[ef.type][ef.action] = (red[ef.type][ef.action] || [])
      red[ef.type][ef.action] = [...red[ef.type][ef.action], {
        type: ef.type, action: ef.action, gen: ef.gen,
      }]
      return red
    }, {}),
    state: {
      inProgress: {},
      taking: {}
    },
    history: {}
  }

  return sagasMiddleware(sagas)
}

const sagasMiddleware = sagas => store => next => action => {
  handleAction(action, sagas, store)
}

exports.sagasMiddleware = {
  sagasExecutor,
  EFFECT_TYPES,
}
