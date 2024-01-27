import { Bot } from 'grammy';
import { Menu } from '@grammyjs/menu';
import { logger } from '../lib/logger';
// import scrapeWallaNews from './scraper/wallaNews';
import scrapeYnet from '../scraper/ynet';
// import scrapeOne from './scraper/one';

export default function newsBot() {
  // Create an instance of the `Bot` class and pass your bot token to it.
  const bot = new Bot(process.env.BOT_TOKEN as string);
  // Create a simple menu.
  const menu = new Menu('my-menu-identifier')
    .text('וואלה חדשות', (ctx: any) => ctx.reply('וואלה חדשות'))
    .row()
    .text('Ynet', (ctx: any) => getYnetNews(ctx))
    .row()
    .text('One', (ctx: any) => ctx.reply('One'))
    .row()
    .text('All', (ctx: any) => ctx.reply('all'))
    .row();

  // Init Menu Buttons.
  bot.use(menu);

  function getYnetNews(ctx: any) {
    console.log('getYnetNews', new Date());
    scrapeYnet()
      .then((items: any) => {
        // console.log( items.data);

        items.data.forEach((item: object) => {
          console.log(item);
        });
      })
      
      .catch((error: any) => logger.error('Error:', error));
  }

  // Handle the /start command.
  bot.command('start', (ctx) => ctx.reply('היי לבוט החדשות שלך. לעזרה כתוב /news'));
  //Show all of the bot commends
  bot.command('news', async (ctx) => {
    const message = ctx.message;

    await ctx.reply('Select News Channel ', { reply_markup: menu });

    console.log(message);
  });
  // Handle other messages.

  // Now that you specified how to handle messages, you can start your bot.
  // This will connect to the Telegram servers and wait for messages.

  // Start the bot.
  bot.start();
}
