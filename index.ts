import { Account, Aptos, AptosConfig, CommittedTransactionResponse, Network } from "@aptos-labs/ts-sdk";
import { InputViewFunctionData } from "@aptos-labs/ts-sdk";
import { AccountInfo, InputTransactionData } from "@aptos-labs/wallet-adapter-react";

interface IAccountResponse {
    name: string,
    score: number,
    user_address: string
}


 // Setup the client
const config = new AptosConfig({ network: Network.DEVNET });
const aptos = new Aptos(config);

import axios from "axios";

// async function callGraphqlApi(query: string, variables: any) {
//   try {
//     const response = await axios.post('', {
//       query,
//       variables,
//     });
//     return response.data;
//   } catch (error) {
//     console.error("Failed to call GraphQL API:", error);
//     throw error;
//   }
// }

async function create_account(
  signAndSubmitTransaction: (transaction: InputTransactionData) => Promise<any>,
  userName: string,
  onSuccess: () => void,
  onFalure: () => void,
) {
    //build transaction ================================================================= đá
    let transaction: InputTransactionData = {
        data: {
            // The Move entry-function
          function: `${process.env.REACT_APP_PACKAGE_ADDRESS}::user::create_account`,
          functionArguments: [userName],
        },
      };
      
      try {
        const res = await signAndSubmitTransaction(transaction);
        await aptos.waitForTransaction({ transactionHash: res.hash });
        onSuccess()
      } catch(e) {
        onFalure()
      }
}

async function purchase_creadits(
  signAndSubmitTransaction: (transaction: InputTransactionData) => Promise<any>,
  creadits: number,
  onSuccess: () => void,
  onFalure: () => void
) {
  console.log("Hello from purchase_creadits function")
  let transaction: InputTransactionData = {
    data: {
      function: `${process.env.REACT_APP_PACKAGE_ADDRESS}::user::request_for_score`,
      functionArguments: [creadits],
    },
  };
 
  try {
    const res = await signAndSubmitTransaction(transaction);
    await aptos.waitForTransaction({ transactionHash: res.hash });
    onSuccess()
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
  signAndSubmitTransaction: (transaction: InputTransactionData) => Promise<any>,
  creadits: number,
  onSuccess: () => void,
  onFalure: () => void

) {
  console.log("Hello from purchase_creadits function")
  let transaction: InputTransactionData = {
    data: {
      function: `${process.env.REACT_APP_PACKAGE_ADDRESS}::user::submit_chat_request`,
      functionArguments: [creadits],
    },
  };

  try{
    const res = await signAndSubmitTransaction(transaction);
    await aptos.waitForTransaction({ transactionHash: res.hash });
    onSuccess()
  } catch(e) {
    onFalure()
  }
  // get_event(executedTransaction)
}

async function get_user_info(
  signer: AccountInfo, 
  onSuccess: (acount: IAccountResponse)=> void,
  onFalure: ()=> void

) {
  const payload: InputViewFunctionData = {
    function: `${process.env.REACT_APP_PACKAGE_ADDRESS}::user::get_account_info`,
    functionArguments: [signer.address],
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
 
export {create_account, get_user_info, purchase_creadits, submit_request, type IAccountResponse};


// interacted with the contract
// keep implementing the contract
