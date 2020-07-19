export default {
  Address: "AccountId",
  LookupSource: "AccountId",
  AuthAccountId: "AccountId",
  AccountID32: "AccountId",

  KPProductPublishData: {
    paraIssueRate: "u32",
    selfIssueRate: "u32"
  },

  KPProductIdentifyData: {
    goodsPrice: "u32",
    identRate: "u32",
    identConsistence: "u32",
    cartId: "Vec<u8>"
  },

  KPProductTryData: {
    goodsPrice: "u32",
    offsetRate: "u32",
    trueRate: "u32",
    cartId: "Vec<u8>"
  }
};
