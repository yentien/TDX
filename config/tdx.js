
function GetAuthorization() {
  const axios = require("axios");
  const querystring = require('node:querystring');
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
      // GetApiResponse();
      return console.log("TDX access");
    }).catch((error) => {
      console.log(error);
    });
}

module.exports = GetAuthorization();