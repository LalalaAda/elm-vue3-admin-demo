import fs, { writeFileSync } from 'fs-extra'
import colors from 'picocolors'

import { getEnvConfig, getRootPath } from './utils'
import { EXPOSE_CONFIG_FILE_NAME, OUTPUT_DIR } from './constant'
import pkg from '../package.json'

interface CreateConfigParams {
  configName: string
  config: any
  outputFileName?: string
}

function createConfig(params: CreateConfigParams) {
  const { configName, config, outputFileName } = params
  try {
    const windowConf = `window.${configName}`
    const configStr = `${windowConf}=${JSON.stringify(config)};
      Object.freeze(${windowConf});
      Object.defineProperty(window, "${configName}", {
        configurable: false,
        writable: false
      });
    `.replace(/\s/g, '')
    fs.mkdirp(getRootPath(OUTPUT_DIR))
    writeFileSync(getRootPath(`${OUTPUT_DIR}/${outputFileName}`), configStr)
    console.log(colors.cyan(`🚩 [${pkg.name}]`) + ` - configuration file is build successfully:`)
    console.log(colors.gray(OUTPUT_DIR + '/' + colors.green(outputFileName)) + '\n')
  } catch (error) {
    console.log(colors.red('configuration file build failed: \n' + error))
  }
}

export function runBuildConfig() {
  const config = getEnvConfig()
  const configVarName = (config as Recordable).VITE_GLOBAL_APP_ENV_EXPOSE_VARIABLE_NAME
  createConfig({ config, configName: configVarName, outputFileName: EXPOSE_CONFIG_FILE_NAME })
}

export const runBuild = async () => {
  try {
    const argvList = process.argv.splice(2)
    if (!argvList.includes('disabled-config')) {
      return runBuildConfig()
    }
    console.log(`✨ ${colors.cyan(`[${pkg.name}]`)}` + ' - build successfully!')
  } catch (error) {
    console.log(colors.red('vite build error:\n' + error))
    process.exit(1)
  }
}
runBuild()
