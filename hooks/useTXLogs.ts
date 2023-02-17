import { fetcher } from './fetcher'
import { httpOrHttps } from '../utils/is-dev'

export const useTXLogs = (
  apiPort: string
): { writeUnstakeLog: (data: string) => void; writeStakeLog: (data: string) => void } => {
  const writeStakeLog = async (data: string) => {
    try {
      await fetcher(`${httpOrHttps()}://${globalThis.window?.location.hostname}:${apiPort}/api/log/stake`, {
        method: 'POST',
        body: data,
      })
    } catch (e) {
      console.error(e)
    }
  }

  const writeUnstakeLog = async (data: string) => {
    try {
      await fetcher(`${httpOrHttps()}://${globalThis.window?.location.hostname}:${apiPort}/api/log/unstake`, {
        method: 'POST',
        body: data,
      })
    } catch (e) {
      console.error(e)
    }
  }

  return {
    writeUnstakeLog,
    writeStakeLog,
  }
}
