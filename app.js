const ps = require("prompt-sync"); // Dependency: prompt-sync for user input
const prompt = ps();
const http = require("http"); // Built-in module for making HTTP requests
const { json } = require("stream/consumers");
const { response } = require("express");
const { error } = require("console");
var sessionID = "";

// Authentication credentials
const data = JSON.stringify({
  DomainName: 'GGV3',
  UserName: 'Shreyansh',
  Password: 'Shreyansh',
});

// Function to generate request options
const option_Func = (meth, path, id) => {
  var options = {
    host: "localhost",
    port: 8092,
    path: "/api.svc/api" + path,
    method: meth,
    headers: {
      SessionId: id,
      "Content-Type": "application/json; charset=UTF-8",
      Accept: "application/json; charset=UTF-8",
    },
  };
  return options;
};

let suffix = "/Credential/Connect";
let metho = "POST";

// Request to authenticate and obtain session ID
let httpreq = http.request(option_Func(metho, suffix, null), (response) => {
  console.log("statusCode:", response.statusCode);
  console.log("headers:", response.headers);

  response.on("data", (d) => {
    sessionID = JSON.parse(d);
    console.log(typeof sessionID);
    console.log(sessionID);
  });
});

httpreq.on("error", (error) => {
  console.log("An error", error);
});
httpreq.write(data);
httpreq.end();

// setTimeout(createRec, 500);
 setTimeout(retriveData,600);
//setTimeout(() => DeleteRecord(), 600); // Trigger the DeleteRecord function after 600 milliseconds

function createRec() {
  // Code to create a new record
  let rec_data = JSON.stringify({
    FirstName: "Rahul",
    LastName: "Sharma",
  });

  let recpath = "/Business_Contact/CreateRecord";
  let recmeth = "POST";
  let option = option_Func(recmeth, recpath, sessionID);
  console.log(JSON.stringify(option));
  let httpreq2 = http.request(option, (response) => {
    console.log("statusCode:", response.statusCode);
    console.log("headers:", response.headers);

    response.on("data", (d) => {
      process.stdout.write(d);
      
    });
  });
  httpreq2.on("error", (error) => {
    console.log("An error", error.message);
  });
  httpreq2.write(rec_data);
  httpreq2.end();
}




function retriveData() {
  // Code to retrieve records
   // let option = option_Func("GET","/Business_Contact/RetrieveMultipleRecords",sessionID);
   const RETdata = JSON.stringify({
    Columns:'FirstName,LastName,Business_ContactId',
    OrderBy:'FirstName',
  });
  let options = {
    host: "localhost",
    method: 'POST',
    port: 8092,
    path: "/api.svc/api/Business_Contact/RetrieveMultipleRecords",
    headers: {
      'SessionId': sessionID,
    },
  };
  let httpreq3 = http.request(options, (response) => {
    console.log("statusCode:", response.statusCode);
    console.log("headers:", response.headers);
      response.on("data", (chunk) => {
        console.log(JSON.parse(chunk));
      });
    })
    .on("error", (error) => {
      console.log("Error in Retriving: ", error);
    })
    httpreq3.write(RETdata)
    httpreq3.end();
}



function DeleteRecord() {
  // ID of the record to be deleted
  let Del_data = JSON.stringify({
    Business_ContactId: "48c6345a-85c8-4a37-8012-89752757361f",
  });

  // Request options for deleting the record
  let option = option_Func('POST', '/Business_Contact/DeleteRecord', sessionID);

  // Send the delete request
  const httpreq4 = http.request(option, (response) => {
    console.log(response.statusCode)
  });

  httpreq4.on('error', (error) => {
    console.log('error while Deleting :', error)
  });

  httpreq4.write(Del_data);
  httpreq4.end();
}
