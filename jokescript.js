var url = "http://official-joke-api.appspot.com/jokes/programming/random"; //This is the URL for the API

//Grab references for the location of the joke set up line and punchline
//It is important to stick to what the api uses for the variables.
var setup = document.getElementById('setup');
var punchline = document.getElementById('punchline');

//three radio buttons for synchronous requests, asynchronous and fetch
var radioSync = document.getElementById("sync");
var radioAsync = document.getElementById("async");
var radioFetch = document.getElementById("fetch");
var btnReq = document.getElementById("btnReq"); 

//Going to be filled with the response from the request to the API
var joke = null;

var request = new XMLHttpRequest()

//this event will monitor the progress of the request that goes out to the web api, there are four stages that it goes through
//we can capture those stages and trace the status of those requests
request.onreadystatechange = () => {
    switch (request.readyState) {
        case XMLHttpRequest.LOADING: 
            break;
        case XMLHttpRequest.OPENED: 
            break;
        case XMLHttpRequest.HEADERS_RECEIVED: 
            break;
        case XMLHttpRequest.DONE:
            if (request.status == 200)
            {
                joke = JSON.parse(request.response)[0]
                showSetup()
            }
            break;
    }
}

function requestJoke() //This function is going to check which radio button is checked and send the request via one of the three
{
    //This makes it so that when you hit it once you don't see the punchline, the second time you do it shows the punchline for the joke.
    if (joke === null) //If the joke is null that means we are about to send a request to the joke api
    {
        if (radioSync.checked) syncRequest(); //If Sync is checked send a syncRequest
        else if (radioAsync.checked) asyncRequest(); //If Async is checked send a asyncRequest
        else if (radioFetch.checked) fetchRequestMin(); //if Fetch is checked send a fetch request
    }
    else
    {
        showPunchline(); //It will show the punchline
        joke = null; //This will reset the joke and give us a new one.
    }
}

//This function shows the punchline after the setup line
function showPunchline() 
{
    punchline.innerText = joke.punchline; //Sets the text in the second area to the jokes punchline
    //change button text here to request joke
    btnReq.innerText = "Request Joke"; //This is here when the joke is clear or when you have finished a joke, to request a new one.
}

//This function shows the Setup line before the punchline
function showSetup()
{
    setup.innerText = joke.setup; //Sets the text in the first area as the joke setup line
    punchline.innerText = ""; //This clears the previous punchline for the new joke
    btnReq.innerText = "Show Punchline"; //This changes the text to show punchline when the setup line is showing to make the joke funny with anticipation.
}

//This function is for the synchronous request
function syncRequest() 
{
    // let request = new XMLHttpRequest(); //This is creating a special type of object

    // //This will call the arrow function after the fact. You can take the request.onload out of the function altogether
    // request.onload = () => { //This is a callback function for when the request has been completed
    //     let response = request.response;
    //     joke = JSON.parse(response)[0]; //response is the JSON array object. Index at 0 is extracting the object from the array. Joke is now an object not a string
    //     showSetup(); //Grabs the setup field and send it to the innertext in the UI
    // } 
    request.open("GET", url, false); //This makes a get request on the url, and it is a synchronous request by default for the third parameter
    //let is when you are declaring something local and it is a bit more flexible than var.
    request.send(); //This will send a response, which could take a few seconds possibly even longer.
    //onload occurs when the send has been completed, so setting this up is only going to happen once the response comes back.
    //So we pull this out and set it up separately
}

//This function is for the asynchronous request
function asyncRequest() 
{
    // let request = new XMLHttpRequest();
    request.open("GET", url, true); //True means we want to send this asynchronously
    
    //This time we are going to request onreadystatechange which is going to monitor the progress of the request to the api
    // request.onreadystatechange = () => {
    //     //write a switch statement that switches on the request readystate
    //     switch (request.readyState)
    //     {
    //         case XMLHttpRequest.LOADING:    break;  //One of the states is called loading and we can potentially write some code that responds to the loading state
    //         case XMLHttpRequest.OPENED:  break;  //Opened 
    //         case XMLHttpRequest.HEADERS_RECEIVED: break; //Headers received
    //         case XMLHttpRequest.DONE:   //This is the one we are waiting for
    //             if (request.status === 200) //200 is success. We can potentially write code to respond to certain error code conditions
    //             {
    //                 let response = request.response;
    //                 joke = JSON.parse(response)[0];
    //                 showSetup();
    //             }
    //             break;
    //     }
    // }

    request.send(); 

}

//This function is for the fetch request
function fetchRequest()
{
    fetch(url) //All the code we set up before was taken care of by this method
    .then( 
        //Comes back here after the fetch and calls this function
        function (response) 
        {
            return response.json() //Here this is just doing "joke = JSON.parse(request.response)" still need to extract the object out of the array.
        }
    )
    .then( //This calls back another function
        function (json) //this is the array with the json object inside of it
        {
            joke =  json[0]; //so we need to get the index of the array, pretty much the second part of the JSON.parse.
            showSetup();
        } 
    )
}

//This function is for a minimal version of the fetch request
function fetchRequestMin()
{
    //This is an abbreviated version of the fetchRequest() function
    fetch(url)
        .then(response => response.json()) //An anonymous arrow function, returns the result of the same thing above
        .then(json => {
            joke = json[0];
            showSetup();
        }) //As a final note, we don't need any semi-colons at all in javascript
        //Can add as many then as you want and you can even add a catch to the end of a fetch to clean up any errors.
        //For example .catch(error=>{alert(error)})
        .catch((error) => { alert("FETCH ERROR: " + error) })
}