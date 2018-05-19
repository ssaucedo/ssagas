const {EFFECT_TYPES} = require('./effects')
const {asyncCodeExecutor} = require('../generators/index')



/**
const sagas = {
  register: {
    [EFFECT_TYPES.TAKE_ALL]: {
      SAGA_TEST: [{type: EFFECT_TYPES.TAKE, action: 'SAGA_TEST', gen: {}}],
    },
    [EFFECT_TYPES.TAKE_LATEST]: {},
  },
  state: {
    inProgress: {},
    taking: {
      SAGA_TEST: [
        {type: EFFECT_TYPES.TAKE, action: 'SAGA_TEST', task: {}}
      ],
    }
  },
  history: {}
}

**/

// Base tasks are: TakeEvery/ TakeLatest

function handleAction (action, sagas, store) {
  // sagas.register exectute and add to InProgress.
  const {type} = action
  const taskBuilders = (sagas.register[EFFECT_TYPES.TAKE_ALL][type]|| [])
  taskBuilders.forEach(taskBuilder => {
    const task = taskBuilder.gen()
    sagas.state.inProgress = moveToInProgress(taskBuilder.action, task, type, sagas)
    asyncCodeExecutor(task, sagas, store)
  })

  const takingTasks = (sagas.state.taking[type] || [])
  takingTasks.forEach(takingTask => {
    const {task} = takingTask
    sagas.state.inProgress = moveToInProgress(takingTask.action, takingTask.task, type, sagas)
    asyncCodeExecutor(task, sagas, store)
  })

  sagas.state.taking[action] = []
}

function moveToInProgress (action, task, type, sagas) {
  return {
    ...sagas.state.inProgress,
    [action]: [...(sagas.state.inProgress[action] || []), {
      type, action, task,
    }]
  }
}

exports.handleAction = handleAction
