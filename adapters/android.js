/* Original code: https://github.com/cnberg/gps-tracking-nodejs/blob/master/lib/adapters/gt06.js */
f = require('../functions');
let fs = require('fs');
exports.protocol = 'ANDROID';
exports.model_name = 'ANDROID';
exports.compatible_hardware = ['ANDROID/supplier'];

var adapter = function (device) {
    if (!(this instanceof adapter)) {
        return new adapter(device);
    }
    this.format = {'start': '(', 'end': ')', 'separator': ''};
    this.device = device;
    this.__count = 1;

    /*******************************************
     PARSE THE INCOMING STRING FROM THE DECIVE
     You must return an object with a least: device_id, cmd and type.
     return device_id: The device_id
     return cmd: command from the device.
     return type: login_request, ping, etc.
     *******************************************/
    this.parse_data = function (data) {
        try {
            // JSON.parse(data.toString().replace(/'/g,'"'))
            const parseData = JSON.parse(data.toString('utf8'));
            const parts = {
                'device_id': parseData.id,
                'data': parseData,
                'cmd': parseData.action,
                'action': parseData.action
            };
            return parts;
        }catch (e) {
                console.log("NOT JSON");
        }
    };
    this.authorize = function () {
        //this.device.send("\u0078\u0078\u0005\u0001\u0000\u0001\u00d9\u00dc\u000d\u000a");
        //return ;
        var length = '05';
        var protocal_id = '01';
        var serial = f.str_pad(this.__count, 4, 0);

        var str = length + protocal_id + serial;

        this.__count++;

        var crc = require('/usr/local/lib/node_modules/crc/lib/index.js');
        var crcResult = f.str_pad(crc.crc16(str).toString(16), 4, '0');

        var buff = new Buffer('7878' + str + crcResult + '0d0a', 'hex');
        var buff = new Buffer('787805010001d9dc0d0a', 'hex');
        this.device.send(buff);
    };
    this.zeroPad = function (nNum, nPad) {
        return ('' + (Math.pow(10, nPad) + nNum)).slice(1);
    };
    this.synchronous_clock = function (msg_parts) {

    };
    this.receive_heartbeat = function (msg_parts) {
        var buff = new Buffer('787805130001d9dc0d0a', 'hex');
        this.device.send(buff);
    };
    this.run_other = function (cmd, msg_parts) {
    };

    this.request_login_to_device = function () {
        //@TODO: Implement this.
    };

    this.receive_alarm = function (msg_parts) {
        var str = msg_parts.data;

        var data = {
            'date': str.substr(0, 12),
            'set_count': str.substr(12, 2),
            'latitude_raw': str.substr(14, 8),
            'longitude_raw': str.substr(22, 8),
            'latitude': this.dex_to_degrees(str.substr(14, 8)),
            'longitude': this.dex_to_degrees(str.substr(22, 8)),
            'speed': parseInt(str.substr(30, 2), 16),
            'orientation': str.substr(32, 4),
            'lbs': str.substr(36, 18),
            'device_info': f.str_pad(parseInt(str.substr(54, 2)).toString(2), 8, 0),
            'power': str.substr(56, 2),
            'gsm': str.substr(58, 2),
            'alert': str.substr(60, 4),
        };

        data['power_status'] = data['device_info'][0];
        data['gps_status'] = data['device_info'][1];
        data['charge_status'] = data['device_info'][5];
        data['acc_status'] = data['device_info'][6];
        data['defence_status'] = data['device_info'][7];
        console.log('alert');
        console.log(data);
    };

    this.dex_to_degrees = function (dex) {
        return parseInt(dex, 16) / 1800000;
    };

    this.get_ping_data = function (msg_parts) {
        // orientation

        var data = {
            'id':msg_parts.data.id,
            'date': msg_parts.data.timestamp,
            'latitude': msg_parts.data.lat,
            'longitude': msg_parts.data.lon,
            'latitude_degrees': this.dex_to_degrees(msg_parts.data.lat),
            'longitude_degrees': this.dex_to_degrees(msg_parts.data.lon),
            'speed': parseInt(msg_parts.data.speed),
            'altitude': msg_parts.data.altitude,
            'accuracy': msg_parts.data.accuracy,
            'batt': msg_parts.data.batt
        };

        return data;


    };

    this.get_start_data = function (msg_parts) {

        var data = {
            'id':msg_parts.data.id,
            'date': msg_parts.data.timestamp,
            'batt': msg_parts.data.batt,
            'data':msg_parts.data,
        };
        return data;
    };

    this.get_stop_data = function (msg_parts) {

        var data = {
            'id':msg_parts.data.id,
            'date': msg_parts.data.timestamp,
            'batt': msg_parts.data.batt
        };
        return data;
    };
    /* SET REFRESH TIME */
    this.set_refresh_time = function (interval, duration) {
    };
};
exports.adapter = adapter;
