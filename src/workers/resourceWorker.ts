import { expose } from 'comlink'
import { IResourceProps } from './Resource'

class ResourceWorker {
  _resource: IResourceProps
  _payload: string

  constructor(resource: IResourceProps, payload: string) {
    this._resource = resource
    this._payload = payload
  }

  async handleCall() {
    console.log('Handling request...')

    const reqTime = await this.delay()
    const response = this.generateResponse(reqTime)

    return response
  }

  async delay(): Promise<number> {
    const sleep = Math.round(
      Math.random() * (this._resource.maxLatency - this._resource.minLatency) +
        this._resource.minLatency
    )

    return new Promise((res) => {
      setTimeout(() => {
        res(sleep / 1000)
      }, sleep)
    })
  }

  generateResponse(reqTime: number) {
    return {
      response:
        Math.round(Math.random() * 100) >= this._resource.failRate
          ? this._payload
          : 'duh!',
      reqTime,
    }
  }
}

export type resourceWorker = typeof ResourceWorker

expose(ResourceWorker)
