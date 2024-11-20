const EventEmitter = require('events');
    const event_emitter = new EventEmitter();
    event_emitter.setMaxListeners(2);
    const total_valid_events=event_emitter.getMaxListeners();


    function main(req, res) {
        event_emitter.once('myEvent2', (msg) => {
            console.log("once1");
            // res.send(msg);
         });
        event_emitter.once('myEvent2', (msg) => {
            console.log("once2");
            // res.send(msg);
         });

        // Define the callback function for the event
const myEventHandler = (msg) => {
    console.log("msgon111");
    // res.send(msg); // Uncomment if you want to send a response
};

// Add the listener for 'myEvent'
event_emitter.on('myEvent', myEventHandler);

// Later, when you want to remove the listener
event_emitter.off('myEvent', myEventHandler);
        //  event_emitter.on('myEvent1', (msg) => {
        //     console.log("msg2");
        //     // res.send(msg);
        //  });
        //  event_emitter.on('myEvent3', (msg) => {
        //     console.log("msg3");
        //     // res.send(msg);
        //  });
        //  event_emitter.on('myEvent4', (msg) => {
        //     console.log("msg4");
        //     // res.send(msg);
        //  });
        //  event_emitter.on('myEvent5', (msg) => {
        //     console.log("msg5");
        //     // res.send(msg);
        //  });
        //  event_emitter.on('myEvent6', (msg) => {
        //     console.log("msg6");
        //     // res.send(msg);
        //  });
        //  event_emitter.on('myEvent7', (msg) => {
        //     console.log("myEvent7");
        //     // res.send(msg);
        //  });
        //  event_emitter.on('myEvent8', (msg) => {
        //     console.log("myEvent8");
        //     // res.send(msg);
        //  }); 
        //  event_emitter.on('myEvent9', (msg) => {
        //     console.log("myEvent9");
        //     // res.send(msg);
        //  });
        //  event_emitter.on('myEvent10', (msg) => {
        //     console.log("myEvent10");
        //     // res.send(msg);
        //  });
        //  event_emitter.on('myEvent11', (msg) => {
        //     console.log("myEvent11");
        //     // res.send(msg);
        //  });
        //  event_emitter.on('myEvent12', (msg) => {
        //     console.log("myEvent12");
        //     // res.send(msg);
        //  });
        //  event_emitter.on('myEvent13', (msg) => {
        //     console.log("myEvent13");
        //     // res.send(msg);
        //  });
        //  event_emitter.on('myEvent14', (msg) => {
        //     console.log("myEvent14");
        //     // res.send(msg);
        //  });
        //  event_emitter.on('myEvent15', (msg) => {
        //     console.log("myEvent15");
        //     // res.send(msg);
        //  });
        //  event_emitter.on('myEvent16', (msg) => {
        //     console.log("myEvent16");
        //     // res.send(msg);
        //  });
        //  event_emitter.on('myEvent17', (msg) => {
        //     console.log("myEvent17");
        //     // res.send(msg);
        //  });
        //  event_emitter.on('myEvent18', (msg) => {
        //     console.log("myEvent18");
        //     // res.send(msg);
        //  });
        //  event_emitter.on('myEvent19', (msg) => {
        //     console.log("myEvent19");
        //     // res.send(msg);
        //  });
         
        //  event_emitter.on('myEvent19', (msg) => {
        //     console.log("myEvent19");
        //     // res.send(msg);
        //  }); 
        //    event_emitter.on('myEvent19', (msg) => {
        //     console.log("myEvent19");
        //     // res.send(msg);
        //  });  
        //   event_emitter.on('myEvent19', (msg) => {
        //     console.log("myEvent19");
        //     // res.send(msg);
        //  });  
        //   event_emitter.on('myEvent19', (msg) => {
        //     console.log("myEvent19");
        //     // res.send(msg);
        //  }); 
        //    event_emitter.on('myEvent19', (msg) => {
        //     console.log("myEvent19");
        //     // res.send(msg);
        //  }); 
        //    event_emitter.on('myEvent19', (msg) => {
        //     console.log("myEvent19");
        //     // res.send(msg);
        //  }); 
        //    event_emitter.on('myEvent19', (msg) => {
        //     console.log("myEvent19");
        //     // res.send(msg);
        //  });  
        //   event_emitter.on('myEvent19', (msg) => {
        //     console.log("myEvent19");
        //     // res.send(msg);
        //  });  
        //     event_emitter.on('myEvent19', (msg) => {
        //     console.log("myEvent19");
        //     // res.send(msg);
        //  }); 
        //  event_emitter.on('myEvent19', (msg) => {
        //     console.log("myEvent19");
        //     // res.send(msg);
        //  }); 
        //  event_emitter.on('myEvent19', (msg) => {
        //     console.log("myEvent19");
        //     // res.send(msg);
        //  }); 
        //  event_emitter.on('myEvent19', (msg) => {
        //     console.log("myEvent19");
        //     // res.send(msg);
        //  }); 
        //    event_emitter.on('myEvent19', (msg) => {
        //     console.log("myEvent19");
        //     // res.send(msg);
        //  });

        //  event_emitter.emit('myEvent', "First event");
        // //  event_emitter.emit('myEvent', "First event");
        // //  event_emitter.emit('myEvent', "First event");
        // //  event_emitter.emit('myEvent', "First event");
        //  event_emitter.emit('myEvent1', "First event");
        //  event_emitter.emit('myEvent3', "First event");
        //  event_emitter.emit('myEvent4', "First event");
        //  event_emitter.emit('myEvent5', "First event");
        //  event_emitter.emit('myEvent6', "First event");
        //  event_emitter.emit('myEvent7', "First event");
        //  event_emitter.emit('myEvent8', "First event");
        //  event_emitter.emit('myEvent9', "First event");
        //  event_emitter.emit('myEvent10', "First event");
        //  event_emitter.emit('myEvent11', "First event");
        //  event_emitter.emit('myEvent12', "First event");
        //  event_emitter.emit('myEvent13', "First event");
        //  event_emitter.emit('myEvent14', "First event");
        //  event_emitter.emit('myEvent15', "First event");
        //  event_emitter.emit('myEvent16', "First event");
        //  event_emitter.emit('myEvent17', "First event");
        //  event_emitter.emit('myEvent18', "First event");
        //  event_emitter.emit('myEvent19', "First event");

        event_emitter.emit('myEvent', "First eeevent");

         event_emitter.emit('myEvent2', "First event");
        //  event_emitter.emit('myEvent2', "First event");
        //  event_emitter.emit('myEvent2', "First event");
        //  event_emitter.emit('myEvent2', "First event");
        //  event_emitter.emit('myEvent2', "First event");
        //  event_emitter.emit('myEvent2', "First event");

         res.send("msg trigger");
         
    }
    module.exports = {
        main
    }