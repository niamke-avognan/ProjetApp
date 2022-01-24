export function gener(conste){
    var a=conste[0];
    switch(a){
      case "s":
        console.log("message privé")
        break;
      case "b":
        console.log("message de type broadcast")
          break;
      default :
        console.log("type de message inexistant");
       break; 

}
}