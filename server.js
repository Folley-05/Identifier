/**
 * node server file
 */

const http=require('http')
const { pipeline } = require('stream')

const { initServer }=require('./p2p/p2pserver')
const app=require('./app')

// get ports of servers
const http_port=process.env.HTTP_PORT || 4000
const p2p_port=process.env.P2P_PORT || 6000
const peer=process.env.PEERS || null
console.log(`server http on port ${http_port} and websocket on port ${p2p_port}`)

// init p2p server
initServer(p2p_port, peer)

// set port of server
app.set('port', http_port)

// create http server
const httpServer=http.createServer(app)
httpServer.on('error', ()=>console.log("an error is occured"))
httpServer.on('listening', ()=>{
    const address=httpServer.address()
    const bind=typeof address==='string' ? 'pipe '+pipeline : 'port '+http_port
    console.log("http server listening on "+bind)
})

// start http server 
httpServer.listen(http_port)