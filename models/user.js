var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema(
  {
    username: {type: String, required: true,min: 1, max: 20},
    content: [{type: Schema.Types.ObjectId, ref: 'Message'}]
  }
);

// Virtual for user url
UserSchema
.virtual('url')
.get(function () {
  return '/home/user/' + this.id;
});

//Export model
module.exports = mongoose.model('User', UserSchema);