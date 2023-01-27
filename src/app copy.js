const express = require('express');
const app = express();
const port = 8888;
const path = require("path");
const axios = require("axios");
const querystring = require('node:querystring');
let tokenCode = '';

app.set('view engine', 'ejs');

function init() {
  GetAuthorizationHeader();
}
init();

function GetApiResponse() {
  // console.log(axios.defaults.headers.common['Authorization']);
  const url = `https://tdx.transportdata.tw/api/basic/v2/Rail/TRA/DailyTimetable/OD/1210/to/3300/2023-01-21?%24top=30&%24format=JSON`;
  axios.get(url
    , {
      headers: {
        authorization: `Bearer ${tokenCode}`,
        "Accept-Encoding": "gzip,deflate,compress"
      }
    }
  )
    .then((response) => {
      Object.keys(response.data).map((objectKey, index) => {
        let TrainNo = response.data[objectKey].DailyTrainInfo.TrainNo; //車次代碼
        let TrainType = response.data[objectKey].DailyTrainInfo.TrainTypeName.Zh_tw; //車種
        let OriginStopTime = response.data[objectKey].OriginStopTime.DepartureTime; //起站離站時間
        let DestinationStopTime = response.data[objectKey].DestinationStopTime.ArrivalTime; // 迄站到站時間

        let RequireTime = (DestinationStopTime.substring(0, 2) * 3600 + DestinationStopTime.substring(3, 5) * 60) - (OriginStopTime.substring(0, 2) * 3600 + OriginStopTime.substring(3, 5) * 60);
        RequireTime /= 60;
        let ReqHour = Math.trunc(RequireTime / 60);
        let ReqMin = RequireTime % 60;
        console.log(`車次代碼:${TrainNo} 車種:${TrainType}`);
        console.log(`${OriginStopTime} ➡ ${DestinationStopTime}  ${ReqHour}時${ReqMin}分 `)
        console.log("------------------------------------------------------------------------------");
      });
      console.log('GetApiResponse');
    })
    .catch((errow) => {
      console.log("---------------------------------");
      console.log(errow);
      console.log("error");
    })
}

function GetAuthorizationHeader() {
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
      GetApiResponse();
    }).catch((error) => {
      if (error) {
        // console.log(error.res.date)
        // console.log(error.res.status)
        // console.log(error.res.headers)
        console.log(error);
      } else {
        console.log(error.message)
      }
      console.log(error.config)
    });
}

app.get("/", (req, res, next) => {
  const options = {
    root: path.join(__dirname) + "\\views"
  };
  const fileName = "index.html";
  res.render("index");
});


// app.listen(port, () => {
//   console.log(`tdx app listening at http://localhost: ${port}`);
// });