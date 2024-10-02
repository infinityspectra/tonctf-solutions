import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { beginCell, toNano } from '@ton/core';
import { AirDrop } from '../wrappers/Airdrop';
import '@ton/test-utils';

describe('Airdrop', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let airdrop: SandboxContract<AirDrop>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        airdrop = blockchain.openContract(await AirDrop.fromInit(0n));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await airdrop.send(
            deployer.getSender(),
            {
                value: toNano('0.05'),
            },
            {
                $$type: 'Deploy',
                queryId: 0n,
            },
        );

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: airdrop.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and curve are ready to use
    });

    it('should solve', async () => {
        await airdrop.send(
            deployer.getSender(),
            {
                value: toNano('0.1'),
            },
            {
                $$type: 'UserStake',
                amount: BigInt(-30000),
            },
        );
        expect(await airdrop.getIsSolved()).toBe(true);
    });
});
