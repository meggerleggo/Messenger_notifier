let target = String();

function isValid(responseBody)
{
    return (
        responseBody.t === 'msg' && 
        responseBody.ms && 
        responseBody.ms[0] && 
        responseBody.ms[0].delta &&
        responseBody.ms[0].delta.body &&
        responseBody.ms[0].delta.messageMetadata
    );
}

function setTarget(address)
{
    target = address;
}

function extractSenderId(responseBody)
{
    return responseBody.ms[0].delta.messageMetadata.actorFbId;
}

function extractMessageBody(responseBody)
{
    return responseBody.ms[0].delta.body;
}

async function notifyReceived(senderUsername, messageBody)
{
    const http = require('got');
        
    await http.get(target, {
        query: { 
            "sender": senderUsername, 
            "message": messageBody 
        },
        protocol: 'http:'
    });
}

module.exports.setTarget = setTarget;
module.exports.isValid = isValid;
module.exports.extractSenderId = extractSenderId;
module.exports.extractMessageBody = extractMessageBody;
module.exports.notifyReceived = notifyReceived;