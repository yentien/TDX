// 引用linebot SDK
// const { Client } = require('@line/bot-sdk');
const line = require('@line/bot-sdk');
const linebot = require('linebot');
const fs = require("fs");
const axios = require("axios");
const querystring = require('node:querystring');

const area = require('./json/flexMessage/area.json');
const eastern = require('./json/flexMessage/eastern.json');
const northern = require('./json/flexMessage/northern.json');
const southern = require('./json/flexMessage/southern.json');
const western = require('./json/flexMessage/western.json');

const areaName = ["北部", "中部", "南部", "東部"];
const areaFlexFile = [northern, southern, eastern, western];
const contryName = ["基隆市", "新北市", "臺北市", "桃園市", "新竹縣", "新竹市", "苗栗縣",
  "台中市", "彰化縣", "南投縣", "雲林縣", "嘉義縣", "嘉義市", "台南市", "高雄市", "屏東縣",
  "台東縣", "花蓮縣", "宜蘭縣", "台東縣"
];

var config = {
  channelId: '1657787411',
  channelSecret: 'a3d3e5df9a49e6d6571b31d23798248a',
  channelAccessToken: 'kh/DB2NTWeH8tUmNOHi04XMPqaMTIOuGyR18CK4xHVjNqG0vOksVznNeuoL3bcTK9JKJLVG+rCDil6PMwfyjeoJ/WXf5hoNGxLNZaifQ//+0KOkAFrQ6yQw6PgvwWb81GR7dZSTpxRfvQZWivE+BuQdB04t89/1O/w1cDnyilFU='
};
// 用於辨識Line Channel的資訊
var bot = linebot(config);
// create LINE SDK client
const client = new line.Client(config);


function GetAuthorizationHeader(contryName) {
  const parameter = {
    grant_type: "client_credentials",
    client_id: "arthurtien88-3393eb5e-1634-4731",
    client_secret: "154589d9-bca3-46ca-954e-26397327425e"
  };
  let auth_url = "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token";

  axios.post(
    auth_url,
    querystring.stringify(parameter),
    {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }).then((res) => {
      tokenCode = res.data.access_token;
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.access_token}`;
      GetApiResponse(contryName);
    }).catch((error) => {
      console.log(error);
    });
}

function GetApiResponse(contryName) {
  // console.log(axios.defaults.headers.common['Authorization']);
  const apiSelect = encodeURI(contryName);
  // const url = `https://tdx.transportdata.tw/api/basic/v3/Rail/TRA/Station?%24 ${apiSelect} %24format=JSON`;
  const url = `https://tdx.transportdata.tw/api/basic/v3/Rail/TRA/Station?%24filter=contains%28StationAddress%2C%20%27${apiSelect}%27%29&%24format=JSON`;
  axios.get(url
    , {
      headers: {
        authorization: `Bearer ${tokenCode}`,
        "Accept-Encoding": "gzip,deflate,compress"
      }
    }
  )
    .then((response) => {
      // Object.keys(response.data).map((objectKey, index) => {
      //   // let TrainNo = response.data[objectKey].DailyTrainInfo.TrainNo; //車次代碼
      //   // let TrainType = response.data[objectKey].DailyTrainInfo.TrainTypeName.Zh_tw; //車種
      //   // let OriginStopTime = response.data[objectKey].OriginStopTime.DepartureTime; //起站離站時間
      //   // let DestinationStopTime = response.data[objectKey].DestinationStopTime.ArrivalTime; // 迄站到站時間

      //   // let RequireTime = (DestinationStopTime.substring(0, 2) * 3600 + DestinationStopTime.substring(3, 5) * 60) - (OriginStopTime.substring(0, 2) * 3600 + OriginStopTime.substring(3, 5) * 60);
      //   // RequireTime /= 60;
      //   // let ReqHour = Math.trunc(RequireTime / 60);
      //   // let ReqMin = RequireTime % 60;
      //   // console.log(`車次代碼:${TrainNo} 車種:${TrainType}`);
      //   // console.log(`${OriginStopTime} ➡ ${DestinationStopTime}  ${ReqHour}時${ReqMin}分 `)
      //   console.log(response.data)
      //   console.log("------------------------------------------------------------------------------");
      // });
      for (let i = 0; i < response.data.Stations.length; i++) {
        console.log("車站代碼:" + response.data.Stations[i].StationID);
        console.log("站名:" + response.data.Stations[i].StationName.Zh_tw)
      }

      console.log('GetApiResponse');
      console.log(contryName);
    })
    .catch((errow) => {
      console.log(errow);
    })
}


// 當有人傳送訊息給Bot時
bot.on('message', function (event) {
  if (event.message.text == '喵') {
    client.replyMessage(event.replyToken,
      area).catch((err) => {
        console.log(err);
      });
  } else {
    for (let i = 0; i < areaName.length; i++) {
      if (event.message.text == areaName[i]) {
        client.replyMessage(event.replyToken, areaFlexFile[i]).catch((err) => {
          console.log(err);
        });
      }
    }
    for (let i = 0; i < contryName.length; i++) {
      if (event.message.text == contryName[i]) {
        console.log(event.message.text);
        GetAuthorizationHeader(event.message.text);
      }
    }
  }
});

// Bot所監聽的webhook路徑與port
bot.listen('/linewebhook', 80, function () {
  console.log('[BOT已準備就緒]');
});