export default {
  AccountID32: "AccountId",
  AuthAccountId: "AccountId",

  KPProductIdentifyData: {
    goodsPrice: "u32",
    identRate: "u32",
    identConsistence: "u32",
    cartId: "Vec<u8>"
  },

  KPProductPublishData: {
    paraIssueRate: "u32",
    selfIssueRate: "u32"
  },

  KPProductTryData: {
    goodsPrice: "u32",
    offsetRate: "u32",
    trueRate: "u32",
    cartId: "Vec<u8>"
  },

  PowerSize: "u128"
};
