const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  password: { type: String, required: true },
  age: { type: Number, required: true },
  gender: { type: String, required: true },
  phoneNo:{ type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  type: Number,
  token:{type:String,required:false},
  createdBy: Number ,
  createdAt: Date,
  updatedBy: Number ,
  updatedAt: Date,
  isActive: Boolean
});
// Automatically hash password before saving to MongoDB

// Method to verify passwords during login
// UserSchema.method.comparePassword = async function (candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };




module.exports = mongoose.model('User', UserSchema);