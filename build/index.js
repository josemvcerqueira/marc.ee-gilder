"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.provider = void 0;
const sui_js_1 = require("@mysten/sui.js");
const sui_amm_sdk_1 = require("@interest-protocol/sui-amm-sdk");
const bcs_1 = require("@mysten/bcs");
const bcs = new bcs_1.BCS((0, bcs_1.getSuiMoveConfig)());
exports.provider = new sui_js_1.JsonRpcProvider(sui_js_1.testnetConnection);
const txb = new sui_js_1.TransactionBlock();
bcs.registerStructType('Url', {
    url: bcs_1.BCS.STRING
});
bcs.registerEnumType('Option<T>', {
    none: null,
    some: 'T',
});
bcs.registerStructType('Profile', {
    id: bcs_1.BCS.ADDRESS,
    owner: bcs_1.BCS.ADDRESS,
    avatar: 'Url'
});
bcs.registerStructType('Reply', {
    id: bcs_1.BCS.ADDRESS,
    creator: 'Profile',
    created_at: bcs_1.BCS.U64,
    content: bcs_1.BCS.STRING,
    replies: `vector<${bcs_1.BCS.STRING}>`
});
bcs.registerStructType('Comment', {
    id: bcs_1.BCS.ADDRESS,
    creator: 'Profile',
    created_at: bcs_1.BCS.U64,
    content: bcs_1.BCS.STRING,
    reply: `vector<Reply>`
});
bcs.registerStructType('Post', {
    id: bcs_1.BCS.ADDRESS,
    title: bcs_1.BCS.STRING,
    content: bcs_1.BCS.STRING,
    creator: bcs_1.BCS.ADDRESS,
    vote: bcs_1.BCS.U64,
    comments: 'vector<Comment>'
});
bcs.registerStructType('Community', {
    id: bcs_1.BCS.ADDRESS,
    avatar: 'Option<Url>',
    cover_image: 'Option<Url>',
    creator: bcs_1.BCS.ADDRESS,
    visible: bcs_1.BCS.BOOL,
    title: bcs_1.BCS.STRING,
    description: bcs_1.BCS.STRING,
    followers: `vector<${bcs_1.BCS.ADDRESS}>`,
    members: `vector<${bcs_1.BCS.ADDRESS}>`,
    posts: `vector<Post>`,
    created_at: bcs_1.BCS.U64
});
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    txb.moveCall({
        target: `0x5fca5c7448d504bfd8f59fa7ec8484c60d23a6e8c3c8f0ec3e066c93f716fca4::gilder::get_all_communities`,
        arguments: [txb.object('0xc48f0e48419ac42aa021ea3ed7ccb06d0ab75f637ebb3cc9dfa6642bcf9eede4')]
    });
    const result = yield exports.provider.devInspectTransactionBlock({
        transactionBlock: txb, sender: '0x0000000000000000000000000000000000000000000000000000000000000000'
    });
    const r = (0, sui_amm_sdk_1.getReturnValuesFromInspectResults)(result);
    if (r)
        console.log(r.map(x => {
            console.log(x);
            return bcs.de('vector<Community>', Uint8Array.from(x[0]));
        }));
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield start();
}))();
