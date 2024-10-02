import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/airdrop.tact',
    options: {
        debug: true,
    },
};
