module.exports = class NotAuthoirizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
};
