const {EFFECT_TYPES} = require('./constants')

const isEffect = effect => Object.values(EFFECT_TYPES).some(type => type === effect.type);

const handleEffect = (sagas, dispatch, state) => (effect) => {
     if (isEffect(effect)) {
       /**
        * Handles TAKE effect.
        * 1) Registers EFFECT on taking list in sagas.
        */
       if (isTakeEffect(value)) {
         console.log('TAKE:', JSON.stringify(value))
         sagas.state.taking[value.action] = [...(sagas.state.taking[value.action] || []), {type: EFFECT_TYPES.TAKE, action: value.action, task: gen}]
       }
          /**
           *  Handles PUT effect.
           *  1) Dispatches action.
           *  2) Continue execution.
           */
       if (isPutEffect(value)) {
         dispatch(value.action)
         next(gen, {}, sagas, store)
       }

          /**
           *  Handles PUT effect.
           *  1) Dispatches action.
           *  2) Continue execution.
           */
       if (isSelectEffect(value)) {
         // requires access to store.getState();
         next(gen, {message: 'Selected from state'}, sagas, store)
       }
         /**
          *  Over a generator. yield *
          */
       if (isCallEffect(value)) {
         // requires access to store.getState();
         next(gen, {message: 'Selected from state'}, sagas, store)
       }

     } return {
       // HANDLE ERROR.
     }
};


const _isEffect = (effect, value) => {
    const {action, type} = value
    return (action && type === effect)
};

function isSelectEffect() {
    return _isEffect.bind(null, EFFECT_TYPES.SELECT);
}

function isCallEffect() {
    return _isEffect.bind(null, EFFECT_TYPES.CALL);
}

function isPutEffect() {
    return _isEffect.bind(null, EFFECT_TYPES.PUT);
}

function isTakeEffect() {
    return _isEffect.bind(null, EFFECT_TYPES.TAKE);
}

exports.handleEffect = handleEffect;
exports.isEffect = isEffect;
