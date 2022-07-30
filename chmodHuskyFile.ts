// 当非win系统时 需要对 husky的文件加运行权限 chmod+x
import os from 'os'
import { exec } from 'child_process'

const platform = os.platform()
console.log(platform)

if (platform !== 'win32') {
  const bat = exec('chmod ugo+x .husky/* && chmod ugo+x .git/hooks/*')

  bat.stdout?.on('data', (data) => {
    console.log(data.toString())
  })

  bat.stderr?.on('data', (data) => {
    console.log(data.toString())
  })

  bat.on('exit', (code) => {
    console.log(`Child exited with code ${code}`)
  })
}
