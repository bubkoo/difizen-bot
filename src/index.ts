import { Probot } from 'probot'
import wip from './wip'

export = async (app: Probot) => {
  // eslint-disable-next-line prettier/prettier
  app.onAny(async (context) => {
    // eslint-disable-next-line no-console
    console.log(`\n>>>> event: ${context.name}`)
  })

  wip(app)
}
