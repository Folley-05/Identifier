const { addPeer }=require('./p2pserver')
console.log("add", addPeer)

const sendMessage=(message, ws)=>{
    let chain=JSON.stringify(message)
    ws.send(chain)
}

const handleMessage=(chain, ws)=>{
    let message=JSON.parse(chain)
    switch (message.type) {
        case 'connection':
            addPeer(message.data)
            console.log("message recu : ", message.text)
            let response={type: 'text', text: "you have been added", data: null}
            sendMessage(response, ws)
            break;
        case 'text' :
            console.log("message recu : ", message.text)
            break
        default:
            break;
    }
}

exports.sendMessage=sendMessage
exports.handleMessage=handleMessage