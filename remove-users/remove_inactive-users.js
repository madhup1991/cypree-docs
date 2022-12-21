const  core  = require( "@actions/core");
const {Octokit} = require("@octokit/rest");
const { createActionAuth } = require("@octokit/auth-action");
const fs = require("fs");
const { parse } = require("csv-parse");
const { stringify } = require("csv-stringify");
const { Console } = require("console");


function run() {
const octokit = new Octokit({
    auth: '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'
  })

  const userDeleteStatus=[];

 fs.createReadStream("./data/inactive.csv")
 .pipe(
   parse({
     delimiter: ",",
     columns: true,
     ltrim: true,
     errorOnExist: false
   })
 ).on("data", function (row) { 
      userDeleteStatus.push(row.login);
     
 })
 .on("end", () => {
  var data ='login,Status';
  data +='\n';

  const main = async() =>{
    let rctr=0;

  for(let x in userDeleteStatus){
  let status ='';
    try {
      res=  await octokit.request('DELETE /orgs/{org}/members/{username}', {
       org: 'philips-internal',
       username: userDeleteStatus[x]
     });
     status ='User Removed'
      rctr+=1;
       } catch (e) {
               status ='User Not found'
                     }  
  
      data += userDeleteStatus[x]+','+status;
      data +='\n';
  }
  
  fs.writeFileSync("./data/inactive_updated_12thDec.csv", data);
  console.log('############################################');
  console.log("Total Length "+userDeleteStatus.length);
  console.log("Total User Removed "+rctr);
  console.log("User Not Found "+(userDeleteStatus.length-rctr));
  console.log('############################################');

}

   main();
});

  }

run();