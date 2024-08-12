import { Account, Aptos, AptosConfig, CommittedTransactionResponse, Network } from "@aptos-labs/ts-sdk";
import { InputViewFunctionData } from "@aptos-labs/ts-sdk";

interface IAccountResponse {
    name: string,
    score: number,
    user_address: string
}


 // Setup the client
const config = new AptosConfig({ network: Network.DEVNET });
const aptos = new Aptos(config);



 async function init_account() {
    console.log("init account...")
    const signerAccount: Account = Account.generate();
    // Fund the account on chain. Funding an account creates it on-chain.
    await aptos.fundAccount({
    accountAddress: signerAccount.accountAddress,
    amount: 100000000,
    });
    console.log("done init")
    return signerAccount
 }

 function toHexString(bytes: Array<number>) {
  return bytes.map(function(byte) {
    return (byte & 0xFF).toString(16)
  }).join('')
}

async function create_account(
  signerAccount: Account, 
  userName: string,
  onSuccess: () => void,
  onFalure: () => void,
  

) {
    //build transaction =================================================================
    let transaction = await aptos.transaction.build.simple({
        sender: signerAccount.accountAddress,
        data: {
            // The Move entry-function
          function: `${process.env.REACT_APP_PACKAGE_ADDRESS}::user::create_account`,
          functionArguments: [userName],
        },
      });
      
      const pendingTransaction = await aptos.signAndSubmitTransaction({
        signer: signerAccount,
        transaction,
      });
      try {
        const executedTransaction = await aptos.waitForTransaction({ transactionHash: pendingTransaction.hash });
        console.log(executedTransaction)
        onSuccess()
      } catch(e) {
        onFalure()
      }

}

async function purchase_creadits(
  signer: Account, 
  creadits: number,
  onSuccess: () => void,
  onFalure: () => void
) {
  console.log("Hello from purchase_creadits function")
  let transaction = await aptos.transaction.build.simple({
    sender: signer.accountAddress,
    data: {
      function: `${process.env.REACT_APP_PACKAGE_ADDRESS}::user::request_for_score`,
      functionArguments: [creadits],
    },
  });
  
  const pendingTransaction = await aptos.signAndSubmitTransaction({
    signer,
    transaction,
  });
  try {
    const executedTransaction = await aptos.waitForTransaction({ transactionHash: pendingTransaction.hash });
    get_event(executedTransaction)
    if(executedTransaction) {
      onSuccess()
    }
  } catch(e) {
    onFalure()
  }
  

}




function get_event(json_result: CommittedTransactionResponse) {

  let events = JSON.parse(JSON.stringify(json_result))?.events
  events.map((event: any) => {
    if(event?.type.includes(`${process.env.REACT_APP_PACKAGE_ADDRESS}::user`)) {
    console.log(event)
  }
  })
}

async function submit_request(
  creadits: number,
  signer: Account,
  onSuccess: () => void,
  onFalure: () => void

) {
  console.log("Hello from purchase_creadits function")
  let transaction = await aptos.transaction.build.simple({
    sender: signer.accountAddress,
    data: {
      function: `${process.env.REACT_APP_PACKAGE_ADDRESS}::user::submit_chat_request`,
      functionArguments: [creadits, creadits],
    },
  });
  
  const pendingTransaction = await aptos.signAndSubmitTransaction({
    signer,
    transaction,
  });
  console.log(pendingTransaction)
  try{
    const executedTransaction = await aptos.waitForTransaction({ transactionHash: pendingTransaction.hash });
    console.log(executedTransaction)
    onSuccess()
  } catch(e) {
    onFalure()
  }
  // get_event(executedTransaction)
}

async function get_user_info(
  signer: Account, 
  onSuccess: (acount: IAccountResponse)=> void,
  onFalure: ()=> void

) {
  const payload: InputViewFunctionData = {
    function: `${process.env.REACT_APP_PACKAGE_ADDRESS}::user::get_account_info`,
    functionArguments: [signer.accountAddress],
  };

  const chainId = (await aptos.view({ payload }))[0]; //get the result from the chain
  let json_result = JSON.parse(JSON.stringify(chainId))?.vec[0] //parse the result to json
  console.log("view info")
  if(json_result) { //check weather result is defined or not
    onSuccess({name: json_result?.name,
      score: json_result?.score,
      user_address: json_result?.user_address})
  } else {
    onFalure()
  }
}
 
export {create_account, get_user_info, init_account, purchase_creadits, submit_request, type IAccountResponse};


// interacted with the contract
// keep implementing the contract
