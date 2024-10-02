import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { beginCell, toNano } from '@ton/core';
import { Random } from '../wrappers/Random';
import '@ton/test-utils';

describe('Random', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let random: SandboxContract<Random>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        blockchain.now = 10;

        random = blockchain.openContract(await Random.fromInit(0n));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await random.send(
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
            to: random.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and curve are ready to use
    });

    it('should solve', async () => {
        let cell = beginCell()
            .storeAddress(random.address)
            .storeAddress(deployer.address)
            .storeUint(blockchain.now!, 64)
            .endCell();
        let verify = cell.hash();
        let hashStr = '0x' + verify.toString('hex');
        let numericHash = BigInt(hashStr);
        let key = numericHash % 100n;
        console.log('now:', blockchain.now);
        console.log('hashStr: ', hashStr);
        console.log('hashNum: ', numericHash);
        console.log('key: ', key);

        await random.send(deployer.getSender(), { value: toNano('0.1') }, { $$type: 'DrawNFT', luckynumber: key });

        expect(await random.getIsSolved()).toBe(true);
    });
});
