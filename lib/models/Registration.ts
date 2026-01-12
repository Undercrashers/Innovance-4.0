import mongoose, { Schema, Document } from 'mongoose';

export interface IRegistration extends Document {
  fullName: string;
  rollNumber: string;
  email: string;
  phone: string;
  university: string;
  gender: string;
  uniqueId: string;
  timestamp: Date;
  isPaid: boolean;
  isIDCard: boolean;
  IsFood: boolean;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

const registrationSchema = new Schema<IRegistration>(
  {
    fullName: {
      type: String,
      required: [true, 'Please provide a full name'],
      trim: true,
    },
    rollNumber: {
      type: String,
      required: [true, 'Please provide a roll number'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide an email'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide a phone number'],
      trim: true,
    },
    university: {
      type: String,
      required: [true, 'Please provide a university/hostel name'],
      trim: true,
    },
    gender: {
      type: String,
      required: [true, 'Please provide a gender'],
      enum: ['Male', 'Female', 'Other'],
    },
    uniqueId: {
      type: String,
      required: [true, 'Unique ID is required'],
      unique: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    isIDCard: {
      type: Boolean,
      default: false,
    },
    IsFood: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: 'STUDENT',
      enum: ['STUDENT', 'ADMIN', 'ORGANIZER'],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Registration ||
  mongoose.model<IRegistration>('Registration', registrationSchema);
