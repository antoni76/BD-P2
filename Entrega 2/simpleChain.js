/* ===== SHA256 with Crypto-js ===============================
|  Learn more: Crypto-js: https://github.com/brix/crypto-js  |
|  =========================================================*/

const SHA256 = require('crypto-js/sha256');

// levelDB to persist data

const {db, addLevelDBData, getLevelDBData, level, chainDB} = require('./levelSandbox');
	
/* ===== Block Class ==============================
|  Class with a constructor for block 			   |
|  ===============================================*/

class Block{
constructor(data){
     this.hash = "",
     this.height = 0,
     this.body = data,
     this.time = 0,
     this.previousBlockHash = ""
    }
}

/* ===== Blockchain Class ==========================
|  Class with a constructor for new blockchain 		|
|  ================================================*/

class Blockchain{
  constructor(){
	this.chain = [];
//Genesis Block persists
    this.getBlockHeight()
      .then((height) => {
			if (height === -1) {
   		 		return this.addBlock(new Block('Genesis block'))
         	}
		})
       .then(() => {
            console.log(`First block in the chain - Genesis block: ${block}`);
       })
  }

  // Add new block
  	async addBlock(newBlock) {

    // I need a previous block height 
     let previousBlockHeight = parseInt(await this.getBlockHeight())

    // Block height
    newBlock.height = previousBlockHeight + 1

    // UTC timestamp
    newBlock.time = new Date().getTime().toString().slice(0,-3)

    // previous block hash
    if(newBlock.height > 0 ) {
      let previousBlock = await this.getBlock(previousBlockHeight)
      newBlock.previousBlockHash = prevBlock.hash;
    }

    // Block hash with SHA256 using newBlock and converting to a string
    newBlock.hash = SHA256(JSON.stringify(newBlock)).toString();

    // Adding block object to level DB chain
  	await this.addLevelDBData(newBlock.height, JSON.stringify(newBlock));
  }
  addLevelDBData(height, newBlock) {
	return `Height: ${height} -- and new  block is: ${newBlock}`;  
  }
  //  Modified Get block height
    getBlockHeight() {
      return Promise.resolve(-1);
    }
    // Modified get block
    async getBlock (blockHeight) {   
      // return object as a single string
      return JSON.parse(JSON.stringify(this.chain[blockHeight]))
    }
    // Modified validate block
    async validateBlock (blockHeight) {
      // get block object
      let block = this.getBlock(blockHeight)
      // get block hash
      let blockHash = block.hash
      // remove block hash to test block integrity
      block.hash = ''
      // generate block hash
      let validBlockHash = SHA256(JSON.stringify(block)).toString()
      // Compare
      if (blockHash === validBlockHash) {
          return true
        } else {
          console.log(`Block #${blockHeight} invalid hash:\n${blockHash}<>${validBlockHash}`);
          return false
        }
    }

   // Modified validate blockchain
    async validateChain(){
      let errorLog = [];
      let blockChainHeight = await this.getBlockHeight()

      for (let i = 0; i < blockChainHeight; i++) {

        // validate block
        if (!this.validateBlock(i)) errorLog.push(i)

        // compare blocks hash link
        let blockHash = this.getBlock(i).hash
        let previousHash = this.getBlock(i+1).previousBlockHash
        if (blockHash !== previousHash) {
          errorLog.push(i);
        }
      }

      if (errorLog.length > 0) {
        console.log('Block errors = ' + errorLog.length);
        console.log('Blocks: '+errorLog);
      } else {
        console.log('No errors detected');
      }
    }
}

module.exports = {
    Block: Block,
    Blockchain: Blockchain,
}

// Code to be added at next steps
  
let blockchain = new Blockchain();

 //Add 10 blocks in the chain
(function theLoop (i) {
 setTimeout(() => {
    blockchain.addBlock(new Block(`Test data ${i}`)).then(() => {
      if (--i) {
        theLoop(i)
      }
    })
  }, 100);
})(10);
