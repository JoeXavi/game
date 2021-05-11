const store = require('./store')

async function add(data){
    const toCreate = {...data}
    return store.add(toCreate)
}

function list(data){
    const toSearch = {
        ...data
    }   
    return store.list(toSearch)
}

function show(id){
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return Promise.resolve('Id invalido')
    }
    return store.show({_id:id})
}

async function update(id, data){
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return Promise.resolve('Id invalido')
    }
    let res = await store.update(id, data)
    return res ? res : {}
}

module.exports = {
    add,
    list,
    update,
    show
}