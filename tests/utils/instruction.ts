import { Program, BN } from '@coral-xyz/anchor'
import { MultiBuy as CpSwapCpi } from '../../target/types/multi_buy'
import {
  Connection,
  ConfirmOptions,
  PublicKey,
  Keypair,
  Signer,
  SystemProgram,
  SYSVAR_RENT_PUBKEY,
  ComputeBudgetInstruction,
  ComputeBudgetProgram,
  AddressLookupTableProgram,
  sendAndConfirmTransaction,
  Transaction,
  TransactionMessage,
  VersionedTransaction,
} from '@solana/web3.js'
import {
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
  getAssociatedTokenAddressSync,
  NATIVE_MINT,
} from '@solana/spl-token'
import {
  getAuthAddress,
  getPoolAddress,
  getPoolLpMintAddress,
  getPoolVaultAddress,
  createTokenMintAndAssociatedTokenAccount,
  getOrcleAccountAddress,
  createTokenMintsAndAssociatedTokenAccount,
  sleep,
} from './index'

import {
  cpSwapProgram,
  configAddress,
  createPoolFeeReceive,
  feeWallet1,
  feeWallet2,
  feeWallet3,
} from '../config'
import { ASSOCIATED_PROGRAM_ID } from '@coral-xyz/anchor/dist/cjs/utils/token'
import { CpmmPoolInfoLayout, publicKey } from '@raydium-io/raydium-sdk-v2'

export async function setupInitializeTest(
  connection: Connection,
  owner: Signer,
  transferFeeConfig: { transferFeeBasisPoints: number; MaxFee: number } = {
    transferFeeBasisPoints: 0,
    MaxFee: 0,
  },
  confirmOptions?: ConfirmOptions
) {
  const [{ token0, token0Program }, { token1, token1Program }] =
    await createTokenMintAndAssociatedTokenAccount(
      connection,
      owner,
      new Keypair(),
      transferFeeConfig
    )
  return {
    configAddress,
    token0,
    token0Program,
    token1,
    token1Program,
  }
}

export async function setupDepositTest(
  program: Program<CpSwapCpi>,
  connection: Connection,
  owner: Signer,
  transferFeeConfig: { transferFeeBasisPoints: number; MaxFee: number } = {
    transferFeeBasisPoints: 0,
    MaxFee: 0,
  },
  confirmOptions?: ConfirmOptions,
  initAmount: { initAmount0: BN; initAmount1: BN } = {
    initAmount0: new BN(10000000000),
    initAmount1: new BN(20000000000),
  },
  tokenProgramRequired?: {
    token0Program: PublicKey
    token1Program: PublicKey
  }
) {
  while (1) {
    const [{ token0, token0Program }, { token1, token1Program }] =
      await createTokenMintAndAssociatedTokenAccount(
        connection,
        owner,
        new Keypair(),
        transferFeeConfig
      )

    if (tokenProgramRequired != undefined) {
      if (
        token0Program.equals(tokenProgramRequired.token0Program) &&
        token1Program.equals(tokenProgramRequired.token1Program)
      ) {
        const { cpSwapPoolState } = await initialize(
          program,
          owner,
          configAddress,
          token0,
          token0Program,
          token1,
          token1Program,
          confirmOptions,
          initAmount
        )
        return cpSwapPoolState
      }
    } else {
      const { cpSwapPoolState } = await initialize(
        program,
        owner,
        configAddress,
        token0,
        token0Program,
        token1,
        token1Program,
        confirmOptions,
        initAmount
      )
      return cpSwapPoolState
    }
  }
}

