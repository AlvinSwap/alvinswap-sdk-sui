import { Tick } from "./entities";
import { TickDataProvider } from "./entities/tickDataProvider";
import { SimpleTickState } from "./stateFetcher";
import { BigintIsh } from '@uniswap/sdk-core';
export declare class SimpleTickDataProvider implements TickDataProvider {
    ticks: Tick[];
    static fromSimpleTickStates(tickStates: SimpleTickState[]): SimpleTickDataProvider;
    getTick(_tick: number): Promise<{
        liquidityNet: BigintIsh;
    }>;
    nextInitializedTickWithinOneWord(tick: number, lte: boolean, tickSpacing: number): Promise<[number, boolean]>;
}
