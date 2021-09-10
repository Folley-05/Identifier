/**
 * server p2p file
 */

const WebSocket=require('ws')

// const { sendMessage, handleMessage }=require('./functions')
const { addBlock, getBlockchain, replaceChain }=require('../blockchain/blockchain')
const { getMempool, setMempool, pushIdentity }=require('../blockchain/identity')

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
            // sendMessage({type: 'blockchain request', text: "can i get your peers", data: null}, con)
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

const broadcast=(message)=>{
    SOCKETS.forEach(socket => {
        sendMessage({type: 'text', text: "DIFFUSSION PROTOCOL", data: null}, socket)
    })
}

const broadcastBlock=(block)=>{
    SOCKETS.forEach(socket=>{
        sendMessage({type: 'block', text: "last block created", data: block}, socket)
    })
    console.log("new block broadcast")
}

const broadcastIdentity=(identity)=>{
    SOCKETS.forEach(socket=>{
        sendMessage({type: 'identity', text: "last identity created", data: identity}, socket)
    })
    console.log("new block identity")
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
            sendMessage({type: 'blockchain', text: "here is my peers", data: getBlockchain()}, ws)
            sendMessage({type: 'mempool', text: "here is my peers", data: getMempool()}, ws)
            break
        case 'peers request' :
            // console.log("my peers", PEERS)
            sendMessage({type: 'peers', text: "here is my peers", data: PEERS}, ws)
            break
        case 'peers' :
            console.log("peers received ", message.data)
            connectTopeers(message.data)
            break
        case 'blockchain request' :
            sendMessage({type: 'blockchain', text: "here is blockchain", data: getBlockchain()}, ws)
            break
        case 'blockchain' :
            // console.log("i received blockchain")
            replaceChain(message.data)
            break
        case 'block' :
            console.log("i receive a new block")
            addBlock(message.data)
            break
        case 'mempool request' :
            sendMessage({type: 'mempool', text: "here is mempool", data: getMempool()}, ws)
            break
        case 'mempool' :
            console.log("i received mempool")
            setMempool(message.data)
            break
        case 'identity' :
            console.log("i received new identity")
            pushIdentity(message.data)
            break
        case 'text' :
            console.log("message received : ", message.text)
            break
        default:
            break
    }
}

exports.initServer=initServer
exports.addPeers=addPeers
exports.getPeers=getPeers
exports.getSockets=getSockets
exports.broadcast=broadcast
exports.broadcastBlock=broadcastBlock
exports.broadcastIdentity=broadcastIdentity