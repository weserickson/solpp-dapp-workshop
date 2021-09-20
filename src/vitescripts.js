import provider from '@vite/vitejs-ws'
import { ViteAPI, utils, abi, accountBlock } from '@vite/vitejs';
import Connector from '@vite/connector';
import store from './store.js'

// GuessToWin.solpp deployed on mainnet.
const CONTRACT = {
    binary: '6080604052695649544520544f4b454e6000806101000a81548169ffffffffffffffffffff021916908369ffffffffffffffffffff16021790555034801561004657600080fd5b50610493806100566000396000f3fe60806040526004361061004c576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680632f3fd382146100515780634037367f1461007f575b600080fd5b61007d6004803603602081101561006757600080fd5b8101908080359060200190929190505050610105565b005b34801561008b57600080fd5b50610103600480360360208110156100a257600080fd5b81019080803590602001906401000000008111156100bf57600080fd5b8201836020820111156100d157600080fd5b803590602001918460018302840111640100000000831117156100f357600080fd5b9091929391929390505050610205565b005b6000809054906101000a900469ffffffffffffffffffff1669ffffffffffffffffffff164669ffffffffffffffffffff1614151561014257600080fd5b60003411151561015157600080fd5b3460016000838152602001908152602001600021600082825401925050819055503374ffffffffffffffffffffffffffffffffffffffffff167f77a53ba576f02bbcf9476a3c145b86a7d6bd6b21146c340e09b159930f009c2734836040518083815260200182815260200180602001828103825260078152602001807f46756e6465642100000000000000000000000000000000000000000000000000815250602001935050505060405180910390a250565b600082826040516020018083838082843780830192505050925050506040516020818303038152906040528051906020012190506000600160008381526020019081526020016000215411156103a4573374ffffffffffffffffffffffffffffffffffffffffff166000809054906101000a900469ffffffffffffffffffff1669ffffffffffffffffffff16600160008481526020019081526020016000215460405160405180820390838587f1505050503374ffffffffffffffffffffffffffffffffffffffffff167f79f767819a95ca6f5ca6b90c06017a10349ede086163fdef1a4d49bdcee7ebe3600160008481526020019081526020016000215485856040518084815260200180602001806020018381038352858582818152602001925080828437600081840152601f19601f820116905080830192505050838103825260088152602001807f436f7272656374210000000000000000000000000000000000000000000000008152506020019550505050505060405180910390a260006001600083815260200190815260200160002181905550610462565b3374ffffffffffffffffffffffffffffffffffffffffff167f5bea6350b0d83ca5aa5dbf85bc38ba2b36b90d9ab60ab92808a8ed80bc1e5f55600085856040518084815260200180602001806020018381038352858582818152602001925080828437600081840152601f19601f8201169050808301925050508381038252600a8152602001807f54727920616761696e21000000000000000000000000000000000000000000008152506020019550505050505060405180910390a25b50505056fea165627a7a723058205b6072e54205a3f3624764a5e9538c146555339be7091d86861703a2eec051000029',
    abi: [{"constant":false,"inputs":[{"name":"hashval","type":"bytes32"}],"name":"Fund","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[{"name":"body","type":"string"}],"name":"Guess","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"addr","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"hashval","type":"bytes32"},{"indexed":false,"name":"log","type":"string"}],"name":"Funded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"addr","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"guess","type":"string"},{"indexed":false,"name":"log","type":"string"}],"name":"Awarded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"addr","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"guess","type":"string"},{"indexed":false,"name":"log","type":"string"}],"name":"Failed","type":"event"}],
    offChain: '608060405260043610600f57600f565b00fea165627a7a723058205b6072e54205a3f3624764a5e9538c146555339be7091d86861703a2eec051000029',
    address: 'vite_9c2568f00a05b381136ff2f790925e9d6c1a6ca011d0f40b04'
}

// Setup ViteAPI client using websockets. We will use this to subscribe to events.
//const providerURL = 'wss://buidl.vite.net/gvite/ws'; // testnet node
const providerURL = 'wss://node-tokyo.vite.net/ws';
const providerTimeout = 60000;
const providerOptions = { retryTimes: 10, retryInterval: 5000 };
const WS_RPC = new provider(providerURL, providerTimeout, providerOptions);
const viteClient = new ViteAPI(WS_RPC, () => {
    console.log("client connected");
});


// Setup ViteConnect to allow user to securely fund and guess answers.
const BRIDGE = 'wss://biforst.vite.net'
let vbInstance = null;

// Initiates ViteConnect, automatically allows for reconnections
function initConnector(){
    vbInstance = new Connector({ bridge: BRIDGE })

    vbInstance.createSession().then(() => {
        store.uri = vbInstance.uri;

        // vbInstance.uri can be turn to an QR code image.
        // Then scan the QR code image with Vite App.
        console.log('connect uri', vbInstance.uri);
        store.state = 'waiting';
    });

    vbInstance.on('connect', (err, payload) => {
        const { accounts } = payload.params[0];
        if (!accounts || !accounts[0]) throw new Error('address is null');

        const address = accounts[0];
        console.log(address)

        store.address = address;
        store.state = 'connected'
    })

    vbInstance.on('disconnect', err => {
        console.log(err)
        store.state = 'disconnected'

        // simple 2 second auto-reconnect to generate new QR code.
        setTimeout(initConnector, 2000);

        // clean up old connection
        vbInstance.destroy();
    })
}
initConnector();

// Helper function for requesting user to sign transaction via ViteConnect.
async function sendVcTx(...args) {    
    console.log(args)
    vbInstance.sendCustomRequest({method: 'vite_signAndSendTx', params: args}
    ).then(signedBlock => console.log(signedBlock), err => console.error(err))
    .catch( (err) => {console.warn(err); throw(err)});
}

async function callContract(methodName, params, amount) {
    let block = await accountBlock.createAccountBlock('callContract', {
        address: store.address,
        abi: CONTRACT.abi,
        toAddress: CONTRACT.address,
        params,
        methodName,
        amount: String(amount),        
    })
    let myblock = block.accountBlock
    console.log("SENDING BLOCK:", myblock)
    await sendVcTx({block: myblock, abi: CONTRACT.abi})
}

async function callFund(secret, amount) {
    const hashval = utils.blake2bHex(secret,false,32);
    console.log("FUNDING:", hashval)
    return await callContract("Fund", [hashval], amount)
}

async function callGuess(guess) {
    console.log("GUESSING:", guess)
    return await callContract("Guess", [guess], '0')
}

async function subscribeToEvent(eventName, callback){
    const address = CONTRACT.address;
    const topichash = abi.encodeLogSignature(CONTRACT.abi, eventName);
    const filterParameters = {"addressHeightRange":{[address]:{"fromHeight":"0","toHeight":"0"}}, "topics": [[topichash]]}; 
    const subscription = await viteClient.subscribe("createVmlogSubscription", filterParameters);
    subscription.callback = (res) => {
        console.log("EVENT:", res);
        const data = Buffer.from(res[0]['vmlog']['data'], 'base64').toString('hex');
        const log = abi.decodeLog(CONTRACT.abi, data, topichash, eventName);
        callback(log);
    };
    console.log("SUBSCRIBED:", eventName);
}

/*
// Alternative approach to setting up subscriptions.
async function subscribeToEvent(eventName, callback){
    const address = CONTRACT.address;
    const filterParameters = {"addressHeightRange":{[address]:{"fromHeight":"0","toHeight":"0"}}}; 
    viteClient.subscribe("createVmlogSubscription", filterParameters).then( (event) => {
        event.on( (res) => {
            console.log("EVENT:",res);
            if (!Array.isArray(res)) return;
            const sig = abi.encodeLogSignature(CONTRACT.abi, eventName);
            if (sig === res[0]['vmlog']['topics'][0]) {
                const data = Buffer.from(res[0]['vmlog']['data'], 'base64').toString('hex');
                const log = abi.decodeLog(CONTRACT.abi, data, sig, eventName);
                callback(log);
            }
        })
    }).catch((err) => {
        console.log(err);
    });
    console.log("SUBSCRIBED", eventName);
}
*/

export {
    callFund,
    callGuess,
    subscribeToEvent
}
