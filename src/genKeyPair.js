const crypto=require('crypto')
const fs=require('fs')

const generateKey=(http_port)=>{
    const {privateKey, publicKey}=crypto.generateKeyPairSync('rsa', {
        modulusLength: 512,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    })
    
    fs.writeFileSync('./keys/private_'+http_port+'.pem', privateKey)
    fs.writeFileSync('./keys/public_'+http_port+'.pem', publicKey)
}

module.exports=generateKey