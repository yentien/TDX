const apiSelect = escape("filter=contains%28StationAddress,'基隆'%28")
const url = `https://tdx.transportdata.tw/api/basic/v3/Rail/TRA/Station?%24 ${apiSelect} %24format=JSON`;
const uurl = `https://tdx.transportdata.tw/api/basic/v3/Rail/TRA/Station?%24filter=contains%28StationAddress%2C%20%27%E5%9F%BA%E9%9A%86%27%29&%24top=30&%24format=JSON`;
console.log(decodeURI('%2C%20%27%E5%9F%BA%E9%9A%86%27%29&%24'));
console.log(encodeURI('基隆'));