var net = require('net');
var client = new net.Socket();
const {debug}=require('debug');
var cleintsm=debug('client')
const { Socket } = require('dgram');
const { bold, green } = require('kleur');

const{argv}=require('process')
var sender_name=argv[2];

client.connect(process.env.PORT, process.env.HOST, function() 
{
    
   cleintsm('Connected');
    //client.write(JSON.stringify({"sender":sender_name ,"action":"hello-client"}))
    //process.stdout.write('>');
});

client.on('data', function(data) {
    cleintsm('Received: ' + data);
    process.stdout.write('>');
});

process.stdin.resume();
process.stdin.setEncoding('utf8');
process.stdout.write('>');
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout,
  });
   
readline.on('line',(text)=>{
      
      if(text=="hello"){
          //console.log("ok");
            client.write(JSON.stringify({"sender": sender_name, "action":"hello-client"}))
                  
      }
      else{
        var texList = text.split(';')
		    switch(texList[0]){
            case 's':
                    var receiver_name = texList[1]
                    var message_content = texList[2]
                    client.write(JSON.stringify({"sender": sender_name, "dest": receiver_name ,"msg": message_content ,"action":'client-send'}))
                    break;  
             case 'b':
                   
                    var message_content = texList[1]
                    client.write(JSON.stringify({"sender": sender_name,"msg": message_content ,"action":'client-broadcast'}))
                    break;
                    
            case 'q':
              client.write(JSON.stringify({"sender": sender_name ,"action":'client-quit'}));

            case 'ls':
              client.write(JSON.stringify({"sender": sender_name ,"action":'client-list-clients'}))
            }
        }
});
