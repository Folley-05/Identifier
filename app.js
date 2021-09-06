/**
 * application file
 */

const express=require('express')

const { getPeers, getSockets, broadcast }=require('./p2p/p2pserver')
const { createBlock }=require('./blockchain/blockchain')

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
app.get('/api/peers', (req, res)=>{
    res.status(200).json(getPeers())
})
app.get('/api/sockets', (req, res)=>{
    res.status(200).json(getSockets())
})
app.get('/api/broadcast', (req, res)=>{
    broadcast()
    res.status(200).json("broadcast done")
})
app.post('/api/block', (req, res)=>{
    if(createBlock(req.body.data)) {
        res.status(200).json({response: "block create"})
    }
    else res.status(501).json({response: "fail to create block"})
})


module.exports=app