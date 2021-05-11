import mqtt from 'mqtt';


const url = 'wss://test.mosquitto.org:8081';
const options = {
    // username:"wc2",
    // password:"l4c0ntr4s3n4",
    connectTimeout: 4000, // Time out
    reconnectPeriod: 4000, // Reconnection interval
};

function connect (){
    
    const client = mqtt.connect(url, options);
    
    client.on('error', function (error) {
        console.log('🚨 Error: ' + error);
    });

    client.on('close', function () {
        console.log('🔌 Connection has been closed');
    });

    client.on('reconnect', function () {
        console.log('⏳ Reconnecting...');
    });

    client.on('connect', function () {
        
        console.log('✅ Connected!');
    });

    return client
}


const eventMQTT = {}

eventMQTT.install = function(Vue){
    Vue.prototype.$mqtt = connect
}

export default eventMQTT
