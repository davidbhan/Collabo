var restify = require('restify');
var builder = require('botbuilder');
var http = require('http');
var https = require('https');


//Create a port server to listen for communications
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('listening to %s', server.url);
});

//Create a connecter and link to bot
var connector = new builder.ChatConnector({
    appId: '8151148a-20ae-4fb8-a93c-2847295ef170',
    appPassword: 'Cbx5kACYEhAR3ZSCg4ZrLhq'
});

var bot = new builder.UniversalBot(connector);

server.post('/api/messages', connector.listen());

// Add global LUIS recognizer to bot
var luisAppUrl = process.env.LUIS_APP_URL || 'https://westus.api.cognitive.microsoft.com/luis/v2.0/apps/d129fb41-f6d4-4b82-a82d-d06fe975f807?subscription-key=d42a1487542847bcb13f4e73151ccfbc&staging=true&verbose=true&timezoneOffset=0&q=';
bot.recognizer(new builder.LuisRecognizer(luisAppUrl));

// Body for storing Bing Search result
var body = '';


//-----------------------------------------//
//----------DIALOGUES BEGIN HERE-----------//
//-----------------------------------------//
//Root dialogue
bot.dialog('/', [    
    function (session) {     
        session.send("Hi there, I'm Collabo Bot!");        
        session.beginDialog('askHelpNeeded');
    },
    function (session) {        
        setTimeout(function() {
            session.send("Let me know if you need anything else :-)");
        }, 3000);        
    }  
])

//Sees if the user needs help
bot.dialog('askHelpNeeded', [
    //Check if they need a question answered
    function (session) {
        builder.Prompts.text(session, "Do you need help getting one of your questions answered?");        
    },
    function (session, args, results) {
        //var intent = args.intent;
        //console.log(intent);
        //var questionQuery = builder.EntityRecognizer.findEntity(intent.entities, 'html');        
        //console.log(questionQuery);
        
        if (results.response) {
            // Save user response to see if help is needed
            session.dialogData.needsHelp = results.response;
            console.log(session.dialogData.needsHelp);
        }        
        if (session.dialogData.needsHelp = 'yes') {
            console.log("moving to question topic");
            session.beginDialog('askQuestionTopic');            
        } else {
            console.log("shit");
        }
        
    }
]);

//Sees what quesetion the user has
bot.dialog('askQuestionTopic', [
    function (session) {
        session.send("Happy to Help!");
        builder.Prompts.text(session, "What's your question?");
    },
    function (session, results) {
        if (results.response) {
            //Takes in user question
            session.dialogData.questionTopic = results.response;
            var term = session.dialogData.questionTopic;            
            console.log(term);              
//----------//START OF WEIRD CODE to do bing search
            var subscriptionKey = '097a98967a824a8d9135b13590ad9374';
            var host = 'api.cognitive.microsoft.com';
            var path = '/bing/v7.0/search';           
            
            var response_handler = function (response) {
                body = '';
                response.on('data', function (d) {
                    body += d;
                });
                response.on('end', function () {
                    body = JSON.stringify(JSON.parse(body), null, '  ');
                    console.log('\nJSON Response:\n');
                    console.log(typeof body);
                });
                response.on('error', function (e) {
                    console.log('Error: ' + e.message);
                });
            };
            
            var bing_web_search = function (search) {
              console.log('Searching the Web for: ' + term + ' udemy&count=3');
              var request_params = {
                    method : 'GET',
                    hostname : host,
                    path : path + '?q=' + encodeURIComponent(search) + '%20udemy',
                    headers : {
                        'Ocp-Apim-Subscription-Key' : '097a98967a824a8d9135b13590ad9374',
                    }
                };
            
                var req = https.request(request_params, response_handler);
                req.end();
            }
            
            if (subscriptionKey.length === 32) {
                bing_web_search(term);
            } else {
                console.log('Invalid Bing Search API subscription key!');
                console.log('Please paste yours into the source code.');
            }              
//----------//END OF WEIRD CODE                     
        }
        console.log("moving on to showResults dialogue");
        session.beginDialog('showResults');
        
        
    }
]);

bot.dialog('showResults', [
    function (session) {
        session.send("I am searching the web for resources that might help...");        

        
        //Trying to break apart JSON
        var test;
        setTimeout(function() {
            test = JSON.parse(body).webPages.value;
            //session.send(JSON.stringify(test[0].snippet, null, '  '));
            
            var msg = new builder.Message(session);        
            msg.attachmentLayout(builder.AttachmentLayout.carousel);  
            msg.attachments([
                    new builder.HeroCard(session)
                        .title(JSON.stringify(test[0].name, null, '  '))
                        .subtitle(JSON.stringify(test[0].url, null, '  '))
                        .text(JSON.stringify(test[0].snippet, null, '  ')),
                    new builder.HeroCard(session)
                        .title(JSON.stringify(test[1].name, null, '  '))
                        .subtitle(JSON.stringify(test[1].url, null, '  '))
                        .text(JSON.stringify(test[1].snippet, null, '  ')),
                    new builder.HeroCard(session)
                        .title(JSON.stringify(test[2].name, null, '  '))
                        .subtitle(JSON.stringify(test[2].url, null, '  '))
                        .text(JSON.stringify(test[2].snippet, null, '  ')),
            ]); 
            session.send(msg).endDialog(); 
            session.send("Here are some links I found, hope they help!");    
                                                              
        }, 3000);
     

       
    } 
]);

//Clears all data stored in containers
function clearData(session) {
    session.userData = {}; 
    session.privateConversationData = {};
    session.conversationData = {};
    session.dialogData = {};
    session.save();
}

// Triggers a reset of data when the user types in "reset"
bot.dialog('reset', function (session, args, next) {
    session.endDialog("Your user data will now reset.");
    clearData(session);
})
.triggerAction({
    matches: /^reset$/i,
});
