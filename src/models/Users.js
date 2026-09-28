import mongoose from "mongoose";

// סכמה פנימית לשם המשתמש
const nameSchema = new mongoose.Schema({
  first: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 256,
  },
  middle: { type: String, trim: true, default: "" },
  last: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 256,
  },
});

// סכמה פנימית לתמונה
const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    trim: true,
    default:
      "https://cdn.pixabay.com/photo/2016/04/01/10/11/avatar-1299805_960_720.png",
  },
  alt: {
    type: String,
    trim: true,
    default: "business card image",
  },
});

// סכמה פנימית לכתובת
const addressSchema = new mongoose.Schema({
  state: { type: String, trim: true, default: "not defined" },
  country: { type: String, required: true, trim: true },
  city: { type: String, required: true, trim: true },
  street: { type: String, required: true, trim: true },
  houseNumber: { type: Number, required: true, min: 1 },
  zip: { type: Number, default: 0 },
});

// הסכמה הראשית של המשתמש
const userSchema = new mongoose.Schema({
  name: { type: nameSchema, required: true },
  phone: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true, // דרישה: אימייל ייחודי
    lowercase: true,
    trim: true,
  },
  password: { type: String, required: true },
  image: { type: imageSchema, default: () => ({}) },
  address: { type: addressSchema, required: true },
  isAdmin: { type: Boolean, default: false },
  isBusiness: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
export default User;
