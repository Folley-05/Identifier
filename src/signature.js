/**
 * signature function file
 */
const cryptoJs=require('crypto')


// get ports of servers

const signMessage=(message, privateKey)=>{
    console.log("les params ", message, privateKey)
    const sign=cryptoJs.createSign('SHA256')
    sign.update(message)
    sign.end
    // return sign.sign(privateKey)
    const signature=sign.sign(privateKey)
    return Buffer.from(signature).toString('base64')
}

const verifyMessage=(signature, message, publicKey)=>{
    const verify=cryptoJs.createVerify('SHA256')
    verify.update(message)
    verify.end()
    return verify.verify(publicKey, signature, 'base64')
}

exports.signMessage=signMessage
exports.verifyMessage=verifyMessage