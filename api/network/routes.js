const express = require('express')

const users = require('../components/users/network')
const games = require('../components/games/network')

const routes = function(server){
    server.use('/public', express.static('public'));
    server.use('/users',users)
    server.use('/games',games)
}

module.exports = routes