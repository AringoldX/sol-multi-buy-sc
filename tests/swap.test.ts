import * as anchor from '@coral-xyz/anchor'
import { Program, BN } from '@coral-xyz/anchor'
import { MultiBuy } from '../target/types/multi_buy'
import {
  multi_buy,
  setupMultiBuyTest,
} from './utils'
import { configAddress } from './config'

describe('swap test', () => {
  anchor.setProvider(anchor.AnchorProvider.env())
  const owner = anchor.Wallet.local().payer

  const program = anchor.workspace.MultiBuy as Program<MultiBuy>

  const confirmOptions = {
    skipPreflight: true,
  }

  it('multi-buy ', async () => {
    const [
      cpSwapPoolState1,
      cpSwapPoolState2,
      cpSwapPoolState3,
      cpSwapPoolState4,
    ] = await setupMultiBuyTest(program, anchor.getProvider().connection, owner)

    try {
      const multiBuyTx = await multi_buy(
        program,
        owner,
        configAddress,
        cpSwapPoolState1.token1Mint,
        cpSwapPoolState2.token1Mint,
        cpSwapPoolState3.token1Mint,
        cpSwapPoolState4.token1Mint,
        new BN(100000000),
        new BN(0),
        confirmOptions
      )

      console.log('multiBuyTx:', multiBuyTx)
    } catch (error) {
      console.log(error)
    }
  })
})
