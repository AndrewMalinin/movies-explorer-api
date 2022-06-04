const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
    minlength: 3,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^(https?:\/\/)(www\.)?([\w\-._~:/?#[\]@!$&'()*+,;=]+)/.test(value),
      message: (props) => `Значение: ${props.value} имеет неверный формат!`,
    },
  },
  trailerLink: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^(https?:\/\/)(www\.)?([\w\-._~:/?#[\]@!$&'()*+,;=]+)/.test(value),
      message: (props) => `Значение: ${props.value} имеет неверный формат!`,
    },
  },
  thumbnail: {
    type: String,
    required: true,
    validate: {
      validator: (value) => /^(https?:\/\/)(www\.)?([\w\-._~:/?#[\]@!$&'()*+,;=]+)/.test(value),
      message: (props) => `Значение: ${props.value} имеет неверный формат!`,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: String,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', userSchema);