export async function setupSwapTest(
  program: Program<CpSwapCpi>,
  connection: Connection,
  owner: Signer,
  transferFeeConfig: { transferFeeBasisPoints: number; MaxFee: number } = {
    transferFeeBasisPoints: 0,
    MaxFee: 0,
  },
  confirmOptions?: ConfirmOptions
) {
  const [{ token0, token0Program }, { token1, token1Program }] =
    await createTokenMintAndAssociatedTokenAccount(
      connection,
      owner,
      new Keypair(),
      transferFeeConfig
    )

  const { cpSwapPoolState } = await initialize(
    program,
    owner,
    configAddress,
    token0,
    token0Program,
    token1,
    token1Program,
    confirmOptions
  )

  await deposit(
    program,
    owner,
    configAddress,
    token0,
    token0Program,
    token1,
    token1Program,
    new BN(10000000000),
    new BN(100000000000),
    new BN(100000000000),
    confirmOptions
  )
  return cpSwapPoolState
}

export async function setupMultiBuyTest(
  program: Program<CpSwapCpi>,
  connection: Connection,
  owner: Signer,
  confirmOptions?: ConfirmOptions
) {
  const { token1, token2, token3, token4, tokenProgram, wsolAccount } =
    await createTokenMintsAndAssociatedTokenAccount(
      connection,
      owner,
      new Keypair()
    )
  const { cpSwapPoolState: cpSwapPoolState1 } = await initialize(
    program,
    owner,
    configAddress,
    NATIVE_MINT,
    TOKEN_PROGRAM_ID,
    token1,
    tokenProgram,
    confirmOptions
  )

  const { cpSwapPoolState: cpSwapPoolState2 } = await initialize(
    program,
    owner,
    configAddress,
    NATIVE_MINT,
    TOKEN_PROGRAM_ID,
    token2,
    tokenProgram,
    confirmOptions
  )

  const { cpSwapPoolState: cpSwapPoolState3 } = await initialize(
    program,
    owner,
    configAddress,
    NATIVE_MINT,
    TOKEN_PROGRAM_ID,
    token3,
    tokenProgram,
    confirmOptions
  )

  const { cpSwapPoolState: cpSwapPoolState4 } = await initialize(
    program,
    owner,
    configAddress,
    NATIVE_MINT,
    TOKEN_PROGRAM_ID,
    token4,
    tokenProgram,
    confirmOptions
  )

  await deposit(
    program,
    owner,
    configAddress,
    NATIVE_MINT,
    TOKEN_PROGRAM_ID,
    token1,
    tokenProgram,
    new BN(10000000000),
    new BN(100000000000),
    new BN(100000000000),
    confirmOptions
  )

  await deposit(
    program,
    owner,
    configAddress,
    NATIVE_MINT,
    TOKEN_PROGRAM_ID,
    token2,
    tokenProgram,
    new BN(10000000000),
    new BN(100000000000),
    new BN(100000000000),
    confirmOptions
  )

  await deposit(
    program,
    owner,
    configAddress,
    NATIVE_MINT,
    TOKEN_PROGRAM_ID,
    token3,
    tokenProgram,
    new BN(10000000000),
    new BN(100000000000),
    new BN(100000000000),
    confirmOptions
  )

  await deposit(
    program,
    owner,
    configAddress,
    NATIVE_MINT,
    TOKEN_PROGRAM_ID,
    token4,
    tokenProgram,
    new BN(10000000000),
    new BN(100000000000),
    new BN(100000000000),
    confirmOptions
  )

  return [
    cpSwapPoolState1,
    cpSwapPoolState2,
    cpSwapPoolState3,
    cpSwapPoolState4,
  ]
}

