const { TelegramBot } = require("telegramsjs");
const { choice } = require("./markup");
const { UserCache, GameStart } = require("./database");
const { 
  getType,
  getRandomType,
  replaceTypeNumber,
  getUserAttempts,
} = require("./util");

const bot = new TelegramBot("TOKEN_BOT");
bot.user = new UserCache();
bot.game = new GameStart();

bot.on("ready", (client) => {
  console.log(`Бот @${client.username}, запустился`);
  bot
    .setMyCommands({
      commands: [
        {
          command: "/start",
          description: "Стартовая команда",
        },
        {
          command: "/random",
          description: "Угадай число",
        },
      ],
    })
    .then(() => console.log("Команды зарегистрированы"));
});

bot.command("start", async (ctx) => {
  const username = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
  ctx.reply(`Привет, ${username}!`);
  
  await bot.user.set(ctx.from.id, {
    first_name: ctx.from.first_name,
    username: ctx.from.username,
    lang_code: ctx.from.language_code,
    attemptsLeft: 0
  });
}, "private");

bot.command("random", (ctx) => {
  const username = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
  ctx.reply(`Привет, ${username}! Выберите сложность:`, {
    reply_markup: choice,
  });
}, "private");

bot.action(["easy", "average", "difficult"], async (ctx) => {
  const userId = ctx.from.id;
  if (await bot.game.has(userId)) {
    ctx.editMessageText("Нельзя использовать данную команду, пока не завершится прошлый раунд!");
    return;
  }
  
  const username = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
  const difficulty = getType(ctx.data);
  
  ctx.editMessageText(`Успешно! ${username}, вы выбрали <b>${difficulty}</b> уровень. Отгадайте число от 1 до ${replaceTypeNumber(ctx.data)}`, {
    parse_mode: "HTML",
  });
  
  const attempts = await getUserAttempts(ctx.data);
  
  await bot.game.set(userId, {
    type: ctx.data,
    random: getRandomType(ctx.data),
    messageId: ctx.message.message_id,
    attemptsLeft: attempts,
  });
}, true);

bot.on("message", async (ctx) => {
  const userId = ctx.from.id;
  const username = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
  if (ctx.chat.type !== "private" || !(await bot.game.has(userId))) {
    return;
  }

  const game = await bot.game.get(userId);
  const maxNumber = replaceTypeNumber(game.type);

  if (!Number(ctx.text) || Number(ctx.text) >= maxNumber) {
    bot.editMessageText({
      chat_id: userId,
      message_id: game.messageId,
      text: `${username}, пожалуйста, укажите число от 1 до ${maxNumber}`,
    }).catch(() => console.log);
    return;
  }
  
  if (ctx.text !== game.random) {
    if (game.attemptsLeft === 0) {
      ctx.reply(`${username}, у вас закончились попытки! Правильный ответ был ${game.random}.`);
      await bot.game.delete(userId);
      return;
    }
    game.attemptsLeft--;
    await bot.game.set(userId, game);
    await ctx.deleteMessage().catch(() => console.log);
  }
  
  if (ctx.text == game.random) {
    bot.deleteMessage({
      chat_id: userId,
      message_id: game.messageId
    }).catch(() => console.log);
    
    ctx.chat.send(`${username}, вы угадали число ${game.random}, поздравляю! Вы использовали ${getUserAttempts(game.type) - game.attemptsLeft} попытк(и/у) из ${getUserAttempts(game.type)}.`);
    delete game.messageId;
    delete game.random;
    
    const userInfo = await bot.user.get(userId);
    userInfo.attemptsLeft = (userInfo?.attemptsLeft ?? 0) + game.attemptsLeft;
    await bot.game.delete(userId);
    return;
  }
  
  const comparison = ctx.text > game.random ? "меньше" : "больше";
  
  bot.editMessageText({
    chat_id: userId,
    message_id: game.messageId,
    text: `${username}, загаданное число ${comparison} указанного. Отгадайте число от 1 до ${maxNumber} за оставшиеся ${game.attemptsLeft} попытки`,
  }).catch(() => console.log);
});

bot.login();