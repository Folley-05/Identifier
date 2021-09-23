/**
 * application file
 */

const express=require('express')

const { getPeers, getSockets, broadcast, broadcastBlock, broadcastIdentity, broadcastMempool }=require('./p2p/p2pserver')
const { createBlock, getBlockchain, getPureBlockchain }=require('./blockchain/blockchain')
const { getMempool, addIdentity, mineIdentities }=require('./blockchain/identity')

// start application
const app=express()

// set header of response
app.use((req, res, next)=>{
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
    console.log("requete recu !")
    next()
})

// add middleware
app.use(express.json())

// start routes
app.get('', (req, res)=>{
    res.status(200).json("hello and welcome")
})
app.get('/api/broadcast', (req, res)=>{
    broadcast()
    res.status(200).json("broadcast done")
})
app.get('/api/peers', (req, res)=>{
    res.status(200).json(getPeers())
})
app.get('/api/sockets', (req, res)=>{
    res.status(200).json(getSockets())
})
app.get('/api/blockchain', (req, res)=>{
    res.status(200).json(getBlockchain())
})
app.get('/api/pureblockchain', (req, res)=>{
    res.status(200).json(getPureBlockchain())
})
app.get('/api/mempool', (req, res)=>{
    res.status(200).json(getMempool())
})
// app.post('/api/block', (req, res)=>{
//     let block=createBlock(req.body.data)
//     if(block) {
//         broadcastBlock(block)
//         res.status(200).json({response: "block create"})
//     }
//     else res.status(501).json({response: "fail to create block"})
// })
app.post('/api/identity', (req, res)=>{
    let id=addIdentity(req.body)
    if(id) {
        broadcastIdentity(id)
        res.status(200).json({response: "identity diffused"})
    } else res.status(200).json({response: "identity not diffused"})
})
app.post('/api/mineblock', (req, res)=>{
    let block=createBlock(mineIdentities())
    if(block) {
        broadcastBlock(block)
        broadcastMempool(getMempool())
        res.status(200).json({response: "block create"})
    }
    else res.status(501).json({response: "fail to create block"})
})


module.exports=app