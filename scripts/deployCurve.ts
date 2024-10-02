import { toNano } from '@ton/core';
import { Curve } from '../wrappers/Curve';
import { NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const curve = provider.open(await Curve.fromInit(BigInt(Math.floor(Math.random() * 10000))));

    await curve.send(
        provider.sender(),
        {
            value: toNano('0.05'),
        },
        {
            $$type: 'Deploy',
            queryId: 0n,
        },
    );

    await provider.waitForDeploy(curve.address);

    console.log('ID', await curve.getId());
}
