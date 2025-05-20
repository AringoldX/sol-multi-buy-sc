// Migrations are an early feature. Currently, they're nothing more than this
// single deploy script that's invoked from the CLI, injecting a provider
// configured from the workspace's Anchor.toml.

const anchor = require('@coral-xyz/anchor')
const IDL = require('../target/idl/multi_buy.json')
const {
  SystemProgram,
  PublicKey,
  AddressLookupTableProgram,
  sendAndConfirmTransaction,
  Transaction,
} = require('@solana/web3.js')
const { TOKEN_PROGRAM_ID, NATIVE_MINT } = require('@solana/spl-token')

const programId = 'CprucEGtqY3ntLcT31ag1RmhRQZ1AU4jMf4DMuYcimdH'
const confirmOptions = {
  skipPreflight: false,
}

async function createAddressLookupTable(connection, payer, addresses) {
  const slot = await connection.getSlot('finalized')

  const [lookupTableInst, lookupTableAddress] =
    AddressLookupTableProgram.createLookupTable({
      authority: payer.publicKey,
      payer: payer.publicKey,
      recentSlot: slot,
    })

  const tx = await sendAndConfirmTransaction(
    connection,
    new Transaction().add(lookupTableInst),
    [payer]
  )

  console.log('address lookup table create tx: ', tx)

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

    const tx = await sendAndConfirmTransaction(
      connection,
      new Transaction().add(extendInstruction),
      [payer]
    )
    console.log(`extend tx:`, tx)
  }

  return lookupTableAddress
}

const cpSwapProgram = 'CPMMoo8L3F4NbTegBCKVNunggL7H1ZpdTHKxQB5qKP1C'
const configAddress = 'D4FPEruKEHrG5TenZ2mpDGEfu1iUvTiqBxvpU8HLBvC2'
const feeWallet1 = '8Pu6QNnD8UnqXcaz3dYeXfNXfmaWoK6zbJZeUeaW1eAP'
const feeWallet2 = 'Cc4EeRYxVJrNkwsh599K2RJ1FUo8hwNUHmjtm25NHB5R'
const feeWallet3 = 'tgSKNq3Nc5k21dcVzWS3932A2jS65HxUobhLBdZT2XW'

const mints = [
  'C49Ut3om3QFTDrMZ5Cr8VcTKPpHDcQ2Fv8mmuJHHigDt', // AQUARIUS
  'GhFiFrExPY3proVF96oth1gESWA5QPQzdtb8cy8b1YZv', // ARIES
  'CmomKM8iPKRSMN7y1jqyW1QKj5bGoZmbvNZXWBJSUdnZ', // CANCER
  '3C2SN1FjzE9MiLFFVRp7Jhkp8Gjwpk29S2TCSJ2jkHn2', // CAPRICORN
  'ARiZfq6dK19uNqxWyRudhbM2MswLyYhVUHdndGkffdGc', // GEMINI
  '8Cd7wXoPb5Yt9cUGtmHNqAEmpMDrhfcVqnGbLC48b8Qm', // LEO
  '7Zt2KUh5mkpEpPGcNcFy51aGkh9Ycb5ELcqRH1n2GmAe', // LIBRA
  '3JsSsmGzjWDNe9XCw2L9vznC5JU9wSqQeB6ns5pAkPeE', // PISCES
  '8x17zMmVjJxqswjX4hNpxVPc7Tr5UabVJF3kv8TKq8Y3', // SAGIT
  'J4fQTRN13MKpXhVE74t99msKJLbrjegjEgLBnzEv2YH1', // SCORPIO
  'EjkkxYpfSwS6TAtKKuiJuNMMngYvumc1t1v9ZX1WJKMp', // TAURUS
  'Ez4bst5qu5uqX3AntYWUdafw9XvtFeJ3gugytKKbSJso', // VIRGO
]

const poolAddresses = [
  '7mP6WeVYBNt3eao5szsMPmuHughHjNRx26TcrgJXZRky', // SAGIT
  'DaTEcH6da4i1evZU37F9ibQirYXhLKZpKDzDno346nSW', // CANCER
  '3d2KYuMgj2yotNC6SKX4HNoeSWp4n8zqZSQ9kFH81Yta', // SCORPIO
  '48ErBGMqiZekyLoCcebd7cS5KNQPzqr7QQAK9mzAPQGQ', // LEO
  'BygCEAhCNyWC8Co9yPa4K84NGkgkgMWdib2FG5hhuiUv', // AQUARIUS
  '549aknNCvxbiqmikS6sAnY6Dbg37MeENWn6ZFBfc7sin', // CAPRICORN
  'HRn98YLGigP475eS1GaQYRMbqk1V4dkV6tdKyLhVh2iS', // ARIES
  'HxhdKrB1UpSwfuMoZMVzPVELzbPWHdyN6PHU9CBFium9', // GEMINI
  '5WcVjf8fzPkHaZqTSZDdbDFL6p2bLbAgEigxpevNrcRh', // VIRGO
  '2GNtxia4fLW3URj5MLqVfgoKrAgDpphtAVazK41eTPfu', // TAURUS
  'DTXPQjK4ae4h2Wc7D5Rpij8YmSQxqLuTcNKrpBCjcAN9', // LIBRA
  'Fzz8QrSV8sPKsTtHocwYARE8Zo6Rd4Wv2Ee4JtCuiDko', // PISCES
]

