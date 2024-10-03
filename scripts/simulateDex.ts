class Dex {
    solved: boolean;
    lock: boolean;
    tokenaAmount: number;
    tokenbAmount: number;
    userBalances: Map<number, number>;
    userCreated: boolean;

    constructor() {
        this.solved = false;
        this.lock = true;
        this.tokenaAmount = 10;
        this.tokenbAmount = 10;
        this.userBalances = new Map<number, number>([
            [1, 10], // User A balance
            [2, 0], // User B balance
        ]);
        this.userCreated = false;
    }

    createUser(): void {
        if (this.userCreated) {
            throw new Error('User already created');
        }
        this.userBalances.set(1, 10);
        this.userBalances.set(2, 0);
        this.userCreated = true;
    }

    swap(amount: number, a_b: number): void {
        if (!this.userCreated) {
            throw new Error('User not created');
        }

        let x = this.tokenaAmount;
        let y = this.tokenbAmount;
        let userA = this.userBalances.get(1)!; // User A balance
        let userB = this.userBalances.get(2)!; // User B balance

        if (a_b === 1) {
            if (userA < amount) {
                throw new Error('Insufficient balance in A');
            }
            let outAmount = y - Math.floor((x * y) / (x + amount)); // 向下取整
            this.userBalances.set(1, userA - amount);
            this.userBalances.set(2, userB + outAmount);
            this.tokenaAmount = x + amount;
            this.tokenbAmount = y - outAmount;
            // console.log(`(a->b) in: ${amount}, Out: ${outAmount}`);
            // console.log(
            //     `Dex: ${this.tokenaAmount}, ${this.tokenbAmount}, User: ${this.userBalances.get(1)}, ${this.userBalances.get(2)}`,
            // );
        } else {
            if (userB < amount) {
                throw new Error('Insufficient balance in B');
            }
            let outAmount = x - Math.floor((x * y) / (y + amount)); // 向下取整
            this.userBalances.set(1, userA + outAmount);
            this.userBalances.set(2, userB - amount);
            this.tokenaAmount = x - outAmount;
            this.tokenbAmount = y + amount;
            // console.log(`(b->a) in: ${amount}, Out: ${outAmount}`);
            // console.log(
            //     `Dex: ${this.tokenaAmount}, ${this.tokenbAmount}, User: ${this.userBalances.get(1)}, ${this.userBalances.get(2)}`,
            // );
        }

        // 检查是否解锁
        if (this.userBalances.get(1)! + this.userBalances.get(2)! === 29) {
            this.lock = false;
        }
    }

    getBalances(): number {
        // console.log(`User A Balance: ${this.userBalances.get(1)}`);
        // console.log(`User B Balance: ${this.userBalances.get(2)}`);
        // console.log(`Dex A Amount: ${this.tokenaAmount}`);
        // console.log(`Dex B Amount: ${this.tokenbAmount}`);
        // console.log(`Lock: ${this.lock}`);
        return this.userBalances.get(1)! + this.userBalances.get(2)!;
    }
}

function swingSwap(
    dex: Dex,
    amount: number,
    firstDirection: number,
    secondDirection: number,
    currentBalance: number,
    targetBalance: number,
    positiveDeltaSwaps: Array<{
        amount: number;
        firstDirection: number;
        secondDirection: number;
    }>,
): { success: boolean; currentBalance: number; amount: number } {
    try {
        dex.swap(amount, firstDirection);
    } catch (e) {
        if (e instanceof Error) {
            console.error(`Swap ${firstDirection === 1 ? 'a->b' : 'b->a'} failed: ${e.message}`);
        } else {
            console.error(`Swap ${firstDirection === 1 ? 'a->b' : 'b->a'} failed: An unknown error occurred`);
        }
        return { success: false, currentBalance, amount }; // Stop when error happens
    }

    try {
        dex.swap(amount, secondDirection);
        let newBalance = dex.getBalances();
        if (newBalance > currentBalance) {
            // console.log(`Delta: ${newBalance - currentBalance}, Current balance sum: ${newBalance}`);
            positiveDeltaSwaps.push({ amount, firstDirection, secondDirection });
            amount = 0; // reset amount
        }
        currentBalance = newBalance;
        if (currentBalance >= targetBalance) return { success: true, currentBalance, amount };
    } catch (e) {
        if (e instanceof Error) {
            console.error(`Swap ${secondDirection === 1 ? 'a->b' : 'b->a'} failed: ${e.message}`);
        } else {
            console.error(`Swap ${secondDirection === 1 ? 'a->b' : 'b->a'} failed: An unknown error occurred`);
        }
        return { success: false, currentBalance, amount }; // Stop when error happens
    }

    // console.log(`\n`);
    return { success: true, currentBalance, amount };
}

export function simulate() {
    const dex = new Dex();
    dex.createUser();

    let targetBalance = 29;
    let currentBalance = dex.getBalances();
    let amount = 1;
    let maxTry = 1000;

    let positiveDeltaSwaps: Array<{
        amount: number;
        firstDirection: number;
        secondDirection: number;
    }> = [];

    while (currentBalance < targetBalance && maxTry > 0) {
        let dexABalance = dex.tokenaAmount;
        let dexBBalance = dex.tokenbAmount;
        let userABalance = dex.userBalances.get(1)!;
        let userBBalance = dex.userBalances.get(2)!;
        // console.log(`Dex: ${dexABalance}, ${dexBBalance}, User: ${userABalance}, ${userBBalance}`);

        let result;
        if (dexABalance === dexBBalance) {
            if (userABalance > userBBalance) {
                result = swingSwap(dex, amount, 1, 0, currentBalance, targetBalance, positiveDeltaSwaps);
            } else {
                result = swingSwap(dex, amount, 0, 1, currentBalance, targetBalance, positiveDeltaSwaps);
            }
        } else if (dexABalance > dexBBalance) {
            if (amount <= userBBalance) {
                result = swingSwap(dex, amount, 0, 1, currentBalance, targetBalance, positiveDeltaSwaps);
            } else {
                result = swingSwap(dex, amount, 1, 0, currentBalance, targetBalance, positiveDeltaSwaps);
            }
        } else {
            if (amount <= userABalance) {
                result = swingSwap(dex, amount, 1, 0, currentBalance, targetBalance, positiveDeltaSwaps);
            } else {
                result = swingSwap(dex, amount, 0, 1, currentBalance, targetBalance, positiveDeltaSwaps);
            }
        }

        if (!result.success) break;
        currentBalance = result.currentBalance;
        amount = result.amount;
        amount++;
        maxTry--;
    }

    // console.log('Positive Delta Swaps:', positiveDeltaSwaps);

    return positiveDeltaSwaps;
}

// simulate();
