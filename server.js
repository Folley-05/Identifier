/**
 * node server file
 */

const http=require('http')
const { pipeline } = require('stream')

const app=require('./app')



// set port of server
app.set('port', 4000)

// create http server
const httpServer=http.createServer(app)
httpServer.on('error', ()=>console.log("an error is occured"))
httpServer.on('listening', ()=>{
    const address=httpServer.address()
    const bind=typeof address==='string' ? 'pipe '+pipeline : 'port '+4000
    console.log("listening on "+bind)
})

// start http server 
httpServer.listen(4000)