import { expose } from 'comlink'
import { IResourceProps } from './Resource'
const workerpool = require('workerpool')

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

  // ! Returns a promise with the time that a request has taken to be done
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

  /* 
    ! Returns an object with the response.
    It calculates a random number between 1 to 100.
    If the random number is greather than resource fail rate
    The response is the payload oterwhise the response is `duh!` indicating that it fails.
  */
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

function sum(a: number, b: number): number {
  return a + b
}

workerpool.worker({
  sum: sum,
})
