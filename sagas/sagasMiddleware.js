const {asyncCodeExecutor} = require('../generators/index')


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

exports.sagasMiddleware = {
  sagasExecutor,
  EFFECT_TYPES,
}