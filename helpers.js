const fs = require('fs')

exports.moment = require('moment')

exports.dump = (obj) => JSON.stringify(obj, null, 2)

exports.icon = (name) => fs.readFileSync(`./public/images/icons/${name}`)

exports.siteName = `mLog`

exports.menu = [
  { slug: '/log', title: 'Log', icon: 'clipboard', },
  { slug: '/add', title: 'Add', icon: 'log-plus', },
  { slug: '/upcoming-maintenance', title: 'Todo', icon: 'log-clock', },
  { slug: '/search', title: 'Search', icon: 'log-search', },
]
