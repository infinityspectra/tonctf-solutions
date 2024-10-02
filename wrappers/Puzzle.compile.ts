import { CompilerConfig } from '@ton/blueprint';

export const compile: CompilerConfig = {
    lang: 'tact',
    target: 'contracts/puzzle.tact',
    options: {
        debug: true,
    },
};
