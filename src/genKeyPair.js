const crypto=require('crypto')
const fs=require('fs')

const generateKey=(http_port)=>{
    const {privateKey, publicKey}=crypto.generateKeyPairSync('rsa', {
        modulusLength: 512,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    })
    
    fs.writeFile('./keys/private_'+http_port+'.pem', privateKey, (err)=>{
        if(err) throw err
    })
    fs.writeFile('./keys/public_'+http_port+'.pem', publicKey, (err)=>{
        if(err) throw err
    })
    // fs.copyFileSync('private_'+http_port+'.pem', './keys/private_'+http_port+'.pem')
    // fs.copyFileSync('public_'+http_port+'.pem', './keys/public_'+http_port+'.pem')
    return null
}

module.exports=generateKey