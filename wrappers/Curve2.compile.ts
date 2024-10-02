import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/curve2.tact',
    options: {
        debug: true,
    },
};
