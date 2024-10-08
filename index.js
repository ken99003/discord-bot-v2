// 引入 Discord.js 模組
const { Client, GatewayIntentBits } = require('discord.js');
const keep_alive=require('./keep_alive.js')
require('dotenv').config();

// 創建一個新的 Discord 客戶端實例
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// 當機器人準備好時觸發
client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

//!t
let reminders = {};

// 監聽訊息事件
client.on('messageCreate', message => {

    // 測試指令
    if (message.content === '!ping') {
      message.channel.send('pong!\n');
      message.channel.send('機器人已啟動，請不要挑戰機器人的極限，謝謝');
    }
    if (message.content === '!傑森') {
      message.channel.send('sb');
    }
    if (message.content === '!蘇蘇') {
      message.channel.send('大雙6');
    }
    //

    //!t 10 1000 test
    if (message.content.startsWith('!t')) {
      const args = message.content.split(' ');
      if (args.length >= 4) {

          const initialDelay = parseInt(args[1]) * 1000;
          const interval = parseInt(args[2]) * 1000;

          if(initialDelay>0 & interval>0){

            const reminderMessage = args.slice(3).join(' ');
            
            //
            let reminderIdCounter = 1;
            let reminderId = reminderIdCounter;
            while (reminders[reminderId]) {
              reminderId++;
            }
            //

            // 設置初始提醒
            const initialTimeout = setTimeout(() => {
              const channelId = '1270620727334146048';
              const roleId = '1270624318212276295'; 
              const targetChannel = message.guild.channels.cache.get(channelId);

              targetChannel.send(`<@&${roleId}> 提醒${reminderId}: ${reminderMessage}`)
                .then(sentMessage => {
                  setTimeout(() => {
                      sentMessage.delete().catch(console.error);
                  }, 60000);
                });

                // 設置持續的提醒
                const intervalId = setInterval(() => {
                    targetChannel.send(`<@&${roleId}> 提醒${reminderId}: ${reminderMessage}`)
                    .then(sentMessage => {
                      setTimeout(() => {
                          sentMessage.delete().catch(console.error);
                      }, 60000);
                    });
                }, interval);

                // 保存提醒信息
                reminders[reminderId] = { intervalId , reminderMessage};

            }, initialDelay);

            // 保存初始提醒
            reminders[reminderId] = { initialTimeout , reminderMessage };

            message.channel.send(`已設置提醒編號 ${reminderId}: ${reminderMessage}`);
          } else{
            message.channel.send('數字格式錯誤，請輸入大於0的數');
          }
          
      } else {
          message.channel.send('請提供正確的參數，例如: `!t 10 1000 test`');
      }
  }
  //
  
  //"!dt" 指令
  if (message.content.startsWith('!dt')) {
      const args = message.content.split(' ');

      if (args.length >= 2) {
          const reminderId = parseInt(args[1]);

          if (reminders[reminderId]) {
              // 清除對應的提醒
              clearTimeout(reminders[reminderId].initialTimeout);
              clearInterval(reminders[reminderId].intervalId);
              // 刪除提醒記錄
              delete reminders[reminderId];

              message.channel.send(`已刪除提醒編號 ${reminderId}`);
          } else {
              message.channel.send(`找不到提醒編號 ${reminderId}`);
          }
      } else {
          message.channel.send('請提供提醒的編號，例如: `!dt 1`');
      }
  }
  //


  //clear
  if(message.content === '!clear'){
    let count = 1;
    for(count;count<20;count++){
      if (reminders[count]) {
        // 清除對應的提醒
        clearTimeout(reminders[count].initialTimeout);
        clearInterval(reminders[count].intervalId);
        // 刪除提醒記錄
        delete reminders[count];

        message.channel.send(`已刪除提醒編號 ${count}`);
      }
    }
    message.channel.send('已全部刪除');
  }
  //

  //list
  if(message.content === '!list'){
    let count = 1;
    let check = 0;
    message.channel.send(`目前編號\n`)
    for(count;count<20;count++){
      if (reminders[count]) {
        check=1;
        message.channel.send(`編號${count}:${reminders[count].reminderMessage}`);

      }
    }
    if(check == 0){
      message.channel.send(`無`);
    }
  }
  //

  //老賭狗
  if(message.content === '!roll'){
    function getRandom(min,max){
      return Math.floor(Math.random()*(max-min+1))+min;
    };
    let num= getRandom(1,6);
    message.channel.send(`幸運數字:${num}`);
  }
  //

});
// 登入 Discord
client.login(process.env.TOKEN);
