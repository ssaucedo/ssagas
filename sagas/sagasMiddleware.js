const {asyncCodeExecutor} = require('../generators/index')
const {handleAction} = require('./internals')

const EFFECT_TYPES = {
  CALL: 'CALL',
  TAKE: 'TAKE',
  TAKE_ALL: 'TAKE_ALL',
  TAKE_ONE: 'TAKE_ONE',
  TAKE_LATEST: 'TAKE_LATEST',
  TAKE_AND_DELAY: 'TAKE_AND_DELAY',
}

function or(value) {
  return value !== undefined ? value : []
}

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
  handleAction(action, sagas)
}

exports.sagasMiddleware = {
  sagasExecutor,
  EFFECT_TYPES,
}