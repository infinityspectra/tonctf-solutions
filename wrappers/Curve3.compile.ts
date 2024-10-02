import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/curve3.tact',
    options: {
        debug: true,
    },
};