export async function initialize(
  program: Program<CpSwapCpi>,
  creator: Signer,
  configAddress: PublicKey,
  token0: PublicKey,
  token0Program: PublicKey,
  token1: PublicKey,
  token1Program: PublicKey,
  confirmOptions?: ConfirmOptions,
  initAmount: { initAmount0: BN; initAmount1: BN } = {
    initAmount0: new BN(10000000000),
    initAmount1: new BN(20000000000),
  },
  createPoolFee = createPoolFeeReceive
) {
  const [auth] = await getAuthAddress(cpSwapProgram)
  const [poolAddress] = await getPoolAddress(
    configAddress,
    token0,
    token1,
    cpSwapProgram
  )
  const [lpMintAddress] = await getPoolLpMintAddress(poolAddress, cpSwapProgram)
  const [vault0] = await getPoolVaultAddress(poolAddress, token0, cpSwapProgram)
  const [vault1] = await getPoolVaultAddress(poolAddress, token1, cpSwapProgram)
  const [creatorLpTokenAddress] = await PublicKey.findProgramAddress(
    [
      creator.publicKey.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      lpMintAddress.toBuffer(),
    ],
    ASSOCIATED_PROGRAM_ID
  )

  const [observationAddress] = await getOrcleAccountAddress(
    poolAddress,
    cpSwapProgram
  )

  const creatorToken0 = getAssociatedTokenAddressSync(
    token0,
    creator.publicKey,
    false,
    token0Program
  )
  const creatorToken1 = getAssociatedTokenAddressSync(
    token1,
    creator.publicKey,
    false,
    token1Program
  )
  const tx = await program.methods
    .proxyInitialize(initAmount.initAmount0, initAmount.initAmount1, new BN(0))
    .accounts({
      cpSwapProgram: cpSwapProgram,
      creator: creator.publicKey,
      ammConfig: configAddress,
      authority: auth,
      poolState: poolAddress,
      token0Mint: token0,
      token1Mint: token1,
      lpMint: lpMintAddress,
      creatorToken0,
      creatorToken1,
      creatorLpToken: creatorLpTokenAddress,
      token0Vault: vault0,
      token1Vault: vault1,
      createPoolFee,
      observationState: observationAddress,
      tokenProgram: TOKEN_PROGRAM_ID,
      token0Program: token0Program,
      token1Program: token1Program,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .preInstructions([
      ComputeBudgetProgram.setComputeUnitLimit({ units: 400000 }),
    ])
    .rpc(confirmOptions)
  const accountInfo = await program.provider.connection.getAccountInfo(
    poolAddress
  )
  const poolState = CpmmPoolInfoLayout.decode(accountInfo.data)
  const cpSwapPoolState = {
    ammConfig: poolState.configId,
    token0Mint: poolState.mintA,
    token0Program: poolState.mintProgramA,
    token1Mint: poolState.mintB,
    token1Program: poolState.mintProgramB,
  }
  return { poolAddress, cpSwapPoolState, tx }
}

export async function deposit(
  program: Program<CpSwapCpi>,
  owner: Signer,
  configAddress: PublicKey,
  token0: PublicKey,
  token0Program: PublicKey,
  token1: PublicKey,
  token1Program: PublicKey,
  lp_token_amount: BN,
  maximum_token_0_amount: BN,
  maximum_token_1_amount: BN,
  confirmOptions?: ConfirmOptions
) {
  const [auth] = await getAuthAddress(cpSwapProgram)
  const [poolAddress] = await getPoolAddress(
    configAddress,
    token0,
    token1,
    cpSwapProgram
  )
  const [lpMintAddress] = await getPoolLpMintAddress(poolAddress, cpSwapProgram)
  const [vault0] = await getPoolVaultAddress(poolAddress, token0, cpSwapProgram)
  const [vault1] = await getPoolVaultAddress(poolAddress, token1, cpSwapProgram)
  const [ownerLpToken] = await PublicKey.findProgramAddress(
    [
      owner.publicKey.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      lpMintAddress.toBuffer(),
    ],
    ASSOCIATED_PROGRAM_ID
  )

  const onwerToken0 = getAssociatedTokenAddressSync(
    token0,
    owner.publicKey,
    false,
    token0Program
  )
  const onwerToken1 = getAssociatedTokenAddressSync(
    token1,
    owner.publicKey,
    false,
    token1Program
  )

  const tx = await program.methods
    .proxyDeposit(
      lp_token_amount,
      maximum_token_0_amount,
      maximum_token_1_amount
    )
    .accounts({
      cpSwapProgram: cpSwapProgram,
      owner: owner.publicKey,
      authority: auth,
      poolState: poolAddress,
      ownerLpToken,
      token0Account: onwerToken0,
      token1Account: onwerToken1,
      token0Vault: vault0,
      token1Vault: vault1,
      tokenProgram: TOKEN_PROGRAM_ID,
      tokenProgram2022: TOKEN_2022_PROGRAM_ID,
      vault0Mint: token0,
      vault1Mint: token1,
      lpMint: lpMintAddress,
    })
    .preInstructions([
      ComputeBudgetProgram.setComputeUnitLimit({ units: 400000 }),
    ])
    .rpc(confirmOptions)
  return tx
}

// export async function withdraw(
//   program: Program<CpSwapCpi>,
//   owner: Signer,
//   configAddress: PublicKey,
//   token0: PublicKey,
//   token0Program: PublicKey,
//   token1: PublicKey,
//   token1Program: PublicKey,
//   lp_token_amount: BN,
//   minimum_token_0_amount: BN,
//   minimum_token_1_amount: BN,
//   confirmOptions?: ConfirmOptions
// ) {
//   const [auth] = await getAuthAddress(cpSwapProgram)
//   const [poolAddress] = await getPoolAddress(
//     configAddress,
//     token0,
//     token1,
//     cpSwapProgram
//   )

//   const [lpMintAddress] = await getPoolLpMintAddress(poolAddress, cpSwapProgram)
//   const [vault0] = await getPoolVaultAddress(poolAddress, token0, cpSwapProgram)
//   const [vault1] = await getPoolVaultAddress(poolAddress, token1, cpSwapProgram)
//   const [ownerLpToken] = await PublicKey.findProgramAddress(
//     [
//       owner.publicKey.toBuffer(),
//       TOKEN_PROGRAM_ID.toBuffer(),
//       lpMintAddress.toBuffer(),
//     ],
//     ASSOCIATED_PROGRAM_ID
//   )

//   const onwerToken0 = getAssociatedTokenAddressSync(
//     token0,
//     owner.publicKey,
//     false,
//     token0Program
//   )
//   const onwerToken1 = getAssociatedTokenAddressSync(
//     token1,
//     owner.publicKey,
//     false,
//     token1Program
//   )

//   const tx = await program.methods
//     .proxyWithdraw(
//       lp_token_amount,
//       minimum_token_0_amount,
//       minimum_token_1_amount
//     )
//     .accounts({
//       cpSwapProgram: cpSwapProgram,
//       owner: owner.publicKey,
//       authority: auth,
//       poolState: poolAddress,
//       ownerLpToken,
//       token0Account: onwerToken0,
//       token1Account: onwerToken1,
//       token0Vault: vault0,
//       token1Vault: vault1,
//       tokenProgram: TOKEN_PROGRAM_ID,
//       tokenProgram2022: TOKEN_2022_PROGRAM_ID,
//       vault0Mint: token0,
//       vault1Mint: token1,
//       lpMint: lpMintAddress,
//       memoProgram: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
//     })
//     .preInstructions([
//       ComputeBudgetProgram.setComputeUnitLimit({ units: 400000 }),
//     ])
//     .rpc(confirmOptions)
//     .catch()

//   return tx
// }

// export async function swap_base_input(
//   program: Program<CpSwapCpi>,
//   owner: Signer,
//   configAddress: PublicKey,
//   inputToken: PublicKey,
//   inputTokenProgram: PublicKey,
//   outputToken: PublicKey,
//   outputTokenProgram: PublicKey,
//   amount_in: BN,
//   minimum_amount_out: BN,
//   confirmOptions?: ConfirmOptions
// ) {
//   const [auth] = await getAuthAddress(cpSwapProgram)
//   const [poolAddress] = await getPoolAddress(
//     configAddress,
//     inputToken,
//     outputToken,
//     cpSwapProgram
//   )

//   const [inputVault] = await getPoolVaultAddress(
//     poolAddress,
//     inputToken,
//     cpSwapProgram
//   )
//   const [outputVault] = await getPoolVaultAddress(
//     poolAddress,
//     outputToken,
//     cpSwapProgram
//   )

//   const inputTokenAccount = getAssociatedTokenAddressSync(
//     inputToken,
//     owner.publicKey,
//     false,
//     inputTokenProgram
//   )
//   const outputTokenAccount = getAssociatedTokenAddressSync(
//     outputToken,
//     owner.publicKey,
//     false,
//     outputTokenProgram
//   )
//   const [observationAddress] = await getOrcleAccountAddress(
//     poolAddress,
//     cpSwapProgram
//   )

//   const tx = await program.methods
//     .proxySwapBaseInput(amount_in, minimum_amount_out)
//     .accounts({
//       cpSwapProgram: cpSwapProgram,
//       payer: owner.publicKey,
//       authority: auth,
//       ammConfig: configAddress,
//       poolState: poolAddress,
//       inputTokenAccount,
//       outputTokenAccount,
//       inputVault,
//       outputVault,
//       inputTokenProgram: inputTokenProgram,
//       outputTokenProgram: outputTokenProgram,
//       inputTokenMint: inputToken,
//       outputTokenMint: outputToken,
//       observationState: observationAddress,
//     })
//     .preInstructions([
//       ComputeBudgetProgram.setComputeUnitLimit({ units: 400000 }),
//     ])
//     .rpc(confirmOptions)

//   return tx
// }

// export async function swap_base_output(
//   program: Program<CpSwapCpi>,
//   owner: Signer,
//   configAddress: PublicKey,
//   inputToken: PublicKey,
//   inputTokenProgram: PublicKey,
//   outputToken: PublicKey,
//   outputTokenProgram: PublicKey,
//   amount_out_less_fee: BN,
//   max_amount_in: BN,
//   confirmOptions?: ConfirmOptions
// ) {
//   const [auth] = await getAuthAddress(cpSwapProgram)
//   const [poolAddress] = await getPoolAddress(
//     configAddress,
//     inputToken,
//     outputToken,
//     cpSwapProgram
//   )

//   const [inputVault] = await getPoolVaultAddress(
//     poolAddress,
//     inputToken,
//     cpSwapProgram
//   )
//   const [outputVault] = await getPoolVaultAddress(
//     poolAddress,
//     outputToken,
//     cpSwapProgram
//   )

//   const inputTokenAccount = getAssociatedTokenAddressSync(
//     inputToken,
//     owner.publicKey,
//     false,
//     inputTokenProgram
//   )
//   const outputTokenAccount = getAssociatedTokenAddressSync(
//     outputToken,
//     owner.publicKey,
//     false,
//     outputTokenProgram
//   )
//   const [observationAddress] = await getOrcleAccountAddress(
//     poolAddress,
//     cpSwapProgram
//   )

//   const tx = await program.methods
//     .proxySwapBaseOutput(max_amount_in, amount_out_less_fee)
//     .accounts({
//       cpSwapProgram: cpSwapProgram,
//       payer: owner.publicKey,
//       authority: auth,
//       ammConfig: configAddress,
//       poolState: poolAddress,
//       inputTokenAccount,
//       outputTokenAccount,
//       inputVault,
//       outputVault,
//       inputTokenProgram: inputTokenProgram,
//       outputTokenProgram: outputTokenProgram,
//       inputTokenMint: inputToken,
//       outputTokenMint: outputToken,
//       observationState: observationAddress,
//     })
//     .preInstructions([
//       ComputeBudgetProgram.setComputeUnitLimit({ units: 400000 }),
//     ])
//     .rpc(confirmOptions)

//   return tx
// }

export async function multi_buy(
  program: Program<CpSwapCpi>,
  owner: Signer,
  configAddress: PublicKey,
  token1: PublicKey,
  token2: PublicKey,
  token3: PublicKey,
  token4: PublicKey,
  amount_in: BN,
  minimum_amount_out: BN,
  confirmOptions?: ConfirmOptions
) {
  const [auth] = await getAuthAddress(cpSwapProgram)

  const wsolAccount = getAssociatedTokenAddressSync(
    NATIVE_MINT,
    owner.publicKey,
    false,
    TOKEN_PROGRAM_ID
  )

  const [poolAddress2] = await getPoolAddress(
    configAddress,
    NATIVE_MINT,
    token2,
    cpSwapProgram
  )

  const [inputVault2] = await getPoolVaultAddress(
    poolAddress2,
    NATIVE_MINT,
    cpSwapProgram
  )
  const [outputVault2] = await getPoolVaultAddress(
    poolAddress2,
    token2,
    cpSwapProgram
  )

  const outputTokenAccount2 = getAssociatedTokenAddressSync(
    token2,
    owner.publicKey,
    false,
    TOKEN_PROGRAM_ID
  )
  const [observationAddress2] = await getOrcleAccountAddress(
    poolAddress2,
    cpSwapProgram
  )

  const [poolAddress1] = await getPoolAddress(
    configAddress,
    NATIVE_MINT,
    token1,
    cpSwapProgram
  )

  const [inputVault1] = await getPoolVaultAddress(
    poolAddress1,
    NATIVE_MINT,
    cpSwapProgram
  )
  const [outputVault1] = await getPoolVaultAddress(
    poolAddress1,
    token1,
    cpSwapProgram
  )

  const outputTokenAccount1 = getAssociatedTokenAddressSync(
    token1,
    owner.publicKey,
    false,
    TOKEN_PROGRAM_ID
  )
  const [observationAddress1] = await getOrcleAccountAddress(
    poolAddress1,
    cpSwapProgram
  )

  const [poolAddress3] = await getPoolAddress(
    configAddress,
    NATIVE_MINT,
    token3,
    cpSwapProgram
  )

  const [inputVault3] = await getPoolVaultAddress(
    poolAddress3,
    NATIVE_MINT,
    cpSwapProgram
  )
  const [outputVault3] = await getPoolVaultAddress(
    poolAddress3,
    token3,
    cpSwapProgram
  )

  const outputTokenAccount3 = getAssociatedTokenAddressSync(
    token3,
    owner.publicKey,
    false,
    TOKEN_PROGRAM_ID
  )
  const [observationAddress3] = await getOrcleAccountAddress(
    poolAddress3,
    cpSwapProgram
  )

  const [poolAddress4] = await getPoolAddress(
    configAddress,
    NATIVE_MINT,
    token4,
    cpSwapProgram
  )

  const [inputVault4] = await getPoolVaultAddress(
    poolAddress4,
    NATIVE_MINT,
    cpSwapProgram
  )
  const [outputVault4] = await getPoolVaultAddress(
    poolAddress4,
    token4,
    cpSwapProgram
  )

  const outputTokenAccount4 = getAssociatedTokenAddressSync(
    token4,
    owner.publicKey,
    false,
    TOKEN_PROGRAM_ID
  )
  const [observationAddress4] = await getOrcleAccountAddress(
    poolAddress4,
    cpSwapProgram
  )

  const lookupTableAddress = await createAddressLookupTable(
    program.provider.connection,
    owner,
    [
      cpSwapProgram,
      auth,
      feeWallet1,
      feeWallet2,
      feeWallet3,
      configAddress,
      poolAddress1,
      poolAddress2,
      poolAddress3,
      poolAddress4,
      inputVault1,
      inputVault2,
      inputVault3,
      inputVault4,
      outputVault1,
      outputVault2,
      outputVault3,
      outputVault4,
      observationAddress1,
      observationAddress2,
      observationAddress3,
      observationAddress4,
      token1,
      token2,
      token3,
      token4,
      NATIVE_MINT,
      TOKEN_PROGRAM_ID,
      SystemProgram.programId,
    ]
  )

  const lookupTableAccount = (
    await program.provider.connection.getAddressLookupTable(lookupTableAddress)
  ).value

  // loop through and parse all the addresses stored in the table
  for (let i = 0; i < lookupTableAccount.state.addresses.length; i++) {
    const address = lookupTableAccount.state.addresses[i]
    console.log(i, address.toBase58())
  }

  console.log(lookupTableAddress.toString())

  await sleep(5000)

  try {
    const ix = await program.methods
      .multiBuy(amount_in, minimum_amount_out)
      .accounts({
        cpSwapProgram: cpSwapProgram,
        payer: owner.publicKey,
        feeWallet1,
        feeWallet2,
        feeWallet3,
        authority: auth,
        ammConfig: configAddress,
        poolState1: poolAddress1,
        poolState2: poolAddress2,
        poolState3: poolAddress3,
        poolState4: poolAddress4,
        wsolAccount,
        outputTokenAccount1,
        outputTokenAccount2,
        outputTokenAccount3,
        outputTokenAccount4,
        inputVault1,
        inputVault2,
        inputVault3,
        inputVault4,
        outputVault1,
        outputVault2,
        outputVault3,
        outputVault4,
        tokenProgram: TOKEN_PROGRAM_ID,
        wsolMint: NATIVE_MINT,
        outputTokenMint1: token1,
        outputTokenMint2: token2,
        outputTokenMint3: token3,
        outputTokenMint4: token4,
        observationState1: observationAddress1,
        observationState2: observationAddress2,
        observationState3: observationAddress3,
        observationState4: observationAddress4,
        systemProgram: SystemProgram.programId,
      })
      .instruction()

    const recentBlockhash =
      await program.provider.connection.getLatestBlockhash('confirmed')

    const messageV0 = new TransactionMessage({
      payerKey: owner.publicKey,
      recentBlockhash: recentBlockhash.blockhash,
      instructions: [
        ComputeBudgetProgram.setComputeUnitLimit({ units: 1_000_000 }),
        ix,
      ],
    }).compileToV0Message([lookupTableAccount])
    const newTx = new VersionedTransaction(messageV0)
    newTx.sign([owner])
    const [latestBlockhash, signature] = await Promise.all([
      program.provider.connection.getLatestBlockhash('finalized'),
      program.provider.connection.sendTransaction(newTx),
    ])

    console.log('Initialize pool tx:', signature)
    await program.provider.connection.confirmTransaction(
      { signature, ...latestBlockhash },
      'confirmed'
    )
    return signature
  } catch (error) {
    console.log(error)
  }
}

export async function createAddressLookupTable(
  connection: Connection,
  payer: Signer,
  addresses: PublicKey[]
) {
  const slot = await connection.getSlot('finalized')

  const [lookupTableInst, lookupTableAddress] =
    AddressLookupTableProgram.createLookupTable({
      authority: payer.publicKey,
      payer: payer.publicKey,
      recentSlot: slot,
    })

  await sendAndConfirmTransaction(
    connection,
    new Transaction().add(lookupTableInst),
    [payer]
  )

  // extend 20 at one tx
  const splitAddresses = []
  for (let i = 0; i < addresses.length; i += 20) {
    splitAddresses.push(addresses.slice(i, i + 20))
  }

  for (const addressesChunk of splitAddresses) {
    const extendInstruction = AddressLookupTableProgram.extendLookupTable({
      payer: payer.publicKey,
      authority: payer.publicKey,
      lookupTable: lookupTableAddress,
      addresses: addressesChunk,
    })

    await sendAndConfirmTransaction(
      connection,
      new Transaction().add(extendInstruction),
      [payer]
    )
  }

  return lookupTableAddress
}
