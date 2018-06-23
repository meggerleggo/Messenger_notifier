module.exports =
{
    isValid(responseBody)
    {        
        return (
            responseBody.t === 'msg' && 
            responseBody.ms && 
            responseBody.ms[0] && 
            responseBody.ms[0].delta &&
            responseBody.ms[0].delta.body &&
            responseBody.ms[0].delta.messageMetadata
        );
    },

    extractSenderId(responseBody)
    {
        return responseBody.ms[0].delta.messageMetadata.actorFbId;
    },

    extractMessageBody(responseBody)
    {
        return responseBody.ms[0].delta.body;
    },
    
    notifyReceived(senderUsername, messageBody)
    {
        const http = require('got');

        console.log('Message received: ' + senderUsername + ', ' + messageBody);

        http.post(
            'http://192.168.1.201:7000', {
            body: {
                username: senderUsername, 
                message: messageBody
            }
        }).then(response => {}, error => console.log(error));
    }
}