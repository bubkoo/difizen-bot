import { load as loadYaml } from 'js-yaml'
import { PullRequestContext, Section } from './types'
import { getFileContent } from './util'

export const defaults: Section = {
  locations: ['title', 'label'],
  terms: ['wip', 'work in progress', '🚧'],
}

const configurationPath = './.github/apps/wip.yml'

export async function getConfig(context: PullRequestContext) {
  try {
    const content = await getFileContent(context, configurationPath)
    if (content) {
      const config = loadYaml(content) as Section | Section[]
      if (config) {
        const configs = Array.isArray(config) ? config : [config]
        const keys: (keyof Section)[] = ['terms', 'locations']
        // eslint-disable-next-line prettier/prettier
        configs.forEach((entry) => {
          // eslint-disable-next-line prettier/prettier
          keys.forEach((key) => {
            if (!entry[key]) {
              entry[key] = defaults[key] as any
            } else {
              if (!Array.isArray(entry[key])) {
                entry[key] = [entry[key] as any]
              }

              entry[key] = (entry[key] as any).map((item: any) => `${item}`)
            }
          })
        })

        context.log.info(
          `[wip] Use manual configuration: ${JSON.stringify([configs])}`,
        )

        return {
          configs,
          manual: true,
        }
      }
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (err) {
    // pass
  }

  context.log.info(
    `[wip] Use default configuration: ${JSON.stringify([defaults])}`,
  )

  return {
    configs: [defaults],
  }
}
