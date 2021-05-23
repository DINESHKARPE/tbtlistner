let net = require('net');

let client = new net.Socket();
client.connect(8090, '127.0.0.1', function () {
    console.log('Connected');
    let data = {
        action: 'login_request',
        device_id: 'randomestring',
        data: ''
    };
    client.write(Buffer.from(data.toString()));
    // client.write("{\"action\":\"login_request\",\"id\":\"randomestring\",\"data\":\"something\"}")
    // setTimeout(() => {
    //     client.write("{\"action\":\"START\",\"id\":\"randomestring\",\"data\":\"something\"}")
    // }, 1000)
    // // setInterval(startFunction,1000,client)
    //
    // setInterval(sendData, 1000, client)

});

client.on('data', function (data) {
    console.log('Received: ' + data.toString());
});

client.on('close', function () {
    console.log('Connection closed');
});

function sendData(client) {
    client.write("{\"action\":\"PING\",\"id\":\"randomestring\",\"data\":{\"id\":\"random\",\"timestamp\":\""+Date.now()+"\",\"lat\":\"19.3625308\",\"lon\":\"73.0784747\",\"speed\":\"60\",\"altitude\":\"15\",\"accuracy\":\"24\",\"batt\":\"65\"}}")
}