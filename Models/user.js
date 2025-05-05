const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
    name: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, required: true},
}, {
    timestamps: true
  });

// encrypt before saving
userSchema.pre('save', async function(next){
    if (!this.isModified('password')){
        next();
    };
    this.password = await bcrypt.hash(this.password, 10);
});

module.exports = mongoose.model('user', userSchema);