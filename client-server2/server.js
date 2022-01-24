var net = require('net');
const sqlite3=require('sqlite3')
const dataname="mabasedonnee.db"
//ouverture de la base de donnée :memory:

let bd=new sqlite3.Database(dataname, err=>{
    if(err){
        throw err;
    }
    else{
        console.log('database started on:',dataname)
    }

})

//creation de la table de données/////////////////////////////////////////////////////////
//bd.run(`CREATE TABLE test1(message VARCHAR(255), username VARCHAR(255),groupecree VARCHAR(255))`)
    
const chalk = require('chalk');
const { table } = require('console');
const { throws } = require('assert');
//objet literal des sender et leur socket
var dict={};
var userExclutdugroup={};
var namegrou={};
//objet associant un groupe et une liste de ses membres 
var publicGroup={};
// a la creation d'un groupe tues ajouter a la listre des personnees connectées
var listconnectes=[];
//dans le broadcast les message sont stockés dans cette liste
var historymessage=[]
//object interable des groupes privés avec les sockets des users
var priveGroup={}

const tab = Object.entries(namegrou);
//var groupser2={};
var server = net.createServer((socket)=>{ 
    console.log(socket.remoteAddress + 'CONNECTED from ' +':' + socket.remotePort);
    socket.on('data', function(data) {
            msg = JSON.parse(data);
            dict[`${msg.sender}`]=socket;
            dict[`${msg.dest}`]=socket
            namegrou[`${msg.group}`]=msg.sender;
        
       
      /* bd.each(`SELECT * FROM test1`, (err, data)=>{
            if(err){throw err}
            else{
                console.log(data)
            }
        
        })*/
        
            console.log('DATA received from ' + socket.remoteAddress + ':' + data)
            //console.log(`${data}`)
            const l = Object.keys(dict)
            const sockeet=Object.values(dict)
            const usergroups=Object.values(namegrou);
            const nameGroup=Object.keys(namegrou);
            console.log(l);
           
            //console.log(l)
            switch(msg.action){
            
                case 'cgroupe':
                    if(msg.typeg=="groupe privee"){
                        priveGroup[`${msg.group}`]=[]
                        priveGroup[`${msg.group}`].push(dict[msg.sender])
                        console.log(priveGroup[`${msg.group}`].includes(dict[msg.sender]))
                        bd.run(`INSERT INTO test1(message, username, groupecree) VALUES(?,?,?)`,["mess1", msg.sender, msg.group]);
                        listconnectes.push(msg.sender);
                       
                        //console.log( listGroup[`${msg.group}`].includes(dict[msg.sender]))
                      
                        dict[`${msg.sender}`].write(JSON.stringify({"sender": msg.sender,"action":'cgroupe', "msg":`vous avez cree un group prive`}))
                 
                    }
                    if(msg.typeg=="groupe public"){

                    bd.run(`INSERT INTO test1(message, username, groupecree) VALUES(?,?,?)`,["mess1", msg.sender, msg.group]);
                    listconnectes.push(msg.sender);
                    publicGroup[`${msg.group}`]=[];
                    //listGroup[`${msg.group}`]=[];     
                    publicGroup[`${msg.group}`].push(dict[msg.sender])
                    
                    //console.log( listGroup[`${msg.group}`].includes(dict[msg.sender]))
                  
                    dict[`${msg.sender}`].write(JSON.stringify({"sender": msg.sender,"action":'cgroupe', "msg":`vous avez cree un group public`}))
             
                    }
                    
                    break;

                case 'join':
                    
                    //pour joindre un groupe privée 
                    if(Object.keys(priveGroup).includes(msg.group)){
                        
                        dict[msg.sender].write(JSON.stringify({"DESOLE":"cest un groupe privee vous devez etre invite par un membre du groupe"}))
                    }
                    ////joindre un groupe public
                    if(Object.keys(publicGroup).includes(msg.group)){
                        //insertion de colonnne et valeurs //insertion de colonnne et valeurs 
                        bd.run(`INSERT INTO test1(message, username, groupecree) VALUES(?,?,?)`,["mess2", msg.sender, msg.group]);
                        
                        publicGroup[`${msg.group}`].push(dict[msg.sender])
                        listconnectes.push(msg.sender);
                        publicGroup[`${msg.group}`].forEach((socket) => {
                            socket.write(JSON.stringify({"sender": msg.sender,"action":'server-hello', "msg":`${msg.sender} a join le group`}));
                        });
                     //console.log(listconnectes);
                    //bd.run(`INSERT INTO test(message, username, groupecree) VALUES("message2", msg.sender, msg.group)`)
                    //publicGroup[`${msg.group}`]=[];     
                    //console.log( publicGroup[`${msg.group}`].includes(dict[msg.sender]))
           
                    }
                    //if(!Object.keys(publicGroup).includes(msg.group) & !Object.keys(priveGroup).includes(msg.group)==false){
                        /*else{
                        socket.write(JSON.stringify({"msg":`${msg.sender} le groupe n'existe pas desolee`}));
                       
                    }*/
                      
                   
                    break;

                case 'gbroadcast':
                   
                    if(Object.keys(priveGroup).includes(msg.group)){
                        var sockes;
                        Object.keys(dict).forEach((username)=>{
                            if(username==msg.sender){
                                sockes=dict[username]
                            }
                            else{
                                ////////////
                            }
                            
                        })

                       
                        priveGroup[`${msg.group}`].forEach((socket) => {
                            if(socket==sockes){
                                historymessage.push(msg.msg);
                                bd.run(`INSERT INTO test1(message, username, groupecree) VALUES(?,?,?)`,[msg.msg, msg.sender, msg.group]);
                                  
                        }
                        socket.write(JSON.stringify({"sender": msg.sender,"action":'gbroadcast', "msg":msg.msg}));
                       
                    })
                        /*else{
                            socket.write(JSON.stringify({"oups":" sorry"}))
                        }*/
 
                       
                       
                            }


                    if(Object.keys(publicGroup).includes(msg.group)){
                        historymessage.push(msg.msg);
                        //bd.run(`INSERT INTO test(message, username, groupecree) VALUES(msg.msg, msg.sender, msg.group)`)
                        bd.run(`INSERT INTO test1(message, username, groupecree) VALUES(?,?,?)`,[msg.msg, msg.sender, msg.group]);
                         publicGroup[`${msg.group}`].forEach((socket) => {
                             socket.write(JSON.stringify({"sender": msg.sender,"action":'gbroadcast', "msg":msg.msg}));
                         });

                    }

                    /*if(Object.keys(publicGroup).includes(msg.group)==false || Object.keys(priveGroup).includes(msg.group)==false){
                  
                        socket.write(JSON.stringify({ "msg":`${msg.sender}, ce groupe n'existe pas`}));
                  }*/
                    
                  
                  break;

                case 'members':

                       // bd.run(`INSERT INTO test(message, username, groupecree) VALUES("mess3", msg.sender, msg.group)`)
                        listconnectes.push(msg.sender);
                        dict[msg.sender].write(JSON.stringify({"listes des connectées": `${listconnectes}`}));
                  
                    //dict[msg.sender].write(JSON.stringify({"listes des connectées": `${listconnectes}`}));
           
                    break;
               

                case 'messages':
                    
                        dict[`${msg.sender}`].write(JSON.stringify({"sender": msg.sender,"action":'messages', "msg":historymessage}));
                   
                     break;
                   
                case 'list':
                    dict[msg.sender].write(JSON.stringify({"sender": msg.sender,"action":'list', "msg":Object.keys(listGroup)}));
  
                         break;

                case 'invite':
                    
                  
                    if(Object.keys(priveGroup).includes(msg.group)){
                        var soket;
                        Object.keys(dict).forEach((username)=>{
                            if(username==msg.sender){
                                soket=dict[username]
                            }
                            else{
                                ////////////
                            }
                            
                        })

                       
                        priveGroup[`${msg.group}`].forEach((socket) => {
                            if(socket==sockes){
                                
                                bd.run(`INSERT INTO test1(message, username, groupecree) VALUES(?,?,?)`,[msg.msg, msg.sender, msg.group]);
                                  
                        }
                        /*else{
                            socket.write(JSON.stringify({"oups":" sorry"}))
                        }*/
                        priveGroup[`${msg.group}`].push(dict[msg.dest])
                        socket.write(JSON.stringify({"sender": msg.sender,"action":'invite', "dest":msg.dest}));
                       
                    })
                        
 
                       
                       
                            }
                            




                    /*listGroup[`${msg.group}`].push(dict[msg.dest]);
                    //listGroup[`${msg.group}`].push(dict[msg.sender]);
                    listconnectes.push(msg.sender);
                   
                    listGroup[`${msg.group}`].forEach((sockets) => {
                        sockets.write(JSON.stringify({"sender": msg.sender,"action":'invite', "msg": `${msg.sender}` +"a invite"+`${msg.dest}`+"a rejoindre le groupe"+`${msg.group}`}));
                    });*/

                     break;
                  
            
                         
                case 'kick':
                    userExclutdugroup[msg.dest]=msg.msg
                    var sockets;
                   Object.values(dict).forEach((username) => {
                       if(msg.dest==username){
                            sockets=dict[username]
                       }
                       else{
                           ///////
                       }

                   })

                
                   var index;
                    listGroup[`${msg.group}`].forEach((socket) => {
                        if(socket==sockets){
                            index=listGroup[`${msg.group}`].indexOf(socket);
                            
                        }

                        listGroup[`${msg.group}`].splice(index,1)
                        //console.log(listGroup[`${msg.group}`].splice(index,1))
                        socket.write(JSON.stringify({"sender": msg.sender,"action":'kick', "msg":msg.sender +" "+"a exclut"+" "+msg.dest+" "+"du groupe"+" "+msg.group+" "+"en raison de "+" "+msg.reason}));
                       
                        
                    })
                     
                        break;
                        
                    case 'ban':
                        userExclutdugroup[msg.dest]=msg.msg;
                        if(Object.keys(dict).includes(msg.dest)){
                           
                            
                            delete listGroup.msg.dest;
                            console.log( listGroup[`${msg.group}`].includes(dict[msg.dest]))
                            listGroup[`${msg.group}`].forEach((socket) => {
                            socket.write(JSON.stringify({"sender": msg.sender,"action":'ban', "msg":msg.sender +" "+"a definitivement exclut"+" "+msg.dest+" "+"du groupe"+" "+msg.group+" "+"en raison de "+" "+msg.reason}));
                                 })
                        }
                       
                            else{
                                dict[msg.sender].write(JSON.stringify({"msg":`${msg.group}`+" "+"nest pas du groupe"}))
                            }
                        
                                 break;     
            
                    case 'states':

                        dict[msg.sender].write(JSON.stringify({"sender": msg.sender,"action":'states', "msg":"voici l'historique des messages"+" "+historymessage+" "+"ensuite ceux la ont été exclut du groupe et des raisons telles que"+" "+userExclutdugroup+" "+"il y a eu la creation des groupes suivants"+" "+Object.keys(listGroup)}));
                   
                        break;

                    case 'prive':
                        var user_socket;
                        Object.keys(dict).forEach(name=>{
                            if(name=msg.dest){
                                user_socket=dict[name]
                                user_socket.write(JSON.stringify({"sender":msg.sender,"action":"prive","msg":msg.msg}))
                            }
                            else{
                                dict[msg.sender].write(JSON.stringify({"mess":"n'est pas un user"}))
                            }
                        })
                        
                }



        })     

   /*bd.close(err=>{
       if(err)
       {console.log(err)}
   })*/
    }).listen(process.env.PORT, process.env.HOST);  