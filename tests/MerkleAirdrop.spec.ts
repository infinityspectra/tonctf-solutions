import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { MerkleAirdrop } from '../wrappers/MerkleAirdrop';
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
        expect(await merkleAirdrop.getIsSolved()).toBe(true);
    });
});
