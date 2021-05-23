
const config = require("./config/devices");
const tbtListener = require("./tbtListener");
const io = require("events");

process.on("uncaughtException", function (err) {
  console.log(err);
  console.log(" UNCAUGHT EXCEPTION ");
  console.log("[Inside 'uncaughtException' event] " + err.stack || err.message);
});

tbtListener.tbtListener(config, function (device, connection) {

  device.on("ping", function (data) {
    data.id = this.getUID();
    // io.emit("ping", data);
    const data_to_insert = data;
    data_to_insert.uid = this.getUID();
    return data;
  });

  device.on("START", function (data) {
    // io.emit("START", data);
  });
  device.on("STOP", function (data) {
    // io.emit("STOP", data);
  });

  device.on("alarm", function (alarm_code, alarm_data, msg_data) {
    console.log(
      "Help! Something happend: " + alarm_code + " (" + alarm_data.msg + ")"
    );
  });

  device.on("login_request", function (device_id, msg_parts) {
    console.log(
      "Hey! I want to start transmiting my position. Please accept me. My name is " +
        device_id
    );

    this.login_authorized(true);

    console.log("Ok, " + device_id + ", you're accepted!");
  });
  connection.on("data", function (data) {
    console.log(data.toString());
  });
});

// module.exports = { server: server };
