const http = require('http');
const fs = require('fs');
var requests = require("requests");
const homeFile = fs.readFileSync("home.html", "utf-8");
const replaceVal = (tempVal, orgVal) => {
    let temperature = tempVal.replace("{%tempval%}", orgVal.main.temp);
    temperature = temperature.replace("{%tempmin%}", orgVal.main.temp_min);
    temperature = temperature.replace("{%tempmax%}", orgVal.main.temp_max);
    temperature = temperature.replace("{%location%}", orgVal.name);
    temperature = temperature.replace("{%country%}", orgVal.sys.country);
    temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);


    return temperature;
}

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests("https://api.openweathermap.org/data/2.5/weather?q=Rajasthan&units=metric&appid=ced716a5193a436396a65f84378c8d08")
            .on('data', (chunk) => {
                const objdata = JSON.parse(chunk);
                const arraydata = [objdata];
                // console.log(arraydata[0].main.temp);
                const realTimeData = arraydata.map((val) => replaceVal(homeFile, val)).join("");
                // console.log(val.main);

                res.write(realTimeData);
                // console.log(realTimeData);
            })
            .on('end', (err) => {
                if (err) return console.log('connection closed due to errors', err);
                res.end();
                // console.log('end');
            });
    }

});

server.listen(8000, "127.0.0.1");