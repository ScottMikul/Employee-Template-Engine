const fs = require("fs");
const inquirer = require("inquirer");

const Engineer = require("./lib/Engineer");
const Manager = require("./lib/Manager");
const Intern = require("./lib/Intern");


//initialize array
var employeeArray = [];
//prompt for what type of employee is being entered
var currEmployee = {};
 addEmployee = ()=>{
    inquirer.prompt([{"type":"list","name":"employeeType","message":"Select role:","choices":["Manager","Engineer","Intern"]}]).
    then((data)=>{
            //console.log("choice is " +data.employeeType)
            if(data.employeeType==="Manager"){
                currEmployee = new Manager();
            }else if(data.employeeType==="Engineer"){
                currEmployee = new Engineer();
            }else{
                currEmployee = new Intern();
            }
            // loop through employee properties and create a prompt array.
            let promptArr = [];
            for (const key in currEmployee) {
                promptArr.push({"type":"input","name":key,"message":"please enter the "+key+":"});
            }
            //use prompt array to gather data to construct the employee object
            inquirer.prompt(promptArr).then((data)=>{
                for (const key in data) {
                    currEmployee[key] = data[key];
                }
                //push object to array
                employeeArray.push(currEmployee);
                inquirer.prompt([{"type":"list","name":"more","message":"Would you like to add more employees?","choices":["Yes","No"]}])
                    .then((data)=>{
                        //if yes call the function again.
                        if(data.more==="Yes"){
                            addEmployee();
                        }
                        //else exit and start creating the htm file using the array
                        else{
                            buildHtml();
                        }
                    })
            })
        });
}

addEmployee();
buildHtml = ()=>{
        // html file string up to the point where we want to insert the employee html
    //for each employee
        //get template as the type
        //loop through properties of the object and replace {{key}} with propertyvalue in the html file
        //append the whole thing to the row of the main html section
    // append the remaining html to complete the file


}





const getACardFromTemplate = (fileName )=>{
    fs.readFile(__dirname+"\\templates\\"+ fileName, "utf-8", function(error, data){
        if(error){
            throw error;
        }
         let substring = data.substring(data.indexOf(`<section class="card">`), data.indexOf(`</section>`)+("</section>".length))
         //console.log(substring);
         return substring;
    })
}

//getACardFromTemplate("Engineer.html");