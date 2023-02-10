import { Tick } from "./entities"
import { TickDataProvider } from "./entities/tickDataProvider"
import { SimpleTickState, StateFetcher } from "./stateFetcher"
import { BigintIsh } from '@uniswap/sdk-core'
import { TickList } from "./utils"

export class SimpleTickDataProvider implements TickDataProvider {
  public ticks: Tick[] = []

  public static fromSimpleTickStates(tickStates: SimpleTickState[]) {
    const is = new SimpleTickDataProvider()
    is.ticks = StateFetcher.simpleStatetoTicks(StateFetcher.sortSimpleTicks(tickStates))
    return is
  }
  
  public async getTick(_tick: number): Promise<{ liquidityNet: BigintIsh }> {
    const tick = this.ticks.find(t => t.index == _tick)
    if (tick === undefined) {
        return { liquidityNet: 0 }
    }
    return { liquidityNet: tick.liquidityNet }
  }

  async nextInitializedTickWithinOneWord(
    tick: number,
    lte: boolean,
    tickSpacing: number
  ): Promise<[number, boolean]> {
    return TickList.nextInitializedTickWithinOneWord(this.ticks, tick, lte, tickSpacing)
  }
}
