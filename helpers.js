const fs = require('fs')
exports.moment = require('moment')
exports.dump = (obj) => JSON.stringify(obj, null, 2)

exports.icon = (name) => fs.readFileSync(`./public/images/icons/${name}.svg`)
exports.siteName = `mLog`

exports.menu = [
  { slug: '/log', title: 'Log', icon: 'map', },
  { slug: '/add', title: 'Add', icon: 'add', },
  { slug: '/upcoming-maintenance', title: 'Todo', icon: 'tag', },
  { slug: '/search', title: 'Search', icon: 'top', }
]
