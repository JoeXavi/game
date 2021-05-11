const Model = require ('./model');

function add(data){
    const myData = new Model(data)
    return myData.save();   
}


async function list(toSearch){
    // let result = await Model.find({
     //  status:'Active'
    // });
    let result = await new Promise(function(resolve, reject){
        Model.find(toSearch).sort({_id:-1})
        .exec(function(err, res){
            if(err)
            return reject(err)
    
            return resolve(res)
        });
    })
    return result
}

async function show(search){
    return await new Promise(function(resolve, reject){
        Model.findOne(search)
        .exec(function(err, res){
            if(err)
            return reject(err)
            
            if(res)
                return resolve(res)
            else
                return resolve({})
        })
    })
}


async function update(id, data){
    return new Promise(function (resolve, reject){
        Model.findOneAndUpdate({_id:id}, data, {new: true},function(err, doc){
        if(err)
            reject(err)
        
        resolve(doc)
        })
    })
}

module.exports = {
    add,
    list,
    update,
    show
}

