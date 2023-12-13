require("dotenv").config();
const { Telegraf } = require('telegraf');
const {
    handleTelegramApiException,
    handleOtherExceptions
} = require('./src/telegramException');
const subscriptionChecker = require("./src/Services/subscriptionChecker");
const Loader = require("./src/Loader");
const mongooseConnection = require("./src/Database/Mongoose");

// Conectar ao banco de dados MongoDB
mongooseConnection();

// Configurar o bot do Telegram
const ELClient = new Telegraf(process.env.TELEGRAM_BOT);

// Carregar comandos e eventos
['./Commands', './Events'].forEach(path => Loader(ELClient, path, path.includes('Commands') ? 'command' : 'event'));

// Verificar assinaturas
subscriptionChecker(ELClient);

// Iniciar o bot
ELClient.launch();

// Lidar com exceções do Telegram
ELClient.use(handleTelegramApiException);
ELClient.use(handleOtherExceptions);

// Lidar com sinais de encerramento
['SIGINT', 'SIGTERM'].forEach(signal => process.once(signal, () => ELClient.stop(signal)));
