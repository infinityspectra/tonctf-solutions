import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano, Address, Dictionary } from '@ton/core';
import { Claim, MerkleAirdrop, Stake } from '../wrappers/MerkleAirdrop';
import { createHash } from 'crypto';
import '@ton/test-utils';

describe('MerkleAirdrop', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let merkleAirdrop: SandboxContract<MerkleAirdrop>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        merkleAirdrop = blockchain.openContract(await MerkleAirdrop.fromInit());

        deployer = await blockchain.treasury('deployer');

        const deployResult = await merkleAirdrop.send(
            deployer.getSender(),
            {
                value: toNano('1'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: merkleAirdrop.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and merkleAirdrop are ready to use
    });

    it('should solve', async () => {
        let sha256 = (data: string): bigint => {
            return BigInt('0x' + createHash('sha256').update(data).digest('hex'));
        };

        let calculateMerkleRoot = (leaf: bigint, nodes: Map<number, bigint>): [bigint, bigint] => {
            let abs = 0n;
            for (let i = 0; i < nodes.size; i++) {
                const node = nodes.get(i);
                if (node !== undefined) {
                    abs = leaf > node ? leaf - node : node - leaf;
                    leaf = sha256(abs.toString());
                }
            }
            return [abs, leaf];
        };

        const addrStr = 'EQDaypwc_Jr8by-alaK4mntRu35_EhlMz60AOeSJRawcrNM0';
        const amountStr = '614';
        const seed = addrStr + amountStr;
        let leaf = sha256(seed);

        const nodes: Map<number, bigint> = new Map([
            [0, BigInt('3276839473039418448246626220846442448842246862622804046064860066224006800084')],
            [1, BigInt('47247882347545520880400048062206626448448620004800866600228646060442282848824')],
            [2, BigInt('17983245880419772846408460262448682866408688862244064640442682866626888428288')],
        ]);

        let [lastAbs, root] = calculateMerkleRoot(leaf, nodes);
        let fakeAmountStr = '10000';
        let fakeLeaf = sha256(addrStr + fakeAmountStr);
        nodes.delete(2);
        let [abs2, node2] = calculateMerkleRoot(fakeLeaf, nodes);
        let newNode3 = node2 - lastAbs;
        nodes.set(2, newNode3);
        let [lastAbs2, root2] = calculateMerkleRoot(fakeLeaf, nodes);
        console.log('root', root);
        console.log('root2', root2);

        let proofs = Dictionary.empty<bigint, bigint>();
        proofs.set(0n, nodes.get(0)!);
        proofs.set(1n, nodes.get(1)!);
        proofs.set(2n, nodes.get(2)!);

        // // Expect input
        // let claim: Claim = {
        //     $$type: 'Claim',
        //     recipient: Address.parse(addrStr),
        //     proofLength: 3n,
        //     amount: 614n,
        //     proofs: proofs,
        // };

        let fakeClaim: Claim = {
            $$type: 'Claim',
            recipient: Address.parse('EQDaypwc_Jr8by-alaK4mntRu35_EhlMz60AOeSJRawcrNM0'),
            proofLength: 3n,
            amount: 10000n,
            proofs: proofs,
        };

        await merkleAirdrop.send(
            deployer.getSender(),
            {
                value: toNano(0.2),
            },
            fakeClaim,
        );

        expect(await merkleAirdrop.getIsSolved()).toBe(true);
    });
});
