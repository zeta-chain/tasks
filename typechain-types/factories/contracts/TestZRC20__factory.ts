/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import {
  Signer,
  utils,
  Contract,
  ContractFactory,
  BigNumberish,
  Overrides,
} from "ethers";
import type { Provider, TransactionRequest } from "@ethersproject/providers";
import type { PromiseOrValue } from "../../common";
import type { TestZRC20, TestZRC20Interface } from "../../contracts/TestZRC20";

const _abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "initialSupply",
        type: "uint256",
      },
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "string",
        name: "symbol",
        type: "string",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "allowance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientAllowance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "balance",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "needed",
        type: "uint256",
      },
    ],
    name: "ERC20InsufficientBalance",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "approver",
        type: "address",
      },
    ],
    name: "ERC20InvalidApprover",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "receiver",
        type: "address",
      },
    ],
    name: "ERC20InvalidReceiver",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "sender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSender",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "ERC20InvalidSpender",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
    ],
    name: "allowance",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "approve",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "account",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "data",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "offset",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "size",
        type: "uint256",
      },
    ],
    name: "bytesToAddress",
    outputs: [
      {
        internalType: "address",
        name: "output",
        type: "address",
      },
    ],
    stateMutability: "pure",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [
      {
        internalType: "uint8",
        name: "",
        type: "uint8",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "deposit",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transfer",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "from",
        type: "address",
      },
      {
        internalType: "address",
        name: "to",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "transferFrom",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes",
        name: "to",
        type: "bytes",
      },
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "withdraw",
    outputs: [
      {
        internalType: "bool",
        name: "",
        type: "bool",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdrawGasFee",
    outputs: [
      {
        internalType: "address",
        name: "",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
] as const;

const _bytecode =
  "0x608060405234801561001057600080fd5b50604051611d6d380380611d6d833981810160405281019061003291906104f6565b818181600390816100439190610798565b5080600490816100539190610798565b50505061008d3361006861009560201b60201c565b60ff16600a61007791906109cc565b856100829190610a17565b61009e60201b60201c565b505050610b4a565b60006012905090565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036101105760006040517fec442f050000000000000000000000000000000000000000000000000000000081526004016101079190610a9a565b60405180910390fd5b6101226000838361012660201b60201c565b5050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff160361017857806002600082825461016c9190610ab5565b9250508190555061024b565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610204578381836040517fe450d38c0000000000000000000000000000000000000000000000000000000081526004016101fb93929190610af8565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff160361029457806002600082825403925050819055506102e1565b806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef8360405161033e9190610b2f565b60405180910390a3505050565b6000604051905090565b600080fd5b600080fd5b6000819050919050565b6103728161035f565b811461037d57600080fd5b50565b60008151905061038f81610369565b92915050565b600080fd5b600080fd5b6000601f19601f8301169050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6103e88261039f565b810181811067ffffffffffffffff82111715610407576104066103b0565b5b80604052505050565b600061041a61034b565b905061042682826103df565b919050565b600067ffffffffffffffff821115610446576104456103b0565b5b61044f8261039f565b9050602081019050919050565b60005b8381101561047a57808201518184015260208101905061045f565b60008484015250505050565b60006104996104948461042b565b610410565b9050828152602081018484840111156104b5576104b461039a565b5b6104c084828561045c565b509392505050565b600082601f8301126104dd576104dc610395565b5b81516104ed848260208601610486565b91505092915050565b60008060006060848603121561050f5761050e610355565b5b600061051d86828701610380565b935050602084015167ffffffffffffffff81111561053e5761053d61035a565b5b61054a868287016104c8565b925050604084015167ffffffffffffffff81111561056b5761056a61035a565b5b610577868287016104c8565b9150509250925092565b600081519050919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806105d357607f821691505b6020821081036105e6576105e561058c565b5b50919050565b60008190508160005260206000209050919050565b60006020601f8301049050919050565b600082821b905092915050565b60006008830261064e7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff82610611565b6106588683610611565b95508019841693508086168417925050509392505050565b6000819050919050565b600061069561069061068b8461035f565b610670565b61035f565b9050919050565b6000819050919050565b6106af8361067a565b6106c36106bb8261069c565b84845461061e565b825550505050565b600090565b6106d86106cb565b6106e38184846106a6565b505050565b5b81811015610707576106fc6000826106d0565b6001810190506106e9565b5050565b601f82111561074c5761071d816105ec565b61072684610601565b81016020851015610735578190505b61074961074185610601565b8301826106e8565b50505b505050565b600082821c905092915050565b600061076f60001984600802610751565b1980831691505092915050565b6000610788838361075e565b9150826002028217905092915050565b6107a182610581565b67ffffffffffffffff8111156107ba576107b96103b0565b5b6107c482546105bb565b6107cf82828561070b565b600060209050601f83116001811461080257600084156107f0578287015190505b6107fa858261077c565b865550610862565b601f198416610810866105ec565b60005b8281101561083857848901518255600182019150602085019450602081019050610813565b868310156108555784890151610851601f89168261075e565b8355505b6001600288020188555050505b505050505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b60008160011c9050919050565b6000808291508390505b60018511156108f0578086048111156108cc576108cb61086a565b5b60018516156108db5780820291505b80810290506108e985610899565b94506108b0565b94509492505050565b60008261090957600190506109c5565b8161091757600090506109c5565b816001811461092d576002811461093757610966565b60019150506109c5565b60ff8411156109495761094861086a565b5b8360020a9150848211156109605761095f61086a565b5b506109c5565b5060208310610133831016604e8410600b841016171561099b5782820a9050838111156109965761099561086a565b5b6109c5565b6109a884848460016108a6565b925090508184048111156109bf576109be61086a565b5b81810290505b9392505050565b60006109d78261035f565b91506109e28361035f565b9250610a0f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff84846108f9565b905092915050565b6000610a228261035f565b9150610a2d8361035f565b9250828202610a3b8161035f565b91508282048414831517610a5257610a5161086a565b5b5092915050565b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610a8482610a59565b9050919050565b610a9481610a79565b82525050565b6000602082019050610aaf6000830184610a8b565b92915050565b6000610ac08261035f565b9150610acb8361035f565b9250828201905080821115610ae357610ae261086a565b5b92915050565b610af28161035f565b82525050565b6000606082019050610b0d6000830186610a8b565b610b1a6020830185610ae9565b610b276040830184610ae9565b949350505050565b6000602082019050610b446000830184610ae9565b92915050565b61121480610b596000396000f3fe608060405234801561001057600080fd5b50600436106100cf5760003560e01c806347e7ef241161008c578063a9059cbb11610066578063a9059cbb1461023c578063c70126261461026c578063d9eeebed1461029c578063dd62ed3e146102bb576100cf565b806347e7ef24146101be57806370a08231146101ee57806395d89b411461021e576100cf565b806306fdde03146100d4578063095ea7b3146100f257806318160ddd1461012257806323b872dd146101405780632c27d3ab14610170578063313ce567146101a0575b600080fd5b6100dc6102eb565b6040516100e99190610cbc565b60405180910390f35b61010c60048036038101906101079190610d7c565b61037d565b6040516101199190610dd7565b60405180910390f35b61012a6103a0565b6040516101379190610e01565b60405180910390f35b61015a60048036038101906101559190610e1c565b6103aa565b6040516101679190610dd7565b60405180910390f35b61018a60048036038101906101859190610ed4565b6103d9565b6040516101979190610f57565b60405180910390f35b6101a861044d565b6040516101b59190610f8e565b60405180910390f35b6101d860048036038101906101d39190610d7c565b610456565b6040516101e59190610dd7565b60405180910390f35b61020860048036038101906102039190610fa9565b610462565b6040516102159190610e01565b60405180910390f35b6102266104aa565b6040516102339190610cbc565b60405180910390f35b61025660048036038101906102519190610d7c565b61053c565b6040516102639190610dd7565b60405180910390f35b61028660048036038101906102819190610fd6565b61055f565b6040516102939190610dd7565b60405180910390f35b6102a4610584565b6040516102b2929190611036565b60405180910390f35b6102d560048036038101906102d0919061105f565b610592565b6040516102e29190610e01565b60405180910390f35b6060600380546102fa906110ce565b80601f0160208091040260200160405190810160405280929190818152602001828054610326906110ce565b80156103735780601f1061034857610100808354040283529160200191610373565b820191906000526020600020905b81548152906001019060200180831161035657829003601f168201915b5050505050905090565b600080610388610619565b9050610395818585610621565b600191505092915050565b6000600254905090565b6000806103b5610619565b90506103c2858285610633565b6103cd8585856106c7565b60019150509392505050565b6000808585859085876103ec919061112e565b926103f99392919061116c565b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050905082810151915050949350505050565b60006012905090565b60006001905092915050565b60008060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020549050919050565b6060600480546104b9906110ce565b80601f01602080910402602001604051908101604052809291908181526020018280546104e5906110ce565b80156105325780601f1061050757610100808354040283529160200191610532565b820191906000526020600020905b81548152906001019060200180831161051557829003601f168201915b5050505050905090565b600080610547610619565b90506105548185856106c7565b600191505092915050565b60008061056e8585600c6107bb565b905061057a818461053c565b9150509392505050565b600080306000915091509091565b6000600160008473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905092915050565b600033905090565b61062e8383836001610830565b505050565b600061063f8484610592565b90507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff81146106c157818110156106b1578281836040517ffb8f41b20000000000000000000000000000000000000000000000000000000081526004016106a8939291906111a7565b60405180910390fd5b6106c084848484036000610830565b5b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036107395760006040517f96c6fd1e0000000000000000000000000000000000000000000000000000000081526004016107309190610f57565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16036107ab5760006040517fec442f050000000000000000000000000000000000000000000000000000000081526004016107a29190610f57565b60405180910390fd5b6107b6838383610a07565b505050565b600080848484906014866107cf919061112e565b926107dc9392919061116c565b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600081840152601f19601f82011690508083019250505050505050905060148101519150509392505050565b600073ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff16036108a25760006040517fe602df050000000000000000000000000000000000000000000000000000000081526004016108999190610f57565b60405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16036109145760006040517f94280d6200000000000000000000000000000000000000000000000000000000815260040161090b9190610f57565b60405180910390fd5b81600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508015610a01578273ffffffffffffffffffffffffffffffffffffffff168473ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040516109f89190610e01565b60405180910390a35b50505050565b600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1603610a59578060026000828254610a4d919061112e565b92505081905550610b2c565b60008060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054905081811015610ae5578381836040517fe450d38c000000000000000000000000000000000000000000000000000000008152600401610adc939291906111a7565b60405180910390fd5b8181036000808673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff1603610b755780600260008282540392505081905550610bc2565b806000808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020600082825401925050819055505b8173ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef83604051610c1f9190610e01565b60405180910390a3505050565b600081519050919050565b600082825260208201905092915050565b60005b83811015610c66578082015181840152602081019050610c4b565b60008484015250505050565b6000601f19601f8301169050919050565b6000610c8e82610c2c565b610c988185610c37565b9350610ca8818560208601610c48565b610cb181610c72565b840191505092915050565b60006020820190508181036000830152610cd68184610c83565b905092915050565b600080fd5b600080fd5b600073ffffffffffffffffffffffffffffffffffffffff82169050919050565b6000610d1382610ce8565b9050919050565b610d2381610d08565b8114610d2e57600080fd5b50565b600081359050610d4081610d1a565b92915050565b6000819050919050565b610d5981610d46565b8114610d6457600080fd5b50565b600081359050610d7681610d50565b92915050565b60008060408385031215610d9357610d92610cde565b5b6000610da185828601610d31565b9250506020610db285828601610d67565b9150509250929050565b60008115159050919050565b610dd181610dbc565b82525050565b6000602082019050610dec6000830184610dc8565b92915050565b610dfb81610d46565b82525050565b6000602082019050610e166000830184610df2565b92915050565b600080600060608486031215610e3557610e34610cde565b5b6000610e4386828701610d31565b9350506020610e5486828701610d31565b9250506040610e6586828701610d67565b9150509250925092565b600080fd5b600080fd5b600080fd5b60008083601f840112610e9457610e93610e6f565b5b8235905067ffffffffffffffff811115610eb157610eb0610e74565b5b602083019150836001820283011115610ecd57610ecc610e79565b5b9250929050565b60008060008060608587031215610eee57610eed610cde565b5b600085013567ffffffffffffffff811115610f0c57610f0b610ce3565b5b610f1887828801610e7e565b94509450506020610f2b87828801610d67565b9250506040610f3c87828801610d67565b91505092959194509250565b610f5181610d08565b82525050565b6000602082019050610f6c6000830184610f48565b92915050565b600060ff82169050919050565b610f8881610f72565b82525050565b6000602082019050610fa36000830184610f7f565b92915050565b600060208284031215610fbf57610fbe610cde565b5b6000610fcd84828501610d31565b91505092915050565b600080600060408486031215610fef57610fee610cde565b5b600084013567ffffffffffffffff81111561100d5761100c610ce3565b5b61101986828701610e7e565b9350935050602061102c86828701610d67565b9150509250925092565b600060408201905061104b6000830185610f48565b6110586020830184610df2565b9392505050565b6000806040838503121561107657611075610cde565b5b600061108485828601610d31565b925050602061109585828601610d31565b9150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602260045260246000fd5b600060028204905060018216806110e657607f821691505b6020821081036110f9576110f861109f565b5b50919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b600061113982610d46565b915061114483610d46565b925082820190508082111561115c5761115b6110ff565b5b92915050565b600080fd5b600080fd5b600080858511156111805761117f611162565b5b8386111561119157611190611167565b5b6001850283019150848603905094509492505050565b60006060820190506111bc6000830186610f48565b6111c96020830185610df2565b6111d66040830184610df2565b94935050505056fea264697066735822122062074f98320c38019bbeac1ec71cc040d7c4f7de4005577d6c256753db62984964736f6c634300081a0033";

type TestZRC20ConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: TestZRC20ConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class TestZRC20__factory extends ContractFactory {
  constructor(...args: TestZRC20ConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
  }

  override deploy(
    initialSupply: PromiseOrValue<BigNumberish>,
    name: PromiseOrValue<string>,
    symbol: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): Promise<TestZRC20> {
    return super.deploy(
      initialSupply,
      name,
      symbol,
      overrides || {}
    ) as Promise<TestZRC20>;
  }
  override getDeployTransaction(
    initialSupply: PromiseOrValue<BigNumberish>,
    name: PromiseOrValue<string>,
    symbol: PromiseOrValue<string>,
    overrides?: Overrides & { from?: PromiseOrValue<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(
      initialSupply,
      name,
      symbol,
      overrides || {}
    );
  }
  override attach(address: string): TestZRC20 {
    return super.attach(address) as TestZRC20;
  }
  override connect(signer: Signer): TestZRC20__factory {
    return super.connect(signer) as TestZRC20__factory;
  }

  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): TestZRC20Interface {
    return new utils.Interface(_abi) as TestZRC20Interface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): TestZRC20 {
    return new Contract(address, _abi, signerOrProvider) as TestZRC20;
  }
}
