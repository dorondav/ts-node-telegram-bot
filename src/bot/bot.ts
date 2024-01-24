import { Bot } from "grammy";
import { Menu } from "@grammyjs/menu";

// import scrapeWallaNews from './scraper/wallaNews';
// import scrapeYnet from './scraper/ynet';
// import scrapeOne from './scraper/one';

export default function newsBot() {

// Create an instance of the `Bot` class and pass your bot token to it.
const bot = new Bot(process.env.BOT_TOKEN as string); // <-- put your bot token between the ""
// Create a simple menu.
const menu = new Menu("my-menu-identifier")
.text("וואלה חדשות", (ctx:any) => ctx.reply("וואלה חדשות")).row()
.text("Ynet", (ctx:any) => ctx.reply("Ynet")).row()
.text("One", (ctx:any) => ctx.reply("One")).row()
.text("All", (ctx:any) => ctx.reply("all")).row();

// Make it interactive.
bot.use(menu);

// bot.command("menu", async (ctx) => {
//     await ctx.reply("Here is your menu", { reply_markup: menu });
//   });
// Handle the /start command.
bot.command("start", (ctx) => ctx.reply("היי לבוט החדשות שלך. לעזרה כתוב /news"));
//Show all of the bot commends 
bot.command("news", async (ctx) => {
   const message =  ctx.message;
   await ctx.reply("בחר ערוץ חדשות", { reply_markup: menu });

   console.log(message);
   
});
// Handle other messages.



// bot.on("message", (ctx) => ctx.reply("Got another message!"));

// Now that you specified how to handle messages, you can start your bot.
// This will connect to the Telegram servers and wait for messages.

// Start the bot.
bot.start();
}
