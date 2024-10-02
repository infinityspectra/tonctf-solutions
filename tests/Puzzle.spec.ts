import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { toNano } from '@ton/core';
import { Puzzle } from '../wrappers/Puzzle';
import '@ton/test-utils';

describe('Puzzle', () => {
    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let puzzle: SandboxContract<Puzzle>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        puzzle = blockchain.openContract(await Puzzle.fromInit(0n));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await puzzle.send(
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
            to: puzzle.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and puzzle are ready to use
    });

    it('should solve', async () => {
        await puzzle.send(
            deployer.getSender(),
            {
                value: toNano('0.1'),
            },
            'Opeorate4',
        );

        await puzzle.send(
            deployer.getSender(),
            {
                value: toNano('0.1'),
            },
            'Opeorate4',
        );

        await puzzle.send(
            deployer.getSender(),
            {
                value: toNano('0.1'),
            },
            'Opeorate4',
        );

        await puzzle.send(
            deployer.getSender(),
            {
                value: toNano('0.1'),
            },
            'Opeorate4',
        );

        await puzzle.send(
            deployer.getSender(),
            {
                value: toNano('0.1'),
            },
            'Opeorate3',
        );

        await puzzle.send(
            deployer.getSender(),
            {
                value: toNano('0.1'),
            },
            'Opeorate3',
        );

        await puzzle.send(
            deployer.getSender(),
            {
                value: toNano('0.1'),
            },
            'Check',
        );

        expect(await puzzle.getIsSolved()).toBe(true);
    });
});
