'use strict'

var configurationServiceUUID = 'ef680001-9b35-4933-9b10-52ffa9740042';
var deviceNameCharacteristicUUID = 'ef680002-9b35-4933-9b10-52ffa9740042';
var advertisingParamCharacteristicUUID = 'ef680003-9b35-4933-9b10-52ffa9740042';
var appearanceCharacteristicUUID = 'ef680004-9b35-4933-9b10-52ffa9740042';
var connectionParamCharacteristicUUID = 'ef680005-9b35-4933-9b10-52ffa9740042';


var weatherStationServiceUUID = '20080001-e36f-4648-91c6-9e86ead38764';
//var temperatureCharacteristicUUID = '20080002-e36f-4648-91c6-9e86ead38764';
//var pressureCharacteristicUUID = '20080003-e36f-4648-91c6-9e86ead38764';
//var humidityCharacteristicUUID = '20080004-e36f-4648-91c6-9e86ead38764';
var configurationCharacteristicUUID = '20080005-e36f-4648-91c6-9e86ead38764';
var demoCharacteristicUUID = '20080002-e36f-4648-91c6-9e86ead38764';

var userInterfaceServiceUUID = 'C7AE0001-3266-4A5C-859F-0F4799146BB5';
var ledCharacteristicUUID = 'C7AE0002-3266-4A5C-859F-0F4799146BB5';
var buttonCharacteristicUUID = 'C7AE0003-3266-4A5C-859F-0F4799146BB5';

var weatherStationConfig = {
    pressureInterval:1000,
    temperatureInterval:1000,
    humidityInterval:1000,
    pressureMode:0
};

var isConnecting = false;
var isConnected = false;
var sInterval;
var sTimeout;
var humidity;
var temperature;
var pressure;
var bleDevice;
var bleServer;
var bleService;
var pressureChar;
var humidityChar;
var temperatureChar;
var pressureString;
var humidityString;
var temperatureString;

window.onload = function(){
  document.querySelector('#connect').addEventListener('click', getAll);
  document.querySelector('#disconnect').addEventListener('click', stopAll);
  document.querySelector('#load-configuration').addEventListener('click', loadConfiguration);
  document.querySelector('#apply-configuration').addEventListener('click', applyConfiguration);
};

function applyConfiguration(){
  log('> applyConfiguration()');
  log(weatherStationConfig);

  let pInterval = parseFloat(document.getElementById("pressure-interval").value);
  log(pInterval);
  let tInterval = document.getElementById("temperature-interval").value;
  log(tInterval);
  let hInterval = document.getElementById("humidity-interval").value;
  log(hInterval);
  let pMode;

  //  get the checked button toggle
  let temp = $("input[name='options']:checked").val();
  if(temp == 'barometer'){
    pMode = 0;
  }
  else{
    pMode = 1;
  }

  if (!navigator.bluetooth) {
    log('Web Bluetooth API is not available.\n' +
        'Please make sure the Web Bluetooth flag is enabled.');
    return;
  }
  log('Requesting Bluetooth Device...');
  navigator.bluetooth.requestDevice({filters: [
    {services: [configurationServiceUUID]},
    {services: [weatherStationServiceUUID]}
    ]
  })
  .then(device => {
    log(device);
    return device.connectGATT();
  })
  .then(server => {
    log(server);
    return server.getPrimaryService(weatherStationServiceUUID);
  })
  .then(service => {
    log(service);
    return service.getCharacteristic(configurationCharacteristicUUID);
  })
  .then(characteristic => {
    log(characteristic);
    let data2 = new Uint8Array([0,1,0,1,0,1,1]);
    log(data2);
    for(let i = 0; i<7; i++){
      log(data2[i]);
    }
    let data = new Uint8Array(7);
    data[0] = tInterval & 0xff;
    data[1] = (tInterval >> 8) & 0xff;
    data[2] = pInterval & 0xff;
    data[3] = (pInterval  >> 8) & 0xff;
    data[4] = hInterval & 0xff;
    data[5] = (hInterval  >> 8) & 0xff;
    data[6] = pMode;

    log('data: ' + data);
    for(let i = 0; i<7; i++){
      log(i + ': ' + data[i]);
    }
    return characteristic.writeValue(data);
  })
  .then(value => {
    log('This data was sent: ' + value);
  return value;
  })
  .catch(error => {
  log('> applyConfiguration() ' + error);
  });
}


function loadConfiguration(){
  log('> loadConfiguration()');
  log(weatherStationConfig);
  log(weatherStationConfig.pressureInterval);
  if (!navigator.bluetooth) {
    log('Web Bluetooth API is not available.\n' +
        'Please make sure the Web Bluetooth flag is enabled.');
    return;
  }
  log('Requesting Bluetooth Device...');

  navigator.bluetooth.requestDevice({filters: [
    {services: [configurationServiceUUID]},
    {services: [weatherStationServiceUUID]}
    ]
  })
  .then(device => {
    log(device);
    return device.connectGATT();
  })
  .then(server => {
    log(server);
    return server.getPrimaryService(weatherStationServiceUUID);
})
  .then(service => {
    log(service);

    bleService.getCharacteristic(configurationCharacteristicUUID)
  })
  .then(characteristic => {
    log(characteristic);
    return characteristic.readValue();
  })
  .then(value => {
    log(value);
    let temp = value.buffer ? value : new DataView(value);
    log(temp);
  return handleConfiguration(value);
  })
  .catch(error => {
  log('> loadConfiguration() ' + error);
    });
}

