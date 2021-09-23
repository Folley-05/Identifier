const crypto=require('crypto')
const fs=require('fs')

const generateKey=(name)=>{
    const {privateKey, publicKey}=crypto.generateKeyPairSync('rsa', {
        modulusLength: 512,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' }
    })
    
    fs.writeFileSync('./keys/private_'+name+'.pem', privateKey)
    fs.writeFileSync('./keys/public_'+name+'.pem', publicKey)
}

module.exports=generateKey