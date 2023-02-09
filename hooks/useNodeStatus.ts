import useSWR from 'swr'
import { fetcher } from './fetcher';
import { NodeStatus } from '../model/node-status';
import { httpOrHttps } from '../utils/is-dev';
import { useState } from 'react';

export const useNodeStatus = (apiPort: string): { nodeStatus: NodeStatus, startNode: () => void, stopNode: () => void, isLoading: boolean } => {
  const {data} = useSWR(`${httpOrHttps()}://${globalThis.window?.location.hostname}:${apiPort}/api/node/status`, fetcher, {refreshInterval: 1000})
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const startNode = async () => {
    setIsLoading(true)
    try {
      await fetcher(`${httpOrHttps()}://${globalThis.window?.location.hostname}:${apiPort}/api/node/start`, {method: 'POST'})
    } catch (e) {
      console.error(e)
    }
    setIsLoading(false)
  }

  const stopNode = async () => {
    setIsLoading(true)
    try {
      await fetcher(`${httpOrHttps()}://${globalThis.window?.location.hostname}:${apiPort}/api/node/stop`, {method: 'POST'})
    } catch (e) {
      console.error(e)
    }
    setIsLoading(false)
  }

  return {
    nodeStatus: data,
    startNode,
    stopNode,
    isLoading
  }
};