function handleConfiguration(value){
  value = value.buffer ? value : new DataView(value);
  weatherStationConfig.temperatureInterval = value.getUint8(0) | ((value.getUint8(1) << 8 )&0xff00);
  weatherStationConfig.pressureInterval = value.getUint8(2) | ((value.getUint8(3) << 8 )&0xff00);
  weatherStationConfig.humidityInterval = value.getUint8(4) | ((value.getUint8(5) << 8 )&0xff00);
  weatherStationConfig.pressureMode = value.getUint8(6);
  log('weatherStationConfig.temperatureInterval: ' + weatherStationConfig.temperatureInterval);
  log('weatherStationConfig.pressureInterval: ' + weatherStationConfig.pressureInterval);
  log('weatherStationConfig.humidityInterval: ' + weatherStationConfig.humidityInterval);
  log('weatherStationConfig.pressureMode: ' + weatherStationConfig.pressureMode);
  document.getElementById("pressure-interval").value = weatherStationConfig.pressureInterval;
  document.getElementById("humidity-interval").value = weatherStationConfig.humidityInterval;
  document.getElementById("temperature-interval").value = weatherStationConfig.temperatureInterval;

  if(weatherStationConfig.pressureMode == 0){
    $('#pressure-barometer').toggleClass('active');
  }
  else{
    $('#pressure-altimeter').toggleClass('active');
  }
}

function log(text) {
    document.querySelector('#log').textContent += text + '\n';
    console.log(text);
}

function setConnecting(connecting) {
    isConnecting = connecting;
    if (connecting) {
        document.querySelector('#connect').style.display = "none";
    }
    else {
        document.querySelector('#connect').style.display = "float";
    }
}

function setConnected(connected) {
    isConnected = connected;
    if (connected) {
        document.querySelector('#connect').style.display = "none";
        document.querySelector('#disconnect').style.display = "float";
    }
    else {
        document.querySelector('#connect').style.display = "float";
        document.querySelector('#disconnect').style.display = "none";
        sServer.disconnect();
    }
}

function getAll() {
  if (!navigator.bluetooth) {
      log('Web Bluetooth API is not available.\n' +
          'Please make sure the Web Bluetooth flag is enabled.');
      return;
  }
  log('Requesting Bluetooth Device...');
  navigator.bluetooth.requestDevice({filters: [
    {services: [configurationServiceUUID]},
    {services: [weatherStationServiceUUID]}
    ]
  })
  .then(device => device.connectGATT())
  .then(server => {
    bleServer = server;
    log('Got bleServer');
    return server.getPrimaryService(weatherStationServiceUUID);
  })
  .then(service => {
    log('Got bleService');
    bleService = service;
    return service.getCharacteristic(demoCharacteristicUUID)
  })
  .then( characteristic => {
    log('Got demoCharacteristic');
    temperatureChar = characteristic;
    return characteristic.startNotifications();
  })
  .then(() => {
    temperatureChar.addEventListener('characteristicvaluechanged',handleNotifyTemperature);
  })


  .then(startCloudLogging())
  .catch(error => {
    log('> getAll() ' + error);
  });
}



function stopAll() {
  log('> stopAll()')
  if (temperatureChar) {
    temperatureChar.stopNotifications().then(() => {
      temperatureChar.removeEventListener('characteristicvaluechanged',handleNotifyTemperature);
      log('> Temperature notifications stopped');
    });
  }
  stopCloudLogging();
}

function handleNotifyTemperature(event) {
  let value = event.target.value;
  value = value.buffer ? value : new DataView(value);
  let temperature_int = value.getUint8(0);
  let temperature_dec = value.getUint8(1);
  temperatureString = temperature_int.toString() + '.' + temperature_dec.toString();
  log('Temperature is ' + temperature_int + '.' + temperature_dec + 'C');
  document.getElementById("temperature_reading").innerHTML = temperature_int + '.' + temperature_dec + '&deg;C';

  let pressure_integer = value.getInt32(2, true);
  let pressure_decimal = value.getUint8(6);
  let pressure_pascal = pressure_integer + pressure_decimal / 1000;
  let pressure_hpascal = pressure_pascal / 100;
  pressureString = pressure_hpascal.toString();
  log('Pressure is ' + pressure_hpascal + 'hPa');
  document.getElementById("pressure_reading").innerHTML = pressure_hpascal.toFixed(3) + 'hPa';

  let humidity_int = value.getUint8(7);
  humidityString = humidity_int.toString();
  log('Humidity is ' + humidity_int + '%');
  document.getElementById("humidity_reading").innerHTML = humidity_int +"%";
}


function swap32(val) {
    return ((val & 0xFF) << 24)
           | ((val & 0xFF00) << 8)
           | ((val >> 8) & 0xFF00)
           | ((val >> 24) & 0xFF);
}

function stop(event) {
    log("stop(" + event + ")");
    try {
        sCharacteristic.writeValue(new Uint8Array([0, 0, 0, 0, 0, 0]));
        event.preventDefault();
    } catch (error) {
        log(error);
    }
}

function disconnectDevice(){
  document.querySelector('#connect').style.display = "block";
  document.querySelector('#disconnect').style.display = "none";
  sServer.disconnect();
  log("Disconnected.");
}