'use strict';

const express = require('express');
const bodyParser = require('body-parser');


const restService = express();
restService.use(bodyParser.json());

var hasKeys = false;
var isGrateUnlocked = false;
var isGrateOpen = false;
var hasLanternLit = false;
var aboutToFallInPit = false;

restService.post('/webhook', function (req, res) {

    console.log('hook request');

    try {
        var speech = 'empty speech';

        if (req.body) {
            var requestBody = req.body;

            if (requestBody.result) {
                speech = '';

                if (requestBody.result.fulfillment) {
                    speech += requestBody.result.fulfillment.speech;
                    speech += ' ';
                }

                if (requestBody.result.action) {
                    var action = requestBody.result.action;

                    if(action === 'insidebuilding.takeall'){
                        return insideBuildingTakeAllAction(res);
                    }

                    if(action === 'outsidegrate.unlockgrate'){
                        return checkUnlockGrateAction(res);
                    }

                    if(action === 'outsidegrate.opengrate'){
                        return checkOpenGrateAction(res);
                    }

                    if(action === 'outsidegrate.downgrate'){
                        return checkDownGrateAction(res);
                    }

                    if(action === 'cobblecrawl.gowest'){
                        return checkGoWestAction(res);
                    }

                    if(action === 'darkness.move'){
                        return checkMoveAction(res);
                    }

                    speech += 'action: ' + requestBody.result.action;
                }
            }
        }

        console.log('result: ', speech);

        return res.json({
            speech: speech,
            displayText: speech,
            source: 'apiai-webhook-sample',
            contextOut: []
        });
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});

restService.listen((process.env.PORT || 5000), function () {
    console.log("Server listening");
});

function insideBuildingTakeAllAction(res){
    hasKeys = true;

    return res.json({
        speech: 'Took set of keys, tasty food, a brass lantern, a small bottle full of water, a well house that is hardly portable, a spring that is hardly portable, and a pair of 1 foot diameter sewer pipes that are hardly portable.',
        displayText: 'Took set of keys, tasty food, a brass lantern, a small bottle full of water, a well house that is hardly portable, a spring that is hardly portable, and a pair of 1 foot diameter sewer pipes that are hardly portable.',
        source: 'ai-adventures-webhook',
        contextOut: [{"name":"insidebuilding-action", "lifespan":5}]
    })
}

function checkUnlockGrateAction(res){

    if(hasKeys){
        isGrateUnlocked = true;
        return res.json({
            speech: 'You unlock the steel grate.',
            displayText: 'You unlock the steel grate.',
            source: 'ai-adventures-webhook',
            contextOut: [{"name":"outsidegrate-action", "lifespan":5, 'parameters' : {'isGrateUnlocked':'true'}}]
        })
    }

    return res.json({
        speech: 'Missing key.',
        displayText: 'Missing key.',
        source: 'ai-adventures-webhook',
        contextOut: [{"name":"outsidegrate-action", "lifespan":5, 'parameters' : {'isGrateUnlocked':'false'}}]
    })
}

function checkOpenGrateAction(res){

    if(isGrateUnlocked){
        isGrateOpen = true;
        return res.json({
            speech: 'You open the steel grate.',
            displayText: 'You unlock the steel grate.',
            source: 'ai-adventures-webhook',
            contextOut: [{"name":"outsidegrate-action", "lifespan":5, 'parameters' : {'isGrateOpen':'true'}}]
        })
    }

    return res.json({
        speech: 'Steel grate is locked.',
        displayText: 'Steel grate is locked.',
        source: 'ai-adventures-webhook',
        contextOut: [{"name":"outsidegrate-action", "lifespan":5, 'parameters' : {'isGrateOpen':'false'}}]
    })
}

function checkDownGrateAction(res){

    if(isGrateOpen){
        return res.json({
            speech:
            'You are in a small chamber beneath a 3x3 steel grate to the surface. A low crawl over cobbles leads inward to the west. ' +
            'The grate stands open.',
            displayText:
            'You are in a small chamber beneath a 3x3 steel grate to the surface. A low crawl over cobbles leads inward to the west. ' +
            'The grate stands open.',
            source: 'ai-adventures-webhook',
            contextOut: [{"name":"outsidegrate-action", "lifespan":0},
                {"name":"belowgrate-action", "lifespan":5}]
        })
    }

    return res.json({
        speech: 'Steel grate is not opened.',
        displayText: 'Steel grate is not opened.',
        source: 'ai-adventures-webhook',
        contextOut: [{"name":"outsidegrate-action", "lifespan":5}]
    })
}

function checkGoWestAction(res){

    if(hasLanternLit){
        // IN DEBRIS ROOM
        return res.json({
            speech:
            'You are in a debris room filled with stuff washed in from the surface. A low wide passage with cobbles becomes plugged with mud and debris here, but an awkward canyon leads upward and west. ' +
            'A note on the wall says, "Magic word XYZZY." ' +
            'A three foot black rod with a rusty star on one end lies nearby.',
            displayText:
            'You are in a debris room filled with stuff washed in from the surface. A low wide passage with cobbles becomes plugged with mud and debris here, but an awkward canyon leads upward and west. ' +
            'A note on the wall says, "Magic word XYZZY." ' +
            'A three foot black rod with a rusty star on one end lies nearby.',
            source: 'ai-adventures-webhook',
            contextOut: [{"name":"debrisroom-action", "lifespan":5}, {"name":"cobblecrawl-action", "lifespan":0}]
        })
    }

    // DARKNESS
    return res.json({
        speech:
        'It is pitch dark, and you can\'t see a thing.',
        displayText:
        'It is pitch dark, and you can\'t see a thing.',
        source: 'ai-adventures-webhook',
        contextOut: [{"name":"darkness-action", "lifespan":5}]
    })
}

function checkMoveAction(res){

    if(aboutToFallInPit){
        // GAME OVER
        return res.json({
            speech:
            'You fell into a pit and broke every bone in your body! ' +
            'Oh dear, you seem to have gotten yourself killed. I might be able to help you out, but I\'ve never really done this before. Do you want me to try to reincarnate you?',
            displayText:
            'You fell into a pit and broke every bone in your body! ' +
            'Oh dear, you seem to have gotten yourself killed. I might be able to help you out, but I\'ve never really done this before. Do you want me to try to reincarnate you?',
            source: 'ai-adventures-webhook',
            contextOut: [{"name":"gameover-action", "lifespan":5}]
        })
    }

    aboutToFallInPit = true;
    // DARKNESS
    return res.json({
        speech:
            'It is now pitch dark. If you proceed you will likely fall into a pit.',
        displayText:
            'It is now pitch dark. If you proceed you will likely fall into a pit.',
        source: 'ai-adventures-webhook',
        contextOut: [{"name":"darkness-action", "lifespan":5, 'parameters' : {'aboutToFallInPit':'true'}}]
    })
}