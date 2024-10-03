import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano, fromNano } from '@ton/core';
import { Dex } from '../wrappers/Dex';
import '@ton/test-utils';

import { simulate } from '../scripts/simulateDex';

describe('Dex', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let dex: SandboxContract<Dex>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        dex = blockchain.openContract(await Dex.fromInit(0n));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await dex.send(
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
            to: dex.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and dex are ready to use
    });

    it('should solve', async () => {
        let beforeContractBalance = fromNano(await dex.getContractBalance());
        await dex.send(
            deployer.getSender(),
            {
                value: toNano('0.1'),
            },
            'CreateUser',
        );

        let positiveDeltaSwaps = simulate();

        for (let swap of positiveDeltaSwaps) {
            await dex.send(
                deployer.getSender(),
                {
                    value: toNano('0.2'),
                },
                {
                    $$type: 'Swap',
                    amount: BigInt(swap.amount),
                    a_b: BigInt(swap.firstDirection),
                },
            );

            await dex.send(
                deployer.getSender(),
                {
                    value: toNano('0.2'),
                },
                {
                    $$type: 'Swap',
                    amount: BigInt(swap.amount),
                    a_b: BigInt(swap.secondDirection),
                },
            );
        }

        let sum = await dex.getUserBalanceSum();
        console.log('Balance Sum: ', sum);

        expect(await dex.getIsUnlocked()).toBe(true);

        let afterContractBalance = fromNano(await dex.getContractBalance());

        console.log(`Before: ${beforeContractBalance}, After: ${afterContractBalance}`);

        let withdrawAmount = toNano(0.4) * BigInt(positiveDeltaSwaps.length);

        await dex.send(
            deployer.getSender(),
            {
                value: toNano('2'), // increase myBalance()
            },
            {
                $$type: 'Withdraw',
                value: withdrawAmount,
            },
        );

        expect(await dex.getLowBalance()).toBe(true);

        await dex.send(
            deployer.getSender(),
            {
                value: toNano('0.1'),
            },
            'Solve',
        );

        expect(await dex.getIsSolved()).toBe(true);
    });
});
