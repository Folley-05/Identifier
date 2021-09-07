/**
 * identity of an person
 */
const Crypto=require('crypto-js')
const fs=require('fs')

const { signMessage, verifyMessage }=require('./signature')

const http_port=process.env.HTTP_PORT || 4000

const privateKey = fs.readFileSync('private_'+http_port+'.pem')
const publicKey = fs.readFileSync('public_'+http_port+'.pem')

let signature=signMessage("hello word", privateKey)

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
    identificationPost
    picture
    digitalFinger
    hash
    identitySignature
    constructor(names, surnames, birthDate, birthPlace, sexe, height, proffession, signature, father, mother, SM, address, issueDate, expiryDate, identificationPost, picture, digitalFinger, hash) {
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
        this.identificationPost=identificationPost
        this.picture=picture
        this.digitalFinger=digitalFinger
        this.hash=hash
        this.identitySignature=signMessage(hash, privateKey)
    }

}

const calculateHash=(names, surnames, birthDate, birthPlace, sexe, height, proffession, signature, father, mother, SM, address,
    issueDate, expiryDate, identificationPost, picture, digitalFinger)=>Crypto.SHA256(names+surnames+birthDate+birthPlace+sexe+height+proffession+signature+father+mother+SM+address+issueDate+expiryDate+identificationPost+picture+digitalFinger).toString()

// let pascal=new Identity("pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", calculateHash("pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal", "pascal"))

// console.log(pascal)
// console.log("status :", verifyMessage(pascal.identitySignature, pascal.hash, publicKey))

exports.Identity=Identity



