import { TelegramBot } from "telegramsjs";
import { choice } from "./markup";
import { UserCache, GameStart } from "./database";
import { 
  getType,
  getRandomType,
  replaceTypeNumber,
  getUserAttempts,
} from "./util";

const bot = new TelegramBot("TOKE_BOT");
const userCache = new UserCache();
const gameCache = new GameStart();

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
  
  await userCache.set(ctx.from.id, {
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
  if (await gameCache.has(userId)) {
    ctx.editMessageText("Нельзя использовать данную команду, пока не завершится прошлый раунд!");
    return;
  }
  
  const username = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
  const difficulty = getType(ctx.data);
  
  ctx.editMessageText(`Успешно! ${username}, вы выбрали <b>${difficulty}</b> уровень. Отгадайте число от 1 до ${replaceTypeNumber(ctx.data)}`, {
    parse_mode: "HTML",
  });
  
  const attempts = await getUserAttempts(ctx.data);
  
  await gameCache.set(userId, {
    type: ctx.data,
    random: getRandomType(ctx.data),
    messageId: ctx.message.message_id,
    attemptsLeft: attempts,
  });
}, true);

bot.on("message", async (ctx) => {
  const userId = ctx.from.id;
  const username = ctx.from.username ? `@${ctx.from.username}` : ctx.from.first_name;
  if (ctx.chat.type !== "private" || !(await gameCache.has(userId))) {
    return;
  }

  const game = await gameCache.get(userId);
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
      await gameCache.delete(userId);
      return;
    }
    game.attemptsLeft--;
    await gameCache.set(userId, game);
    await ctx.deleteMessage().catch(() => console.log);
  }
  
  if (ctx.text == game.random) {
    bot.deleteMessage({
      chat_id: userId,
      message_id: game.messageId
    }).catch(() => console.log);
    
    ctx.chat.send(`${username}, вы угадали число ${game.random}, поздравляю! Вы использовали ${getUserAttempts(game.type) - game.attemptsLeft} попытк(и/у) из ${getUserAttempts(game.type)}.`);
    // @ts-ignore
    delete game.messageId;
    // @ts-ignore
    delete game.random;
    
    const userInfo = await userCache.get(userId);
    userInfo.attemptsLeft = (userInfo?.attemptsLeft ?? 0) + game.attemptsLeft;
    await gameCache.delete(userId);
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