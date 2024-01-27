import { Bot, Context } from 'grammy';
import { Menu } from '@grammyjs/menu';

import { logger } from '../lib/logger';
import { pushLinksToBot } from '../utils/functions';
import scrapeWallaNews from '../scraper/wallaNews';
import scrapeYnet from '../scraper/ynet';
import scrapeOne from '../scraper/one';
import { Article } from '../Types/type';
export default function newsBot() {
  // Create an instance of the `Bot` class and pass your bot token to it.
  const bot = new Bot(process.env.BOT_TOKEN as string);
  // Create a simple menu.
  const menu = new Menu('my-news-menu')
    .text('Walla News', (ctx: Context) => getWallaNews(ctx))
    .row()
    .text('Ynet', (ctx: Context) => getYnetNews(ctx))
    .row()
    .text('One', (ctx: Context) => getOneStories(ctx))
    .row()
    .text('Read All', (ctx: Context) => {
      getWallaNews(ctx);
      getYnetNews(ctx);
      getOneStories(ctx);
    })
    .row();

  // Init Menu Buttons.
  bot.use(menu);

  // Handle the /start command.
  bot.command('start', (ctx) => {
    const message = ctx.message;
    if (message?.chat.id == process.env.MY_BOT_ID) {
      ctx.reply('Hi. please press the /news key to get help');
    } else {
      logger.error(` Unauthorized Entry attempt to Bot from ${message?.chat.id},${message?.from.first_name}. Bot? ${message?.from.is_bot} `);
    }
  });
  //Show all of the bot commends
  bot.command('news', async (ctx) => {
    const message = ctx.message;
    if (message?.chat.id == process.env.MY_BOT_ID) {
      await ctx.reply(`Hi ${message?.from.first_name}. what do you want to read?`, { reply_markup: menu });
    } else {
      await ctx.reply(`Hi ${message?.from.first_name}. this is a privet bot. you need to live now`);
      logger.error(`Unauthorized Entry attempt to Bot from ${message?.chat.id},${message?.from.first_name} `);
      return;
    }
  });

  // Start the bot.
  bot.start();
}
function getOneStories(ctx: Context) {
  scrapeOne()
    .then((items: { data: Article[] } | undefined) => {
      const stories = items?.data;
      if (stories !== undefined) {
        pushLinksToBot(ctx, stories);
      } else {
        ctx.reply('issue showing news articles from One. Show /news menu');
        logger.error('[Bot] Error: issue showing news articles from One. Show /news menu');
      }
      ctx.reply('Show /news menu');
    })
    .catch((error) => logger.error('Error:', error));
}

function getWallaNews(ctx: Context) {
  scrapeWallaNews()
    .then((items: { data: Article[] } | undefined) => {
      const stories = items?.data;
      if (stories !== undefined) {
        pushLinksToBot(ctx, stories);
      } else {
        ctx.reply('issue showing news articles from Walla. Show /news menu');
        logger.error('[Bot] Error: issue showing news articles from Walla. Show /news menu');
      }
      ctx.reply('Show /news menu');
    })
    .catch((error) => logger.error('Error:', error));
}

function getYnetNews(ctx: Context) {
  scrapeYnet()
    .then((items: { data: Article[] } | undefined) => {
      const stories = items?.data;
      if (stories !== undefined) {
        pushLinksToBot(ctx, stories);
      } else {
        ctx.reply('issue showing news articles from Ynet. Show /news menu');
        logger.error('[Bot] Error: issue showing news articles from Ynet. Show /news menu');
      }
      ctx.reply('Show /news menu');
    })
    .catch((error) => logger.error('Error:', error));
}
