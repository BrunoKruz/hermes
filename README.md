# Hermes

This is a abstraction over amqplib to help simplify certain common tasks and reduce the effort required to use RabbitMQ in your Node App.

### Assumptions & Defaults:

 * Fault-tolerance/resilience over throughput
 * Default to publish confirmation
 * Default to ack mode on consumers
 * Heterogenous services that include statically typed languages
 * JSON as the only serialization provider

### Features:

 * Handle re-connections
 * Automatically re-define all topology on re-connection
 * Automatically re-send any unconfirmed messages on re-connection
 * Support the majority of RabbitMQ's extensions
 * Handle batching of acknowledgements and rejections
 * Topology & configuration via the JSON
 * Automatically detect server connection lose

### Publish

The publish call returns a promise that is only resolved once the broker has accepted responsibility for the message (see [Publisher Acknowledgments](https://www.rabbitmq.com/confirms.html) for more details). If a configured timeout is reached, or in the rare event that the broker rejects the message, the promise will be rejected. More commonly, the connection to the broker could be lost before the message is confirmed and you end up with a message in "limbo", but we keeps a list of unconfirmed messages that have been published _in "memory" only_. 

### CONFIG FILE 

```javascript
    "connection": {        
        "user": "guest",
        "pass": "guest",
        "server": "localhost",
        "vhost": ""      
    },         
    "exchanges":[{  
        "name": "hermes.main",
        "type": "direct"         
    }],         
    "queues": [{ 
        "name": "hermes-message-q"        
    }],         
    "bindings": [{             
        "exchange": "hermes.main",             
        "target": "hermes-message-q"         
    }]  
```     

### Publishing Messages

```javascript
// the first 3 arguments are required
// routing key is optional and defaults to the value of typeName
// connectionName is only needed if you have multiple connections to different servers or vhosts

ct';

var rabbit = require('lendico-hermes');
var rabbitcon = require('./../config.js');
var logger = require('../../utility/logger');

var publish = function (msg) {
  logger.info('[Rabbit Publisher] Trying send message to rabbitMQ.');  
  return rabbit.configure(config)
        .then(sendMessage(msg))
        .then(undefined, reportErrors);
//process.exit();
};

function reportErrors (err) {
    logger.error('[Rabbit Publisher] Message was not sent ' + err.stack);
    return err;
}

var sendMessage = function(msg) {

	rabbit.publish(config.exchanges[0].name, {
	        type: "hermes.incoming.type",
	        routingKey: "",
	        body: msg
	});

    logger.info('[Rabbit Publisher] Message sent');   
};


module.exports = {
    publish: publish
};
```        

### Subscribe Queue 

```javascript
var rabbit = require('lendico-hermes');
var rabbitcon = require('./../config.js');
var logger = require('../../utility/logger');

            
var startMQListen = function () {
    logger.info('[Rabbit Subscriber] Connecting in the queue - ' + rabbitcon.queues[0].name);
    rabbit.configure(rabbitcon)
                .then(processMessage)
                .then(undefined, reportErrors);
};

/**
 * Sets up a a message handler and a listener.uu
 */
var processMessage = function () {
    // set all the handlers before starting subscription
    rabbit.handle('crm.incoming.type', handleMessage);

    // start subscription
    rabbit.startSubscription(rabbitcon.queues[0].name);
    logger.info('[Rabbit Subscriber] Listening queue: ' + rabbitcon.queues[0].name);
};

/**
 * Handles incoming messages
 *
 * @param {Object} message
 */
function handleMessage (message) {
    var body = message.body;
    console.log('Your message is ', message);

    message.ack();
}

function reportErrors (err) {
    logger.error('[Rabbit Subscriber] Message was not collected - ' + err);
}


//startMQListen(process.argv[2]);


module.exports = {
    startMQListen: startMQListen
};
```