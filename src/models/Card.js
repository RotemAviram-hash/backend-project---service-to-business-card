import mongoose from "mongoose";

// Schema for the card image
const imageSchema = new mongoose.Schema({
  url: {
    type: String,
    trim: true,
    default:
      "https://cdn.pixabay.com/photo/2016/04/20/08/21/entrepreneur-1340649_960_720.png",
  },
  alt: {
    type: String,
    trim: true,
    default: "business card image",
  },
});

// Schema for the card address
const addressSchema = new mongoose.Schema({
  state: {
    type: String,
    trim: true,
    default: "not defined",
  },
  country: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  street: {
    type: String,
    required: true,
    trim: true,
  },
  houseNumber: {
    type: Number,
    required: true,
    min: 1,
  },
  zip: {
    type: Number,
    default: 0,
  },
});

// Card Schema
const cardSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 256,
  },

  subtitle: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 256,
  },

  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 1024,
  },

  phone: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },

  web: {
    type: String,
    trim: true,
    default: "",
  },

  image: {
    type: imageSchema,
    default: () => ({}),
  },

  address: {
    type: addressSchema,
    required: true,
  },

  bizNumber: {
    type: Number,
    required: true,
    unique: true,
  },

  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],

  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Card = mongoose.model("Card", cardSchema);

export default Card;
