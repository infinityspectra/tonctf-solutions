import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Curve3 } from '../wrappers/Curve3';
import '@ton/test-utils';

describe('Curve3', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let curve: SandboxContract<Curve3>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        curve = blockchain.openContract(await Curve3.fromInit(0n));

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

        const checkResult = await curve.getCheck(BigInt(1));
        console.log('CheckResult: ', checkResult);
    });

    it('should solve', async () => {
        expect(await curve.getIsSolved()).toBe(true);
    });
});
