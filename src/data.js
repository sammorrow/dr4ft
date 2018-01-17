try {
  var Cards = require('../data/cards')
  console.log(Cards)
  var Sets = require('../data/sets')
} catch(err) {
  Cards = {}
  Sets = {}
}

module.exports = { Cards, Sets,
  mws: require('../data/mws')
}
