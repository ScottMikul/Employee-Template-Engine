const fs = require("fs");
const inquirer = require("inquirer");

const Engineer = require("./lib/Engineer");
const Manager = require("./lib/Manager");
const Intern = require("./lib/Intern");

//array to store each employee we add.
let employeeArray = [];
addEmployee = () => {
  inquirer
    .prompt([
      {
        type: "list",
        name: "employeeType",
        message: "Select role:",
        choices: [
          { name: "Manager", value: new Manager() },
          { name: "Engineer", value: new Engineer() },
          { name: "Intern", value: new Intern() }
        ]
      }
    ])
    .then(data => {
      const currEmployee = data.employeeType;
      // loop through employee properties and create a prompt array.
      let promptArr = [];
      for (const key in currEmployee) {
        promptArr.push({
          type: "input",
          name: key,
          message: "please enter the " + key + ":"
        });
      }
      //use prompt array to gather data to construct the employee object
      inquirer.prompt(promptArr).then(data => {
        for (const key in data) {
          currEmployee[key] = data[key];
        }
        //push object to array
        employeeArray.push(currEmployee);
        inquirer
          .prompt([
            {
              type: "list",
              name: "more",
              message: "Would you like to add more employees?",
              choices: ["Yes", "No"]
            }
          ])
          .then(data => {
            //if yes call the function again.
            if (data.more === "Yes") {
              addEmployee();
            }
            //else exit and start creating the html file using the array
            else {
              buildHtml();
            }
          });
      });
    });
};

addEmployee();

buildHtml = () => {
  fs.readFile(`${__dirname}/templates/Main.html`, "utf-8", (error, data) => {
    if (error) {
      throw error;
    }
    // html file string up to the point where we want to insert the employee html
    let MainStart = data.substring(
      0,
      data.indexOf(`<section class="row">`) + `<section class="row">`.length
    );
    let MainEmployeeSection = "";
    let MainEnd = data.substring(data.indexOf(`</section>`));
    //get template files as a string according to the employeetype from employee array

    // create a chain of promisses to read all the appropriate html files.
    const promiseArray = [];
    employeeArray.forEach(employee => {
      promiseArray.push(
        getACardFromTemplate(`${employee.constructor.name}.html`)
      );
    });
    Promise.all(promiseArray)
      .then(data => {
        data.forEach((employeeeStr, indexInEmployeeArr) => {
          // edit the string with the employee data.
          const object = employeeArray[indexInEmployeeArr];
          for (const key in object) {
            employeeeStr = employeeeStr.replace(`{{${key}}}`, object[key]);
          }
          MainEmployeeSection += employeeeStr;
          console.log(employeeeStr);
        });
        //combine start code from main , the employee part, and then the closing html
        const resultStr = MainStart + MainEmployeeSection + MainEnd;
        //write it to a file in the output directory
        fs.writeFile(
          `${__dirname}/output/output.html`,
          resultStr,
          { flag: "w" },
          err => {
            if (err) {
              throw err;
            }
          }
        );
      })
      .catch(error => {
        throw error;
      });
  });
};

//fetch the card portion of html from the template
const getACardFromTemplate = async fileName => {
  return new Promise((resolve, reject) => {
    fs.readFile(__dirname + "\\templates\\" + fileName, "utf-8", function(
      error,
      data
    ) {
      if (error) {
        reject(error);
      }
      let substring = data.substring(
        data.indexOf(`<section class="card col-4">`),
        data.indexOf(`</section>`) + "</section>".length
      );
      resolve(substring);
    });
  });
};
