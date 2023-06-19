import {testnetConnection, JsonRpcProvider, TransactionBlock} from '@mysten/sui.js';
import {getReturnValuesFromInspectResults} from "@interest-protocol/sui-amm-sdk";
import { BCS, getSuiMoveConfig } from '@mysten/bcs';

const bcs = new BCS(getSuiMoveConfig());

export const provider = new JsonRpcProvider(
   testnetConnection
);

const txb = new TransactionBlock();

bcs.registerStructType('Url', {
    url: BCS.STRING
});

bcs.registerEnumType('Option<T>', {
    none: null,
    some: 'T',
});

bcs.registerStructType('Profile', {
    id: BCS.ADDRESS,
    owner: BCS.ADDRESS,
    avatar: 'Url'
})

bcs.registerStructType('Reply', {
    id: BCS.ADDRESS,
    creator: 'Profile',
    created_at: BCS.U64,
    content : BCS.STRING,
    replies : `vector<${BCS.STRING}>`
})

bcs.registerStructType('Comment', {
    id: BCS.ADDRESS,
    creator: 'Profile',
    created_at: BCS.U64,
    content: BCS.STRING,
    reply: `vector<Reply>`
})

bcs.registerStructType('Post', {
    id: BCS.ADDRESS,
    title: BCS.STRING,
    content: BCS.STRING,
    creator: BCS.ADDRESS,
    vote: BCS.U64,
    comments: 'vector<Comment>'
})

bcs.registerStructType('Community', {
    id: BCS.ADDRESS,
    avatar: 'Option<Url>',
    cover_image: 'Option<Url>',
    creator: BCS.ADDRESS,
    visible: BCS.BOOL,
    title: BCS.STRING,
    description: BCS.STRING,
    followers: `vector<${BCS.ADDRESS}>`,
    members : `vector<${BCS.ADDRESS}>`,
    posts : `vector<Post>`,
    created_at : BCS.U64
})

const start = async () => {
    txb.moveCall({
        target: `0x5fca5c7448d504bfd8f59fa7ec8484c60d23a6e8c3c8f0ec3e066c93f716fca4::gilder::get_all_communities`,
        arguments: [txb.object('0xc48f0e48419ac42aa021ea3ed7ccb06d0ab75f637ebb3cc9dfa6642bcf9eede4',)]
    })

    const result = await provider.devInspectTransactionBlock({
        transactionBlock: txb, sender: '0x0000000000000000000000000000000000000000000000000000000000000000'
    })

    const r = getReturnValuesFromInspectResults(result);

    if (r)
    console.log(r.map(x => {
        return bcs.de('vector<Community>', Uint8Array.from(x[0]))
    }))
}


(async () => {
    await start()
})()
