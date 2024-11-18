import { getStatus, hasChange, updateStatus } from './status'
import { PullRequestContext } from './types'

export async function run(context: PullRequestContext) {
  try {
    const nextState = await getStatus(context)
    context.log.info(`[wip] Next status: ${JSON.stringify(nextState)}`)

    const changed = await hasChange(context, nextState)
    context.log.info(`[wip] Status changed: ${changed}`)

    if (changed) {
      await updateStatus(context, nextState)
      context.log.info(
        nextState.wip ? '[wip] work in progress' : '[wip] ready for review',
      )
    } else {
      context.log.info('[wip] status not changed')
    }
  } catch (error) {
    context.log.error(`[wip] ${error.message}`)
  }
}
