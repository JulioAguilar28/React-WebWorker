import { expose, wrap } from 'comlink'

export interface IResourceProps {
  id: string
  minLatency: number
  maxLatency: number
  failRate: number
}

class Resource {
  _id = ''
  _minLatency: number
  _maxLatency: number
  _failRate: number

  constructor({ id, minLatency, maxLatency, failRate }: IResourceProps) {
    console.log('creating...')
    this._id = id
    this._minLatency = minLatency
    this._maxLatency = maxLatency
    this._failRate = failRate
  }

  get state() {
    return {
      id: this._id,
      minLatency: this._minLatency,
      maxLatency: this._maxLatency,
      failRate: this._failRate,
    }
  }

  async call(payload: string) {
    const worker = new Worker('./resourceWorker.ts', { type: 'module' })
    const ResourceWorker =
      wrap<import('./resourceWorker').resourceWorker>(worker)
    const resourceWorker = await new ResourceWorker(
      {
        id: this._id,
        minLatency: this._minLatency,
        maxLatency: this._maxLatency,
        failRate: this._failRate,
      },
      payload
    )
    const response = await resourceWorker.handleCall()
    console.log(response)
  }
}

export type resource = typeof Resource

expose(Resource)
