function getId () {return '_' + Math.random().toString(36).substr(2, 9)}

const carReducer = function (state = {}, {type, payload}) {
  switch (type) {
    case 'NEW_CAR': {
      const id = getId()
      return {
        ...state,
        [id]: {id}
      }
    }
    default:
      return state
  }
}

exports.carReducer = carReducer
