/**
 * Program IDL in camelCase format in order to be used in JS/TS.
 *
 * Note that this is only a type helper and is not the actual IDL. The original
 * IDL can be found at `target/idl/multi_buy.json`.
 */
export type MultiBuy = {
  "address": "CprucEGtqY3ntLcT31ag1RmhRQZ1AU4jMf4DMuYcimdH",
  "metadata": {
    "name": "multiBuy",
    "version": "0.1.0",
    "spec": "0.1.0",
    "description": "Created with Anchor"
  },
  "instructions": [
    {
      "name": "multiBuy",
      "discriminator": [
        70,
        183,
        248,
        137,
        188,
        17,
        105,
        101
      ],
      "accounts": [
        {
          "name": "cpSwapProgram",
          "address": "CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C"
        },
        {
          "name": "payer",
          "signer": true
        },
        {
          "name": "feeWallet1",
          "writable": true
        },
        {
          "name": "feeWallet2",
          "writable": true
        },
        {
          "name": "feeWallet3",
          "writable": true
        },
        {
          "name": "authority",
          "pda": {
            "seeds": [
              {
                "kind": "const",
                "value": [
                  118,
                  97,
                  117,
                  108,
                  116,
                  95,
                  97,
                  110,
                  100,
                  95,
                  108,
                  112,
                  95,
                  109,
                  105,
                  110,
                  116,
                  95,
                  97,
                  117,
                  116,
                  104,
                  95,
                  115,
                  101,
                  101,
                  100
                ]
              }
            ],
            "program": {
              "kind": "account",
              "path": "cpSwapProgram"
            }
          }
        },
        {
          "name": "ammConfig"
        },
        {
          "name": "wsolAccount",
          "writable": true
        },
        {
          "name": "tokenProgram"
        },
        {
          "name": "wsolMint"
        },
        {
          "name": "systemProgram",
          "address": "11111111111111111111111111111111"
        },
        {
          "name": "poolState1",
          "writable": true
        },
        {
          "name": "poolState2",
          "writable": true
        },
        {
          "name": "poolState3",
          "writable": true
        },
        {
          "name": "poolState4",
          "writable": true
        },
        {
          "name": "poolState5",
          "writable": true
        },
        {
          "name": "poolState6",
          "writable": true
        },
        {
          "name": "poolState7",
          "writable": true
        },
        {
          "name": "poolState8",
          "writable": true
        },
        {
          "name": "poolState9",
          "writable": true
        },
        {
          "name": "poolState10",
          "writable": true
        },
        {
          "name": "poolState11",
          "writable": true
        },
        {
          "name": "poolState12",
          "writable": true
        },
        {
          "name": "outputTokenAccount1",
          "writable": true
        },
        {
          "name": "outputTokenAccount2",
          "writable": true
        },
        {
          "name": "outputTokenAccount3",
          "writable": true
        },
        {
          "name": "outputTokenAccount4",
          "writable": true
        },
        {
          "name": "outputTokenAccount5",
          "writable": true
        },
        {
          "name": "outputTokenAccount6",
          "writable": true
        },
        {
          "name": "outputTokenAccount7",
          "writable": true
        },
        {
          "name": "outputTokenAccount8",
          "writable": true
        },
        {
          "name": "outputTokenAccount9",
          "writable": true
        },
        {
          "name": "outputTokenAccount10",
          "writable": true
        },
        {
          "name": "outputTokenAccount11",
          "writable": true
        },
        {
          "name": "outputTokenAccount12",
          "writable": true
        },
        {
          "name": "inputVault1",
          "writable": true
        },
        {
          "name": "inputVault2",
          "writable": true
        },
        {
          "name": "inputVault3",
          "writable": true
        },
        {
          "name": "inputVault4",
          "writable": true
        },
        {
          "name": "inputVault5",
          "writable": true
        },
        {
          "name": "inputVault6",
          "writable": true
        },
        {
          "name": "inputVault7",
          "writable": true
        },
        {
          "name": "inputVault8",
          "writable": true
        },
        {
          "name": "inputVault9",
          "writable": true
        },
        {
          "name": "inputVault10",
          "writable": true
        },
        {
          "name": "inputVault11",
          "writable": true
        },
        {
          "name": "inputVault12",
          "writable": true
        },
        {
          "name": "outputVault1",
          "writable": true
        },
        {
          "name": "outputVault2",
          "writable": true
        },
        {
          "name": "outputVault3",
          "writable": true
        },
        {
          "name": "outputVault4",
          "writable": true
        },
        {
          "name": "outputVault5",
          "writable": true
        },
        {
          "name": "outputVault6",
          "writable": true
        },
        {
          "name": "outputVault7",
          "writable": true
        },
        {
          "name": "outputVault8",
          "writable": true
        },
        {
          "name": "outputVault9",
          "writable": true
        },
        {
          "name": "outputVault10",
          "writable": true
        },
        {
          "name": "outputVault11",
          "writable": true
        },
        {
          "name": "outputVault12",
          "writable": true
        },
        {
          "name": "outputTokenMint1"
        },
        {
          "name": "outputTokenMint2"
        },
        {
          "name": "outputTokenMint3"
        },
        {
          "name": "outputTokenMint4"
        },
        {
          "name": "outputTokenMint5"
        },
        {
          "name": "outputTokenMint6"
        },
        {
          "name": "outputTokenMint7"
        },
        {
          "name": "outputTokenMint8"
        },
        {
          "name": "outputTokenMint9"
        },
        {
          "name": "outputTokenMint10"
        },
        {
          "name": "outputTokenMint11"
        },
        {
          "name": "outputTokenMint12"
        },
        {
          "name": "observationState1",
          "writable": true
        },
        {
          "name": "observationState2",
          "writable": true
        },
        {
          "name": "observationState3",
          "writable": true
        },
        {
          "name": "observationState4",
          "writable": true
        },
        {
          "name": "observationState5",
          "writable": true
        },
        {
          "name": "observationState6",
          "writable": true
        },
        {
          "name": "observationState7",
          "writable": true
        },
        {
          "name": "observationState8",
          "writable": true
        },
        {
          "name": "observationState9",
          "writable": true
        },
        {
          "name": "observationState10",
          "writable": true
        },
        {
          "name": "observationState11",
          "writable": true
        },
        {
          "name": "observationState12",
          "writable": true
        }
      ],
      "args": [
        {
          "name": "amountIn",
          "type": "u64"
        },
        {
          "name": "minimumAmountOut",
          "type": "u64"
        },
        {
          "name": "tokenLength",
          "type": "u8"
        }
      ]
    }
  ],
  "accounts": [
    {
      "name": "ammConfig",
      "discriminator": [
        218,
        244,
        33,
        104,
        203,
        203,
        43,
        111
      ]
    },
    {
      "name": "observationState",
      "discriminator": [
        122,
        174,
        197,
        53,
        129,
        9,
        165,
        132
      ]
    },
    {
      "name": "poolState",
      "discriminator": [
        247,
        237,
        227,
        245,
        215,
        195,
        222,
        70
      ]
    }
  ],
  "errors": [
    {
      "code": 6000,
      "name": "invalidTokenLength",
      "msg": "token_length must be between 1 and 12"
    }
  ],
  "types": [
    {
      "name": "ammConfig",
      "docs": [
        "Holds the current owner of the factory"
      ],
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "bump",
            "docs": [
              "Bump to identify PDA"
            ],
            "type": "u8"
          },
          {
            "name": "disableCreatePool",
            "docs": [
              "Status to control if new pool can be create"
            ],
            "type": "bool"
          },
          {
            "name": "index",
            "docs": [
              "Config index"
            ],
            "type": "u16"
          },
          {
            "name": "tradeFeeRate",
            "docs": [
              "The trade fee, denominated in hundredths of a bip (10^-6)"
            ],
            "type": "u64"
          },
          {
            "name": "protocolFeeRate",
            "docs": [
              "The protocol fee"
            ],
            "type": "u64"
          },
          {
            "name": "fundFeeRate",
            "docs": [
              "The fund fee, denominated in hundredths of a bip (10^-6)"
            ],
            "type": "u64"
          },
          {
            "name": "createPoolFee",
            "docs": [
              "Fee for create a new pool"
            ],
            "type": "u64"
          },
          {
            "name": "protocolOwner",
            "docs": [
              "Address of the protocol fee owner"
            ],
            "type": "pubkey"
          },
          {
            "name": "fundOwner",
            "docs": [
              "Address of the fund fee owner"
            ],
            "type": "pubkey"
          },
          {
            "name": "padding",
            "docs": [
              "padding"
            ],
            "type": {
              "array": [
                "u64",
                16
              ]
            }
          }
        ]
      }
    },
    {
      "name": "observation",
      "docs": [
        "The element of observations in ObservationState"
      ],
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c",
        "packed": true
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "blockTimestamp",
            "docs": [
              "The block timestamp of the observation"
            ],
            "type": "u64"
          },
          {
            "name": "cumulativeToken0PriceX32",
            "docs": [
              "the cumulative of token0 price during the duration time, Q32.32, the remaining 64 bit for overflow"
            ],
            "type": "u128"
          },
          {
            "name": "cumulativeToken1PriceX32",
            "docs": [
              "the cumulative of token1 price during the duration time, Q32.32, the remaining 64 bit for overflow"
            ],
            "type": "u128"
          }
        ]
      }
    },
    {
      "name": "observationState",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c",
        "packed": true
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "initialized",
            "docs": [
              "Whether the ObservationState is initialized"
            ],
            "type": "bool"
          },
          {
            "name": "observationIndex",
            "docs": [
              "the most-recently updated index of the observations array"
            ],
            "type": "u16"
          },
          {
            "name": "poolId",
            "type": "pubkey"
          },
          {
            "name": "observations",
            "docs": [
              "observation array"
            ],
            "type": {
              "array": [
                {
                  "defined": {
                    "name": "observation"
                  }
                },
                100
              ]
            }
          },
          {
            "name": "padding",
            "docs": [
              "padding for feature update"
            ],
            "type": {
              "array": [
                "u64",
                4
              ]
            }
          }
        ]
      }
    },
    {
      "name": "poolState",
      "serialization": "bytemuckunsafe",
      "repr": {
        "kind": "c",
        "packed": true
      },
      "type": {
        "kind": "struct",
        "fields": [
          {
            "name": "ammConfig",
            "docs": [
              "Which config the pool belongs"
            ],
            "type": "pubkey"
          },
          {
            "name": "poolCreator",
            "docs": [
              "pool creator"
            ],
            "type": "pubkey"
          },
          {
            "name": "token0Vault",
            "docs": [
              "Token A"
            ],
            "type": "pubkey"
          },
          {
            "name": "token1Vault",
            "docs": [
              "Token B"
            ],
            "type": "pubkey"
          },
          {
            "name": "lpMint",
            "docs": [
              "Pool tokens are issued when A or B tokens are deposited.",
              "Pool tokens can be withdrawn back to the original A or B token."
            ],
            "type": "pubkey"
          },
          {
            "name": "token0Mint",
            "docs": [
              "Mint information for token A"
            ],
            "type": "pubkey"
          },
          {
            "name": "token1Mint",
            "docs": [
              "Mint information for token B"
            ],
            "type": "pubkey"
          },
          {
            "name": "token0Program",
            "docs": [
              "token_0 program"
            ],
            "type": "pubkey"
          },
          {
            "name": "token1Program",
            "docs": [
              "token_1 program"
            ],
            "type": "pubkey"
          },
          {
            "name": "observationKey",
            "docs": [
              "observation account to store oracle data"
            ],
            "type": "pubkey"
          },
          {
            "name": "authBump",
            "type": "u8"
          },
          {
            "name": "status",
            "docs": [
              "Bitwise representation of the state of the pool",
              "bit0, 1: disable deposit(value is 1), 0: normal",
              "bit1, 1: disable withdraw(value is 2), 0: normal",
              "bit2, 1: disable swap(value is 4), 0: normal"
            ],
            "type": "u8"
          },
          {
            "name": "lpMintDecimals",
            "type": "u8"
          },
          {
            "name": "mint0Decimals",
            "docs": [
              "mint0 and mint1 decimals"
            ],
            "type": "u8"
          },
          {
            "name": "mint1Decimals",
            "type": "u8"
          },
          {
            "name": "lpSupply",
            "docs": [
              "True circulating supply without burns and lock ups"
            ],
            "type": "u64"
          },
          {
            "name": "protocolFeesToken0",
            "docs": [
              "The amounts of token_0 and token_1 that are owed to the liquidity provider."
            ],
            "type": "u64"
          },
          {
            "name": "protocolFeesToken1",
            "type": "u64"
          },
          {
            "name": "fundFeesToken0",
            "type": "u64"
          },
          {
            "name": "fundFeesToken1",
            "type": "u64"
          },
          {
            "name": "openTime",
            "docs": [
              "The timestamp allowed for swap in the pool."
            ],
            "type": "u64"
          },
          {
            "name": "recentEpoch",
            "docs": [
              "recent epoch"
            ],
            "type": "u64"
          },
          {
            "name": "padding",
            "docs": [
              "padding for future updates"
            ],
            "type": {
              "array": [
                "u64",
                31
              ]
            }
          }
        ]
      }
    }
  ],
  "constants": [
    {
      "name": "feeWallet1",
      "type": "string",
      "value": "\"8Pu6QNnD8UnqXcaz3dYeXfNXfmaWoK6zbJZeUeaW1eAP\""
    }
  ]
};
