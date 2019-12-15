var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var MessageSchema = new Schema(
  {
    content: {type: String, required: true,min: 1, max: 100},
    user: {type: Schema.Types.ObjectId, ref: 'User', required: true},
  }
);

// Virtual for message url
MessageSchema
.virtual('url')
.get(function () {
  return '/home/messages/'// + this.id;
});

//Export model
module.exports = mongoose.model('Message', MessageSchema);