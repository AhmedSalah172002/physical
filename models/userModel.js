const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'name required'],
    },
    slug: {
      type: String,
      lowercase: true,
    },
    email: {
      type: String,
      required: [true, 'email required'],
      unique: true,
      lowercase: true,
    },
    phone: String,
    password: {
      type: String,
      required: [true, 'password required'],
      minlength: [6, 'Too short password'],
    },
    role: {
      type: String,
      enum: ['patient', 'doctor'],
      default: 'patient',
    },
    doctors: [
      {
        doc: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
        }
      }
    ],
    patients: [
      {
        patient: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
        }
      }
    ],
    requests: [
      {
        doc: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
        }
      }
    ],
    recives: [
      {
        patient: {
          type: mongoose.Schema.ObjectId,
          ref: 'User',
        }
      }
    ],
    
  },
  { timestamps: true }
);


userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});
userSchema.pre(/^find/, function (next) {
  const role = this.getQuery().role; // Assuming 'role' is in the query

  // Check if the role is 'patient'
  if (role === 'patient') {
    // If role is 'patient', populate 'doctors.doc' and 'requests.doc'
    this.populate('doctors.doc', 'name email phone');
    this.populate('requests.doc', 'name email phone');
  } else {
    // If role is not 'patient', populate 'patients.patient' and 'recives.patient'
    this.populate('patients.patient', 'name email phone');
    this.populate('recives.patient', 'name email phone');
  }

  next();
});
const User = mongoose.model('User', userSchema);

module.exports = User;
