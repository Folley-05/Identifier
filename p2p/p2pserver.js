/**
 * server p2p file
 */

const WebSocket=require('ws')

// const { sendMessage, handleMessage }=require('./functions')

// init list of network's peers
let PEERS=[]
let SOCKETS=[]
let port

let tailUrl="ws://localhost:"

// init p2p server function
const initServer=(p2p_port, peer)=>{
    port=p2p_port
    // create web socket instance 
    const wss=new WebSocket.Server({port: p2p_port})
    console.log("socket create on port "+p2p_port)
    wss.on('connection', ws=>{
        console.log("new connection received ")
        SOCKETS.push(ws)
        const message={type: 'text', text:"hello, welcome on network", data: null}
        sendMessage(message, ws)
        ws.on('message', message=>{
            handleMessage(message, ws)
        })
    })

    // if there are peer
    if(peer) {
        let con=new WebSocket(peer)
        con.on('open', ()=>{
            SOCKETS.push(con)
            PEERS.push(peer)
            sendMessage({type: 'connection', text: "hello, i'am new on network", data: p2p_port}, con)
            sendMessage({type: 'peers request', text: "can i get your peers", data: null}, con)
        })
        con.on('message', message=>{
            handleMessage(message)
        })
    }
}

const addPeers=peer=>PEERS.push(tailUrl+peer)
const getPeers=()=>PEERS
const addSockets=sockets=>SOCKETS.push(sockets)
const getSockets=()=>SOCKETS

const sendMessage=(message, ws)=>{
    let chain=JSON.stringify(message)
    ws.send(chain)
}

const connectTopeers=peers=>{
    peers.splice(0, peers.length-1).forEach(peer => {
        let con=new WebSocket(peer)
        con.on('open', ()=>{
            SOCKETS.push(con)
            PEERS.push(peer)
            let message={type: 'connection', text: "hello, i'am new on network. i get your contact", data: port}
            sendMessage(message, con)
        })
        con.on('message', message=>{
            handleMessage(message)
        })
    })
}

const handleMessage=(chain, ws)=>{
    let message=JSON.parse(chain)
    switch (message.type) {
        case 'connection':
            addPeers(message.data)
            console.log("message received : ", message.text)
            let response={type: 'text', text: "you have been added", data: null}
            sendMessage(response, ws)
            break;
        case 'peers request' :
            console.log("my peers", PEERS)
            sendMessage({type: 'peers', text: "here is my peers", data: PEERS}, ws)
            break
        case 'peers' :
            console.log("peers received ", message.data)
            connectTopeers(message.data)
            break
        case 'text' :
            console.log("message received : ", message.text)
            break
        default:
            break;
    }
}

const broadcast=(message)=>{
    SOCKETS.forEach(socket => {
        sendMessage({type: 'text', text: "DIFFUSSION PROTOCOL", data: null}, socket)
    })
}

exports.initServer=initServer
exports.addPeers=addPeers
exports.getPeers=getPeers
exports.getSockets=getSockets
exports.broadcast=broadcast