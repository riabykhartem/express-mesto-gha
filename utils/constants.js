const URL_REGEX = /^https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b(?:[-a-zA-Z0-9()@:%_+.~#?&/=]*)$/;
const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

const SECRET_KEY = 'cheburashka';

module.exports = { URL_REGEX, EMAIL_REGEX, SECRET_KEY };
