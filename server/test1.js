/*var ecole =require('debug')

var math = ecole("math")
math("j'aime les math")

var mathematique = ecole("mathematique")
mathematique("j'aime les math")

var ph = ecole("phy")
ph("je desteste la phy")

var dic={}//{olivia:"de",sou:"malade"}
    const l=Object.keys(dic)
l.forEach(element => { 
    console.log(dic[element])
 
    
});
console.log(l.length)

var name1 = "oli;wilfried"
var name2 = "oli"

var firstElement = name2.split(";")[0]
console.log(firstElement)
import chalk from 'chalk'
    var a="olivia";
    console.log(chalk.red(a));

    import chalk from 'chalk';

    console.log(chalk.blue('Hello world!'));*/

    

//console.log(bold().red('this is a bold red message'));
//console.log(bold().italic('this is a bold italicized message'));
//console.log(bold().yellow().bgRed().italic('this is a bold yellow italicized message'));
//console.log(green().bold().underline('this is a bold green underlined message'));
const chalk = require('chalk');
const inquirer = require('inquirer');
//const log=console.log;
console.log(chalk.red("olivia"))


inquirer.prompt([
      {
    type: 'input',
    message: 'queel est votre nom ',
    name: 'firstname',
},

{
    type :'confirm',
    message:'vous etes membres du groupe ? ',
    default: false,
    name: 'presen',
   
},

{
    type :'confirm',
    message:'vous etes majeurs? ',
    default: false,
    name: 'major',
    When:answers => answers.presen
}
   
   
  ])
  .then(answers) //=> {
    //console.log(`bonjour ${answers.firstname} when: ${answers.major} ? "vous avez votre permis" `);
  //})



    