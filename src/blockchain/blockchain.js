/**
 * blockchain function file
 */

const Crypto=require('crypto-js')

const { Identity }=require('./identity')

class Block {
    index
    timestamp
    previousHash
    data
    hash

    constructor(index, timestamp, previousHash, data, hash) {
        this.index=index
        this.timestamp=timestamp
        this.previousHash=previousHash
        this.data=data
        this.hash=hash
    }
}

// the first block of the chain
const genesisBlock=new Block(0, 1630928127607, null, "premier block", '0x0000000000')

// the blockchain
let BLOCKCHAIN=[genesisBlock]

const getBlockchain=()=>{
    let blocks=[]
    BLOCKCHAIN.forEach(block=>{
        if(block.index===0) return blocks.push(block)
        else return blocks.push({...block, data: JSON.parse(block.data)})
    })
    return blocks
}

const getPureBlockchain=()=>BLOCKCHAIN

const getLastBlock=()=>BLOCKCHAIN[BLOCKCHAIN.length-1]

const calculateHash=(index, timestamp, previousHash, data)=>Crypto.SHA256(index+timestamp+previousHash+data+'').toString()

const generateNextBlock=(data)=>{
    const lastestBlock=getLastBlock()
    const nextIndex=lastestBlock.index+1
    const timestamp=+new Date
    const stringData=JSON.stringify(data)
    return new Block(nextIndex, timestamp, lastestBlock.hash, stringData, calculateHash(nextIndex, timestamp, lastestBlock.hash, stringData))
}

const calculateHashForBlock=(block)=>{
    return calculateHash(block.index, block.timestamp, block.previousHash, block.data)
}

const isValidBlockStructure=(block)=>{
    return typeof block.index==='number'
        && typeof block.hash==='string'
        && typeof block.previousHash==='string'
        && typeof block.timestamp==='number'
        && typeof block.data==='string'
}

const isValidNewBlock=(newBlock, previousBlock)=>{
    if(!isValidBlockStructure(newBlock)) {
        console.log("invalid block structure")
        return false
    }
    if(newBlock.index!==previousBlock.index+1) {
        console.log("index is invalid")
        return false
    }
    else if(newBlock.previousHash!==previousBlock.hash) {
        console.log("previous hsah is invalid")
        return false
    }
    else if(calculateHashForBlock(newBlock)!==newBlock.hash) {
        console.log("invalid hash")
        return false
    }
    return true
}

const addBlock=(block)=>{
    if(isValidNewBlock(block, getLastBlock())) {
        BLOCKCHAIN.push(block)
        console.log("block added")
        return block
    } else {
        console.log("block not added")
        return false
    }
}

const isValidChain=(chain)=>{
    const isValidGenesis=(block)=>{
        return JSON.stringify(block)===JSON.stringify(genesisBlock)
    }
    if(!isValidGenesis(chain[0])) {
        console.log("invalid genesis")
        return false
    }
    for(let i=1; i<chain.length; i++) {
        if(!isValidNewBlock(chain[i], chain[i-1])) {
            console.log("invalid block found")
            return false
        }
    }
    console.log("valid chain")
    return true
}

const replaceChain=(newChain)=>{
    if(isValidChain(newChain)&&newChain.length>=getBlockchain().length) {
        console.log("received blockchain is valid, replacing current blockchain")
        BLOCKCHAIN=newChain
        return true
    } else {
        console.log("current block chain not replaced")
        return false
    }
}

const createBlock=(data)=>{
    if(data) {
        let block=generateNextBlock(data)
        return addBlock(block)
    } else return false
}

const getIdentities=()=>{
    let identities=[]
    BLOCKCHAIN.map(block=>{
        if(block.index!==0) {
            let data=JSON.parse(block.data)
            data.map(identity=>identities.push(identity))
        }
    })
    return identities
}
const getIdentity=(hash)=>{
    let ID=getIdentities()
    return ID.filter(id=>id.hash===hash)
}



exports.createBlock=createBlock
exports.addBlock=addBlock
exports.getBlockchain=getBlockchain
exports.replaceChain=replaceChain
exports.getPureBlockchain=getPureBlockchain
exports.getIdentities=getIdentities
exports.getIdentity=getIdentity


