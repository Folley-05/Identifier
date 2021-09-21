/**
 * identity of an person
 */
const Crypto=require('crypto-js')
const fs=require('fs')

const { signMessage, verifyMessage }=require('../signature')

const http_port=process.env.HTTP_PORT || 4000+''

const privateKey = fs.readFileSync('./keys/private_'+http_port+'.pem')

class Identity {
    names
    surnames
    birthDate
    birthPlace
    sexe
    height
    proffession
    signature
    father
    mother
    SM
    address
    issueDate
    expiryDate
    picture
    fingerPrint
    identificationPost
    previousHash
    hash
    identitySignature
    constructor(names, surnames, birthDate, birthPlace, sexe, height, proffession, signature, father, mother, SM, address, issueDate, expiryDate, picture, fingerPrint, identificationPost, previousHash, hash) {
        this.names=names
        this.surnames=surnames
        this.birthDate=birthDate
        this.birthPlace=birthPlace
        this.sexe=sexe
        this.height=height
        this.proffession=proffession
        this.signature=signature
        this.father=father
        this.mother=mother
        this.SM=SM
        this.address=address
        this.issueDate=issueDate
        this.expiryDate=expiryDate
        this.picture=picture
        this.fingerPrint=fingerPrint
        this.identificationPost=identificationPost
        this.previousHash=previousHash
        this.hash=hash
        this.identitySignature=signMessage(hash, privateKey)
    }

}


// the mempool of identity
let MEMPOOL=[]

// all finger print registered
let FINGERPRINT=[]

// number of address mine a time
const numberAddress=5

const getMempool=()=>MEMPOOL


const calculateHash=(names, surnames, birthDate, birthPlace, sexe, height, proffession, signature, father, mother, SM, address,
    issueDate, expiryDate, picture, fingerPrint, identificationPost, previousHash)=>Crypto.SHA256(names+surnames+birthDate+birthPlace+sexe+height+proffession+signature+father+mother+SM+address+issueDate+expiryDate+picture+fingerPrint+identificationPost+previousHash).toString()

    
// let pascal=new Identity("pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", calculateHash("pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal" ))
// console.log(pascal)
// console.log("status :", verifyMessage(pascal.identitySignature, pascal.hash, publicKey))

const calculateHashForIdentity=(identity)=>{
    return calculateHash(identity.names, identity.surnames, identity.birthDate, identity.birthPlace, identity.sexe, identity.height, identity.proffession, identity.signature, identity.father, identity.mother, identity.SM, identity.address,
        identity.issueDate, identity.expiryDate, identity.picture, identity.fingerPrint, identity.identificationPost, identity.previousHash)
}

// const createIdentity=()=>new Identity("pascal", "pascal", 120, "pascal", "pascal", 190, "pascal", "pascal", "pascal", "pascal", 
//     "pascal", "pascal", +new Date, +new Date, "pascal", "pascal", http_port, '', calculateHash("pascal", "pascal", 120, "pascal", "pascal", 190, "pascal", "pascal", "pascal", "pascal", 
//     "pascal", "pascal", +new Date, +new Date, "pascal", "pascal", http_port, ''))

const createIdentity=(identity)=>new Identity(identity.names, identity.surnames, identity.birthDate, identity.birthPlace,
    identity.sexe, identity.height, identity.proffession, identity.signature, identity.father, identity.mother,
    identity.SM, identity.address, identity.issueDate, identity.expiryDate, identity.picture, identity.fingerPrint,
    http_port, identity.previousHash, calculateHashForIdentity(identity))

const isValidIdentityStructure=(identity)=>{
    return typeof identity.names==='string'
     && typeof identity.surnames==='string'
     && typeof identity.birthDate==='number'
     && typeof identity.birthPlace==='string'
     && typeof identity.sexe==='string'
     && typeof identity.height==='number'
     && typeof identity.proffession==='string'
     && typeof identity.signature
     && typeof identity.father==='string'
     && typeof identity.mother==='string'
     && typeof identity.SM==='string'
     && typeof identity.address==='string'
     && typeof identity.issueDate==='number'
     && typeof identity.expiryDate==='number'
     && typeof identity.identificationPost==='string'
    //  && typeof identity.picture
    //  && typeof identity.fingerPrint
     && typeof identity.previousHash==='string'
     && typeof identity.hash==='string'
     && typeof identity.identitySignature==='string'
}

const checkSignature=(signature, hash, post)=>{
    const publicKey = fs.readFileSync('./keys/public_'+post+'.pem')
    return verifyMessage(signature, hash, publicKey)
}

const isValidIdentity=(identity)=>{
    if(!isValidIdentityStructure(identity)) {
        console.log("identity structure is invalid")
        return false
    }
    if(calculateHashForIdentity(identity)!==identity.hash) {
        console.log("hash is invalid")
        return false
    }
    if(checkSignature(identity.signature, identity.hash, identity.identificationPost)) {
        console.log("hash is invalid")
        return false
    }
    /**
     * add finger print verification
     * add picture verification 
     */
    return true

}

const pushIdentity=(identity)=>{
    if(isValidIdentity(identity)) {
        console.log("add identity to mempool")
        MEMPOOL.push(identity)
        return true
    }
    return false
}

const addIdentity=(identity)=>{
    let id=createIdentity({...identity, identificationPost: http_port})
    if(pushIdentity(id)) return id
    else return false
}

const isValidPool=(pool)=>{
    pool.forEach(identity => {
        if(!isValidIdentity(identity)) {
            console.log("invalid identity found, pool is corrupted ")
            return false
        }
    })
    return true
}

const setMempool=(mempool)=>{
    if(isValidPool(mempool)) {
        console.log("received mempool is valid, replacing mempool")
        MEMPOOL=mempool
        return true
    } else {
        console.log("fail to replace mempool")
        return false
    }
}

const mineIdentities=(pool)=>{
    if(MEMPOOL.length<3) return false
    let identities=[]
    let number=0
    while((number<numberAddress) && MEMPOOL.length) {
        let identity=MEMPOOL.shift()
        if(isValidIdentity(identity)) {
            identities.push(identity)
            number++
        }
    }
    if(identities.length) return JSON.stringify(identities)
    else return false
}


exports.Identity=Identity
exports.getMempool=getMempool
exports.setMempool=setMempool
exports.pushIdentity=pushIdentity
exports.addIdentity=addIdentity
exports.mineIdentities=mineIdentities



