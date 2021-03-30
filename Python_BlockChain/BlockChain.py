
# Model Blockchain

"""

    This is my demo blockchain

    Dependencies - python's hashlib module
            python's time module
            python's random module
            python's event module

    Concepts of blockChain Covered - Linked List Architecture : all blocks in this chain are interconnected one to another
            Consensus Algorithm : before and after a block is added the chain is always validated
            Proof of work : miners are expected to do some processing before blocks are added  to chain
            Cryptography (Hashing) : the security of the entire blockchain is based on hashing a one way encryption

    A blockchain is a decentralized, distributed ledger system. There different types of blockchains.
    In this demonstration i am making using of a blockchain called MI_COIN_LEDGER and a token i called MICOIN

    My blockchain consists of 5 basic objects or classes which are:
    The BlockChain - This is the actual ledger system represented by an array of blocks
    The Block - This is each unique immutable record, they have some basic properties or identifiers called block headers
                these are: timestamp, nonce(represented as p_o_w), previous_hash, transaction object, block_status,
                version and merkle_root(the hash value of the block)
    The Transaction - This object contains information regarding a particular transaction such as the sender, receiver and
                the amount to be transferred.
    The Wallet - This are the actual users of the chain, they are called nodes(partial nodes precisely) this users have
                some abilities such as transferring and receiving funds
    The Miners - This are advanced nodes or full nodes in reality they all have a copy the blockchain but in this case they
                are limited to just mining blocks and earning rewards. (currently this blockchain has just one miner)

"""


import hashlib
import time
import random
from pymitter import EventEmitter

emitter = EventEmitter()

class BlockChain:

    def __init__(self):

        print("Initializing BlockChain")

        globals()['blockChain'] = self

        self.chain = [Block(
            timestamp=time.time(),
            p_o_w=hashlib.sha256(str(random.randint(1, 999999999)).encode()).hexdigest(),
            previous_hash="0x0000000000000000",  # 16bits of data to represent hexadecimal for the GENESIS BLOCK
            transaction=Transaction(MI, Gunit, 1000),
            block_status="Done",
        )]

        # cold boot the blockchain
        self.start()
        print("Successfully Created Genesis Block")
        print("BlockChain is now active")

    def start(self):
        print("Creating Genesis Block")
        return self.effect_transaction(self.chain[0].transaction, genesis=True)

    def effect_transaction(self, transaction, genesis=False):
        print(f"BlockChain received new transaction from {transaction.sender.address}. Now processing...")
        sender = transaction.sender
        receiver = transaction.receiver
        amount = transaction.amount

        reward_for_miner = 0.01 * amount
        total_fee = amount + reward_for_miner

        if not genesis:
            if sender.address != receiver.address:
                if sender.current_bal >= total_fee:
                    sender.current_bal -= total_fee
                    receiver.current_bal += amount

                    print(f"Transfer request from {sender.address} to {receiver.address}, amount : {amount}")
                    print("Transaction pending...")
                    
                    emitter.on('mined', self.pay_miner)

                    emitter.emit("mine", Block(
                        timestamp=time.time(),
                        p_o_w=hashlib.sha256(str(random.randint(1, 999999999)).encode()).hexdigest(),
                        previous_hash=self.get_last_block().merkle_root,
                        transaction=Transaction(sender, receiver, amount),
                        block_status="Pending",
                    ))


                else:
                    print("Transaction failed. Insufficient Funds to carry out transaction!")
            else:
                print("Transaction failed. Cannot transfer funds to between the same account")
        else:
            receiver.current_bal += amount

    def add(self, block):

        print("Validating the Block Chain")
        isValid = self.validate_chain()

        if isValid:

            block.previous_hash = self.get_last_block().merkle_root

            self.chain.append(block)

            sender = block.transaction.sender
            receiver = block.transaction.receiver

            sender.transaction_history.append(block.transaction)
            receiver.transaction_history.append(block.transaction)

            print("Confirming status of the BlockChain")
            isValid = self.validate_chain()

            if not isValid:
                pass

    def pay_miner(self, miners_data):
        miner = miners_data[0]
        pay = miners_data[1]
        block = miners_data[2]
        
        block_id = self.chain.index(block)
        if self.chain[block_id].block_status == "Pending":
        	
        	block_id =  self.chain.index(block)
        	
        	self.chain[block_id].block_status = "Done"
        	
        	self.chain[block_id].merkle_root = block.get_hash()
        
        	miner.current_bal += pay
        	print(f"Miner {miner.address} has been payed successfully")

    def get_last_block(self):
        return self.chain[-1]

    def validate_chain(self):

        if self.chain:
            if self.chain[0].merkle_root == self.chain[0].get_hash():  # validate integrity of genesis block
                for i in range(1, len(self.chain)):
                    if self.chain[i].previous_hash != self.chain[i-1].merkle_root or self.chain[i].merkle_root != self.chain[i].get_hash():
                        print("Block Change Status has changed please do not update your current state!")
                        print("Reversing Block Chain to stable State")

                        return False
                else:
                    return True
            else:
                print("Block Change Status has changed please do not update your current state!")
                print("Reversing Block Chain to stable State")
                return False


class Block:

    def __init__(self, timestamp, p_o_w, previous_hash, transaction, block_status, version="MICOIN"):
        self.timestamp = timestamp
        self.p_o_w = p_o_w
        self.previous_hash = previous_hash
        self.transaction = transaction
        self.block_status = block_status
        self.version = version
        self.merkle_root = self.get_hash()

    def get_hash(self):

        final_str = ""
        contents = [self.timestamp, self.p_o_w, self.previous_hash, self.transaction, self.block_status, self.version]

        for content in contents:
            final_str += str(content)

        return hashlib.sha512(final_str.encode()).hexdigest()


class Transaction:

    def __init__(self, sender, receiver, amount):
        self.sender = sender
        self.receiver = receiver
        self.senderAddress = self.get_address(self.sender)
        self.receiverAddress = self.get_address(self.receiver)
        self.amount = amount

    def get_address(self, x):
        return x.address


class Wallet:

    def __init__(self):
        self.transaction_history = []
        self.current_bal = 0
        self.address = self.get_hash()

    def get_hash(self):
        return hashlib.sha256(str(self).encode()).hexdigest()

    def transfer(self, amount, receiver):
        globals()['blockChain'].effect_transaction(Transaction(self, receiver, amount))

    def current_state(self):
        return self.__dict__


class Miner(Wallet):

    def __init__(self):
        Wallet.__init__(self)
        emitter.on('mine', self.mine)
        
    def mine(self, block):
        print("⚒ mining block...")

        puzzle = block.p_o_w
        miners_fee = block.transaction.amount * 0.01

        attempt = ""
        counter = 0

        while attempt != puzzle:
            attempt = hashlib.sha256(str(counter).encode()).hexdigest()

            counter += 1

        globals()['blockChain'].add(block)

        print("Block successfully mined")
        emitter.emit('mined', [self, miners_fee, block])
        
        print("Transaction Successful.")
        


if __name__ == "__main__":

    MI = Miner()
    Gunit = Wallet()

    MI_COIN_LEDGER = BlockChain()
    Rhoda = Wallet()
    Gabriel = Wallet()

    Gunit.transfer(40, Rhoda)
    Gunit.transfer(400, Gabriel)
    Gabriel.transfer(320, MI)
    Rhoda.transfer(38, Gunit)
   
