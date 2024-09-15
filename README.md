# Network: Devnet
# Setup wallet support

[Aptos wallet connect](https://aptos.dev/en/build/guides/build-e2e-dapp/3-add-wallet-support)

Use `const {account,signAndSubmitTransaction} = useWallet()`  to get user wallet (use this wallet to sign transactions)
Use [Petra Aptos wallet](https://chromewebstore.google.com/detail/petra-aptos-wallet/ejjladinnckdgjemekebdpeokbikhfci) to sign transaction:
Apter create account -> setting -> network -> testnet
# API docs for calling contract

***Note: This project will containt 2 type of accounts: 1 is wallet accounts use for signing transaction and the others is user account which is stored on smartcontract to use our services***
## .env 
```REACT_APP_PACKAGE_ADDRESS=0xd8029c761d7cfd93ada529e5d80db270943a7a53d3405037c5a477b124e95b3d```
## Type:

### IAccountResponse

```
interface IAccountResponse {
  name: string,
  score: number,
  user_address: string
}

```

## Functions:

### Load user info:
``` 
async function get_user_info(
  signer: AccountInfo, 
  onSuccess: (acount: IAccountResponse)=> void,
  onFalure: ()=> void

)
```

#### Description:

This function will get user address from signer, and use SDK to call contract for user info. If user is already existed on platform then call on_success, else  call on_fail

#### Parameter:

1. signer: AccountInfo : user account get from wallet (useWallet), this function will get account addresss to find account info
2. onSuccess: (acount: IAccountResponse)=> void: This function will be called if get user info successful
3. onFalure: ()=> This function will be called when get get user info failed (user have not existed on the platform before).

### Create account:
```
async function create_account(
  signAndSubmitTransaction: (transaction: InputTransactionData) => Promise<any>,
  userName: string,
  onSuccess: () => void,
  onFalure: () => void,
  

)
```

#### Description:

This function will create a new account for user to use Aptopus services.

#### Parameters:

1. signAndSubmitTransaction: use to sign transaction
2. userName: username, this value shouldn't require the special characters except '_'
3. onSuccess: ()=> void: This function will be called if create userinfo successful
4.  onFalure: ()=> This function will be called when create new account fail (user address have already existed on aptopus plaform).

### Purchase for creadits
```
async function purchase_creadits(
  signAndSubmitTransaction: (transaction: InputTransactionData) => Promise<any>,
  creadits: number,
  onSuccess: () => void,
  onFalure: () => void
)
```
#### Description
This function will send a request for furchase creadits to smartcontract, user will give the number of creadits that they want to purchase.

#### Parameters:

1. signAndSubmitTransaction: use to sign transaction
2. creadits:number of creadits that user want to purchase
3. onSuccess: ()=> void: This function will be called if purchase request successful
4. onFalure: ()=> This function will be called when purchase request fail (user balance do not enough to purchase these creadits).

### Submit chat request
```
async function submit_request(
  signAndSubmitTransaction: (transaction: InputTransactionData) => Promise<any>,
  creadits: number,
  onSuccess: () => void,
  onFalure: () => void
)
```

#### Description
This function will send a chat request to smartcontract. 

#### Parameters
1. signAndSubmitTransaction: use to sign transaction
2. creadits:number of creadits that user have to pay for chat request  
3. onSuccess: ()=> void: This function will be called if purchase request successful
4. onFalure: ()=> This function will be called when purchase request fail (user creadits do not enough to purchase these creadits).


