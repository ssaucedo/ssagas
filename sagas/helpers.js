function later (delay) {
  return new Promise(((resolve) => {
    setTimeout(resolve, delay)
  }))
}

function laterReturn (data) {
  return later(2500).then(() => data)
}

exports.helpers = {
  later,
  laterReturn,
}