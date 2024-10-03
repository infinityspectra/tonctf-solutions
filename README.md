# TonCTF Solutions

## TonCTF Challenges

Check https://ctf.tonbit.xyz/ and https://github.com/TonBitSec/TonCTF-Challenges for more details and challenges.

## How it works

Unlike submitting solution to the TonBit official website and interacting with a privately deployed blockchain, all solutions here are demonstrated through local tests. Some contracts have been slightly modified to aid in debugging.

## Status

- [x] Airdrop
- [x] Dex
- [x] Puzzle
- [x] Random
- [x] Merkle Airdrop
- [ ] Curve
- [ ] Curve2
- [ ] Curve3

## Project structure

-   `contracts` - source code of all the smart contracts of the project and their dependencies.
-   `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
-   `tests` - tests for the contracts.
-   `scripts` - scripts used by the project, mainly the deployment scripts.

## How to use

### Build

`npx blueprint build` or `yarn blueprint build`

### Test

`npx blueprint test` or `yarn blueprint test`

### Deploy or run another script

`npx blueprint run` or `yarn blueprint run`

### Add a new contract

`npx blueprint create ContractName` or `yarn blueprint create ContractName`
