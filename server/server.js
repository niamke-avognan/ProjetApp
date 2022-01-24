
var net = require('net');
var deb=require('debug');
const chalk = require('chalk');
var serversend=deb('server')
var dict={};
var server = net.createServer((socket)=>{
    
    serversend('CONNECTED from ' + socket.remoteAddress + ':' + socket.remotePort);
    socket.on('data', function(data) {
            msg = JSON.parse(data);
            dict[`${msg.sender}`]=socket
            const l = Object.keys(dict)
            const sockets=Object.values(dict)
            switch(msg.action){
            
                case 'hello-client':

                    socket.write(JSON.stringify({"sender": msg.sender,"action":'server-hello', "msg": "message_content"}));
                break;

                case 'client-send':
                    
                    //console.log(dict);
                    for(var i=0; i<l.length; i++){
                        if(msg.dest==l[i]){
                            process.stdout.write('>');
                            //dict[l[i]].write(halk.blue(`${msg.sender}`);
                            //dict[l[i]].write(JSON.stringify({"sender": msg.sender, "dest": msg.dest ,"msg": msg.msg ,"action":'client-send'}));
                            dict[l[i]].write(chalk.blue(`${msg.sender}`+">"+`${msg.msg}`));
                            

                        }
                        else{
                            serversend(msg.dest ,"ne s'est jamais connecté sur le server")
                        }


                    }  
                    //console.log(l); 
                    break;
                case 'client-broadcast':
                    sockets.forEach((values)=>{
                        values.write(chalk.blue(msg.sender +"  "+"is connect"))

                    })
                    /*if(l.length!=0){
                        
                        for(var i=0 ; i<l.length; i++){
                            dict[msg.sender].write(chalk.red(l[i] +"s'est connecté"));
                            dict[l[i]].write(JSON.stringify({"sender": msg.sender,"action":'client-broadcast', "msg": msg.msg}));
                            
                            
                    }        
                        }
                   */
                
                
                   
                break;

                case 'client-quit':

                  
                    console.log(msg.sender+"a quitté le serveur");
                    dict[msg.sender].write("vous avez quitté le serveur")
                    dict[msg.sender].destroy();

                break;

                
                case 'client-list-clients':

                    dict[msg.sender].write(JSON.stringify({"listes des connectés":l}));
                    //console.log(l);
                break;

            }
        })
        
    }).listen(process.env.PORT, process.env.HOST);    