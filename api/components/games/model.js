const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schemaOptions = {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },  
}

const participant = new Schema({
  _id: Schema.Types.ObjectId,
  name: {type: String},
})

const mySchema = new Schema({
  status: {
    type: String,
    default: 'Active'
  },
  participants:{
    creator:participant,
    guess: participant
  },
  winner: {
    type: String,
    default: ''
  }
},schemaOptions)

const model = mongoose.model('games',mySchema);
module.exports = model
