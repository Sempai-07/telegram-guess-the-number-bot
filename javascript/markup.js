const { Markup } = require("telegramsjs");

const easy = Markup.callback("Лёгкий", "easy");
const average = Markup.callback("Средний", "average");
const difficult = Markup.callback("Сложный", "difficult");

const choice = {
  inline_keyboard: [[easy], [average], [difficult]],
};

module.exports = {
  choice,
};