const inputVaults = [
  'EUrEMKZqT4qcZF1dyrX4fsagtPKz3i6UfZAgZXx8ZBjG',
  'GNzWN9FEJSr4PKvwbKeekC56G9RwNGTpS94tiUnWhqR8',
  'BCr1o723StHmH8dCiE7J9vbC97R58u1PzWMruWHqiJ8x',
  '3gg2X2RTiDzyZwQtsV2MvkXAWmYyCRqeS29N7TcbMH9S',
  '3cdxmpWsqNJEub2aEDKbrVakvVEKZiEqVNZmG5H85aKv',
  '84k3t7K884wLQ2b13NoTpjg2AMhTaLctmQ6L7QXH3ZTV',
  '3qfDWEmRWzxbrRjh9pSic2Sagr8fX9TEwqfAomaknZeT',
  '4o9fkPHRg4DE9LNJXuTApFrDRWUdzoSrmGpSBRNxwBZ1',
  'CVd6Bow7LT6rmbsErjf63wYh4cmBP1cKH4Aie9uPizrg',
  'GdHgdZnzfQEMh3B3ZBN9goWY2Szs6R2ugQtttpaftDEE',
  '5c9tFNmVm1CJXFX1P656BDRNiA7cudTAWr3TLCewVjRs',
  '3VwhYudZxBoPTPd1LavYEgR6tyZzFs35JSWnqxmotscb',
]

const outputVaults = [
  'GW4fXsGL23CQVEDEZzuEfP345vUaFVaSDKfQ3T19C9iu',
  'CNq52d5PpfPxijxnurciMHwpLfx99d4kywcyrpGp3bC6',
  'HjTiVU5MvUvU3mfvw5cdhFYLCVP1ziGWXQCyDZXMmfjL',
  '9ctF724BbsBhhWgQEjc2FSsnr6rVr3xt6BHjAdtcfXUQ',
  'ANKt9KdTGEBh7cKkNXZ3bEY8jbGf3okKDVQdqtNzjTLf',
  '5RozzoAYFYbpTeHAobYkAEoHjFZVMWuCqQXocwzy4Gpv',
  'D2AiNgk4KQpSBniJUdNGvPfugNyb8skxbceBQhfBFrwC',
  'EcupQonSDy1vU9CDff6iY5juQh3BF48AD1pQpYs8aCXs',
  '4tHZ5Hz1ZPEM4Hd77Mp3193sLmAkmY4UacyRrPGCCAMV',
  'RRxDeoEL3vL2t5ThBAqsGdtTRriThQnc9NWvqQPMXHN',
  'YVMG67tcP58s6zHbBtmcCABmEZVtWpQ6eMHrXbH9L7c',
  '2KUn9V7A7NNzioAAq8gZ5dh7RSR78u3vukayux6Kqr1T',
]

const observationAddresses = [
  '29hyt21VaZ97qYszkhxQeckVtFTwFeoNY2xx8CNCY7M3',
  'ERdxuuBmNd29Bz7dohjBPsZZi3zZ7ikCD58gHD9fyWJL',
  'GjCNPkX2gna9AkdoU6YKjycki8PEpUjknW2ji2ZPuMCT',
  '6soyBijjXZ976zUvtUw8madvUXPfs5fqWLcyNQqqwxMu',
  '91yv52dMpunUHx5SUKcn25wpgHZT25gmvNNNvqvZh6FB',
  'GSkeR54HsTB4mr3QrTuKbo5RAvGoBT4LqYCab4byLVKB',
  '5YfMKSfiDWXj37dHruwVCvHcCjnSoMQfTSBwY15QbHWJ',
  '5aeRLCzetoc7WV1nxJnzYmhMN17dLjzCop7kAFdimuzx',
  'Haxuqp3cXopmek3o4UZdUT19TQ488DaDzS13oVxUEiCh',
  '39Eso6DPchr4LKTn9pPAyHpfcmnnNic1eXcFFYZ9w7ee',
  '8kaECuafU3cVXjz1ptFRwsbBMZRzc6qc5euh5woy338',
  'AAoxBZ68VE5k42Pyqczs5raWHN5Jh4uL7QimBtPJRnoq',
]

const addresses = [
  cpSwapProgram,
  configAddress,
  feeWallet1,
  feeWallet2,
  feeWallet3,
  SystemProgram.programId,
  TOKEN_PROGRAM_ID,
  NATIVE_MINT,
  programId,
  ...mints,
  ...poolAddresses,
  ...inputVaults,
  ...outputVaults,
  ...observationAddresses,
].map((addr) => new PublicKey(addr))

module.exports = async function (provider) {
  // Configure client to use the provider.
  anchor.setProvider(provider)

  const owner = anchor.Wallet.local().payer
  console.log(owner.publicKey.toString())

  const lookupTableAddress = await createAddressLookupTable(
    provider.connection,
    owner,
    addresses
  )

  console.log('lookuptableaddress:', lookupTableAddress.toString())

  const lookupTableAccount = (
    await provider.connection.getAddressLookupTable(lookupTableAddress)
  ).value

  // loop through and parse all the addresses stored in the table
  for (let i = 0; i < lookupTableAccount.state.addresses.length; i++) {
    const address = lookupTableAccount.state.addresses[i]
    console.log(i, address.toBase58())
  }
  // Add your deploy script here.
}
