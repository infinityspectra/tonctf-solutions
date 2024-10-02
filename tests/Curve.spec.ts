import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Curve } from '../wrappers/Curve';
import '@ton/test-utils';

describe('Curve', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let curve: SandboxContract<Curve>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        curve = blockchain.openContract(await Curve.fromInit(0n));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await curve.send(
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
            to: curve.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and curve are ready to use

        const checkResult = await curve.getCheck(BigInt(2));
        console.log('CheckResult: ', checkResult);
    });

    it('should solve', async () => {
        await curve.send(
            deployer.getSender(),
            {
                value: toNano('1'),
            },
            {
                $$type: 'Key',
                k: 2n,
            },
        );

        expect(await curve.getIsSolved()).toBe(true);
    });
});
