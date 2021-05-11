const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },  
}


const mySchema = new Schema({
  status: {
    type: String,
    default: 'Active'
  },
  name: {type: String},
},schemaOptions)

const model = mongoose.model('users',mySchema);
module.exports = model
