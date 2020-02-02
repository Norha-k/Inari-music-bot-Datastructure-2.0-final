const Discord = require('discord.js');
const {prefix,anime,ans,badwords} = require('./config.json');
const client =new Discord.Client();
const ytdl = require('ytdl-core');
const streamOptions = { seek: 0, volume: 1 };
const request = require("request");
const getYouTubeID = require("get-youtube-id");
const fetchVideoInfo = require("youtube-info");
const ytlist = require('youtube-playlist');
var tcpp = require('tcp-ping');
//to upload it on server
require('dotenv/config');
const http = require("http");
const port  = process.env.PORT || 3000;
http.createServer().listen(port);

const token = process.env.TOKEN;
const yt_api_key =process.env.YT_API_KEY;

//declaration for now

var regExp = /^.*(youtu.be\/|list=)([^#\&\?]*).*/; 
var queue = [];
var loop = true;
var isplaying = false;
var stop = false;
skipReq = 0;
skippers = [];
yt = "https://www.youtube.com/watch?v="
var loopArray = [];
var properQueue = [];
var localarray = [];
//declaration for now 
client.once('ready',() => {
    
    console.log("Inari is online ! -- working on pc --");
    client.user.setActivity("Nightcores with Hemantk || "+prefix+"help");
})
client.on('message',async message =>{
    if(message.content.startsWith(prefix+'hey'))
    {
        message.channel.send('Hello ! '+message.author+' senpai !!\nHow u doing :heart: ?!')

    }
     //to test badwords
     if(badwords.includes((message.content).toLocaleLowerCase()))
     {
         message.channel.send('ahh ! sad '+message.author+' has used bad words !!  call FBI :joy: ')
     }
     //ignore message by bots
     if(message.author.bot){return;}

    //Question and ans. stuff
    if(message.content.startsWith(prefix+'q'))
    {
        var randomNumber = Math.floor(((Math.random()*10)+1) % ans.length);
        message.reply(ans[randomNumber]);


    }
    if(message.content.startsWith(prefix+'ping'))
    {

        
        tcpp.ping({ address: 'www.heroku.com', port: 80 }, function(err, data) {
            message.reply(":ping_pong: Pong : "+Math.floor(data.avg)+" ms")
            console.log(data);
        });


    }
    //to make a clear command :
    if(message.content.startsWith(prefix+'clear'))
    {
        if(!message.member.hasPermission("MANAGE_MESSAGES"))
        return message.reply("oof , i guess dont have permission : ")
        const args = message.content.slice(prefix.length).split(' '); 
        message.channel.bulkDelete(Number(args[1])+1);
        


    }
    //from Here all musci bot Commands actaul music player !
    if(message.content.startsWith(prefix+'play'))
    {
        const voiceChannel = message.member.voiceChannel;
        if(!message.member.voiceChannel ) return message.reply(" you need to be in Voice chat with me :hibiscus:  !");
            const args = message.content.trim().split(" ").slice(1).join(" ");
            console.log("Properqueue Value in starts : "+properQueue)
            if(args.match(regExp))
            {
                        if(isplaying == false)
                        {
                            console.log("Playlist Link!");
                        message.channel.send("fetching PlayList..:clock: ");
                         await ytlist(args,['id', 'name', 'url']).then(res => {
                            if(isplaying==false)
                            {
                                properQueue=[...res.data.playlist];
                                loopArray=[...properQueue];
                            }
                            console.log(res.data);
                            
                        
  
                                                                            });
                console.log("Array value 1 of playlist: ",localarray);
                isplaying = true;
                playMusic(properQueue[0].id,message,voiceChannel);
                let embedd = new Discord.RichEmbed()
                                                    .setColor("RANDOM")
                                                    .setTitle(":battery: :battery:    Inari Ōkami | 稲荷大神 :battery: :battery:  ")
                                                    .setDescription("**All "+properQueue.length+" Songs in Queue :**")
                                                    .addField("current playing : ","*"+properQueue[0].name+"*",false)
                                                    .addField("video Link : ","*"+properQueue[0].url+"*",false)           
                                    message.channel.send(embedd);

                        }
                        else{

                            await ytlist(args,['id', 'name', 'url']).then(res => {
                    
                                res.data.playlist.forEach(element => {
                                   properQueue.push(element);
                                   
                               });
                               
                               console.log(properQueue);
                           });
                           loopArray = [...properQueue];

                        }
                        
            }
            else
            {

                if(queue.length > 0 || isplaying)
                {
                    let randomNumber_anime = Math.floor(((Math.random()*10)+1) % anime.length);
                                getID(args ,function(id){
                                add_to_queue(id);
                                console.log("loop arrey  : ",loopArray);
                                fetchVideoInfo(id, function(err ,videoInfo){
                                    properQueue.push({
                                        id :  videoInfo.videoId,
                                        name : videoInfo.title,
                                        url  : videoInfo.url,
                                        thumbnail : videoInfo.thumbnailUrl
                                        
                                    });
                                    loopArray.push({id :  videoInfo.videoId,
                                        name : videoInfo.title,
                                        url  : videoInfo.url,
                                        thumbnail : videoInfo.thumbnailUrl});
                                    console.log("after pushing in proper Queue value :",properQueue);
                                    if(err) throw new Error(err);
                                    let embedd = new Discord.RichEmbed()
                                                    .setColor("RANDOM")
                                                    .setTitle(":heart:   Inari Ōkami | 稲荷大神 :feet: ")
                                                    .setDescription(videoInfo.url)
                                                    .setFooter(anime[randomNumber_anime],client.user.displayAvatarURL)
                                                    .addField(":four_leaf_clover:  added to Queue : : ","***"+videoInfo.title+"***",false)
                                                    .setThumbnail(videoInfo.thumbnailUrl);            
                                    message.channel.send(embedd);
    
                                                                      });
                                                            });
            }
            else
            {
                let randomNumber_anime = Math.floor(((Math.random()*10)+1) % anime.length);
                                    isplaying = true;
                                    getID(args , function(id){
                                        
                                        queue.push(id);
                                        fetchVideoInfo(queue[0], function(err ,videoInfo){
                                            properQueue.push({
                                                id :  videoInfo.videoId,
                                                name : videoInfo.title,
                                                url  : videoInfo.url,
                                                thumbnail : videoInfo.thumbnailUrl
                                                
                                            });
                                            loopArray.push({id :  videoInfo.videoId,
                                                name : videoInfo.title,
                                                url  : videoInfo.url,
                                                thumbnail : videoInfo.thumbnailUrl});
                                            console.log("new proper Queue value :",properQueue);
                                            playMusic(properQueue[0].id,message,voiceChannel);
                                            if(err) throw new Error(err);
                                            let embed = new Discord.RichEmbed()
                                                            .setColor("RANDOM")
                                                            .setTitle(":heart:   Inari Ōkami | 稲荷大神 :feet: ")
                                                            .setDescription(videoInfo.url)
                                                            .setFooter(anime[randomNumber_anime],client.user.displayAvatarURL)
                                                            .addField(":headphones: now playing : ","***"+videoInfo.title+"***",false)
                                                            .setThumbnail(videoInfo.thumbnailUrl);            
                                            message.channel.send(embed);
                                            
                            
                                        });
                                        
                                        
                                    });
            }



            }
            

        
           
    }
    
    if(message.content.startsWith(prefix+'stop'))
    {

        if(!isplaying == true) return message.reply(" No song playing  !");
        stop = true;
        isplaying = false;
        message.member.voiceChannel.connection.dispatcher.end();
               

    }
    if(message.content.startsWith(prefix+'list'))
    {
        
        var mes = "```json\n"+"       Inari Ōkami | 稲荷大神 (current playlist) \n\n"+"\n";
        for(var i =  0; i < properQueue.length; i++)
        {
            
                
                var temp = (i+1) + " : " + properQueue[i].name + (i === 0 ?  "  (current song)" :  "") +"\n";
                if((mes + temp ).length <= 2000-3)
                {
                    mes += temp;
                }
                else
                {
                    mes += "```";
                    message.channel.send(mes);
                    mes = "```";
                }  

        }
        mes +="```";
        message.channel.send(mes);

    }
    if(message.content.startsWith(prefix+'skip'))
    {
        if(!isplaying == true) return message.reply(" No song playing  !");
        let usercount = message.member.voiceChannel.members.size;
        console.log("memebr in VC : "+usercount);
        if(skippers.indexOf(message.author.id) === -1)
        {
            skippers.push(message.author.id)
            skipReq++;
            if(skipReq >= Math.ceil((usercount -  1)/2))
            {
                skip_song(message);
                message.channel.send("```ini\n"+"[Your skip got acknowledged so , here skipping !]```")
            }
            else
            {
                message.reply(" now u need : "+ Math.ceil(((message.member.voiceChannel.members.size -  1) / 2 ) - skipReq)+" votes !");

            }
        }
        else
        {
            message.reply("you already voted !");
        }


    }
    if(message.content.startsWith(prefix+'loop'))
    {
        if(loop == false)
        {
            loop = true;
            message.channel.send(":repeat_one: Enabled !");
        }else{
            loop = false;
            message.channel.send(":repeat:  DIsabled !");
        }
        


    }
    if(message.content.startsWith(prefix+'drop'))
    {
        if(!isplaying == true) return message.reply(" No song playing  !");
        var indexno = Number(message.content.trim().split(" ").slice(1).join(" "));
        console.log("Index for deleting came : ",indexno);
        if(indexno ==  1){ message.channel.send("aagh ,  u cant delete current playing song !")}
        else
        {
            message.channel.send("```song :  "+properQueue[(indexno-1)].name+" removed !```")
            queue.splice((indexno-1),1);
            properQueue.splice((indexno-1),1);
            loopArray.splice((indexno-1),1);
        }

    }
    if(message.content.startsWith(prefix+'track'))
    {
        let randomNumber_anime = Math.floor(((Math.random()*10)+1) % anime.length);
        let text = "```diff"+"\n-No song in PlayList.. (￣▽￣*)ゞ "+"\n```";
        
       if(queue != null)
       {
           let tex = "```diff"+"\n-Current Playing :..\n";
           let ms = message.member.voiceChannel.connection.dispatcher.totalStreamTime;
            hr = Math.floor(ms / 1000 / 60 / 60),
            mn = Math.floor(ms / 1000 / 60 % 60),
            ss = Math.round(ms / 1000 % 60 % 60);
  
            function format(number = 0) {
                     return `0${number}`.slice(-2);
                                        }
            fetchVideoInfo(properQueue[0].id, function(err ,videoInfo){
            if(err) throw new Error(err);
            let inms = videoInfo.duration;
            let dura = fancyTimeFormat(inms);
            /*inhr = Math.floor(inms / 1000 / 60 / 60),
            inmn = Math.floor(inms / 1000 / 60 % 60),
            inss = Math.round(inms / 1000 % 60 % 60);
            console.log("total dura :",inms,`${inhr}:${format(inmn)}:${format(inss)}`);*/
            let embed = new Discord.RichEmbed()
            .setColor("RANDOM")
            .setTitle(videoInfo.genre)
            .setDescription(tex+videoInfo.title+"\n"+"-Time Elapsed : "+`${hr}:${format(mn)}:${format(ss)}`+"\n```")
            .setThumbnail(videoInfo.thumbnailUrl)
            .addField("Duration :",dura,false) 
            .addField("Link :",videoInfo.url,false) 
            .setFooter(anime[randomNumber_anime],client.user.displayAvatarURL);          
                message.channel.send(embed);
                console.log(`${hr}:${format(mn)}:${format(ss)}`);
        });
        
       }
       else
       {
           message.channel.send(text);
       }

    }


    if(message.content.startsWith(prefix+'help'))
    {
        let embedh = new Discord.RichEmbed()
                .setColor("RANDOM")
                .setTitle(":heart:   Inari Ōkami | 稲荷大神 :feet: ")
                .setDescription("Hello , its me Inari Ōkami | 稲荷大神 :heart: but u can call me , Inari ! \n Here my **commands** below u can check !")
                .addField("say hii to me  :wave:: ",prefix+"hey",false)
                .addField("ping check :ping_pong: : ",prefix+"ping",false)
                .addField("play music :headphones: : ",prefix+"play <space> music_name or URL",false)
                .addField("loop music: :repeat_one: :",prefix+"loop",false)
                .addField("stop music: :octagonal_sign: :",prefix+"stop",false)
                .addField("track current music: :musical_score: ",prefix+"track",false)
                .addField("list details: :musical_score: ",prefix+"list",false)
                .addField("skip music  : :ballot_box_with_check: ",prefix+"skip",false)
                .addField("drop any music from playlist : :recycle: ",prefix+"drop <space> List_no of song",false)
                .addField("ask her questions  : :fox::heart:  ",prefix+"q <space> Question's to ask ",false)
                .addField("clear mesaage [if u have permission] :crossed_swords: : ",prefix+"clear <space> no. of messages to clear",false)
                .setThumbnail(client.user.displayAvatarURL)
                .setFooter("Everyone thank you so much for helping my Creater to make me a good girl .",message.author.avatarURL);            
        message.channel.send(embedh);

    }
    

    
    
});

//functaion definataion starts
function skip_song(message){

    message.member.voiceChannel.connection.dispatcher.end();
   
}
function playMusic(id ,  message ,voiceChannel)
{
    
     message.channel.bulkDelete(1);
     if(!voiceChannel) {voiceChannel = message.member.voiceChannel;} 
     //const voice_Channel = message.member.voiceChannel;
     const  connection =voiceChannel.join()
        .then(connection =>{
            const stream = ytdl("https://www.youtube.com/watch?v="+id, { filter: 'audioonly', quality: 'highestaudio', highWaterMark: 1<<25  });
            stream.on('error', console.error);
            console.log("-------------------------------------------------------------------");
            const dispatcher = connection.playStream(stream, streamOptions);
           
            dispatcher.on('end' ,function() {
                if(stop == true)
                {
                    stop = false;
                    dispatcher.destroy();
                    voiceChannel.leave();
                    queue = [];
                    properQueue = [];
                    loopArray = [];
                    isplaying = false; 
                    skipReq = 0;
                    skippers = [];
                    return message.channel.send("**succesfully disconnected**");
                    
                }
                skipReq = 0;
                skippers = [];
                properQueue.shift();
                queue.shift();
                if(properQueue.length == 0)
                {
                    if(loop == true)
                        {
                            properQueue  = [...loopArray];
                            console.log(" <--------------------------------------------------------------------->");
                            console.log(" properQueue came to end , from here Looping all content of looparray :\narray = \n",properQueue);
                            let randomNumber_anime = Math.floor(((Math.random()*10)+1) % anime.length);
                            setTimeout(()=>{
                                    let embedf = new Discord.RichEmbed()
                                        .setColor("RANDOM")
                                        .setTitle(":heart:   Inari Ōkami | 稲荷大神 :feet: ")
                                        .setDescription(properQueue[0].url)
                                        .setFooter(anime[randomNumber_anime],client.user.displayAvatarURL)
                                        .addField(":headphones: now playing : ","***"+properQueue[0].name+"***",false)
                                        .setThumbnail(properQueue[0].thumbnail);            
                                    message.channel.send(embedf);
                                playMusic(properQueue[0].id,message);
                                
    
                            },2000);

                        }
                        else
                        {
                            message.channel.send("```- song ended now -```");
                            message.channel.send(":yum: , have a good time !")
                            dispatcher.destroy();
                            voiceChannel.leave();
                            queue = [];
                            loopArray = [];
                            properQueue = [];
                            isplaying = false;
                            stop = false

                        }    
                    
                }
                else
                {
                    let randomNumber_anime = Math.floor(((Math.random()*10)+1) % anime.length);

                    setTimeout(() =>{
                        playMusic(properQueue[0].id,message);
                        console.log("the next song now playing from properqueue : ",properQueue[0])
                            let embedf = new Discord.RichEmbed()
                                            .setColor("RANDOM")
                                            .setTitle(":heart:   Inari Ōkami | 稲荷大神 :feet: ")
                                            .setDescription(properQueue[0].url)
                                            .setFooter(anime[randomNumber_anime],client.user.displayAvatarURL)
                                            .addField(":headphones: now playing : ","***"+properQueue[0].name+"***",false)
                                            .setThumbnail(properQueue[0].thumbnail);            
                            message.channel.send(embedf);

                    
                        
                    },1000);
                    
                }
                
                
                

            
            });

        }).catch(
            console.error)



}



function getID(str , cb)
{
    if(isYouTube(str))
    {
        cb(getYouTubeID(str));
    }
    else
    {
        search_video(str, function(id) {
            cb(id);
        });


    }
}
function add_to_queue(strID)
{
    if(isYouTube(strID))
    {
        queue.push(getYouTubeID(strID));
        
        
    }else {
        queue.push(strID);
        
        
    }


}

function search_video(query, callback) {
    request(`https://www.googleapis.com/youtube/v3/search?part=id&type=video&q=${query}&key=${yt_api_key}`, function(error, response) {
      var json = JSON.parse(response.body);
      if (!json.items[0]) callback("uTUjfI3vYkM");
      else {
      callback(json.items[0].id.videoId)
      }
    });
  }

  function fancyTimeFormat(time)
  {   
      // Hours, minutes and seconds
      var hrs = ~~(time / 3600);
      var mins = ~~((time % 3600) / 60);
      var secs = ~~time % 60;
  
      // Output like "1:01" or "4:03:59" or "123:03:59"
      var ret = "";
  
      if (hrs > 0) {
          ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
      }
  
      ret += "" + mins + ":" + (secs < 10 ? "0" : "");
      ret += "" + secs;
      return ret;
  }

function isYouTube(str) {
  return str.toLowerCase().indexOf("youtube.com") > -1;
}

//functaion definataion end
client.on('error', err =>{
    console.log(err)


});
client.login(token);
