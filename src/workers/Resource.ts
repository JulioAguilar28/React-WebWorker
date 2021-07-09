import { expose, wrap } from 'comlink'
const workerpool = require('workerpool')

export interface IResourceProps {
  id: string
  minLatency: number
  maxLatency: number
  failRate: number
  concurrency: number
}

class Resource {
  _id = ''
  _minLatency: number
  _maxLatency: number
  _failRate: number
  _concurrency: number
  pool: any

  constructor({
    id,
    minLatency,
    maxLatency,
    failRate,
    concurrency,
  }: IResourceProps) {
    console.log('creating pool...')
    this._id = id
    this._minLatency = minLatency
    this._maxLatency = maxLatency
    this._failRate = failRate
    this._concurrency = concurrency

    // Create the pool
    this.pool = workerpool.pool('./resourceWorker.ts', {
      maxWorkers: this._concurrency,
      maxQueueSize: this._concurrency,
      workerType: 'web',
    })
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
    try {
      const result = await this.pool.exec('sum', [5, 5])
    } catch (error) {
      console.log('Error -> ' + error)
    }

    // this.pool.exec('sum', [5, 5]).then((result: any) => {
    //   console.log(result)
    // })
    // this.pool.exec('sum', [1, 3]).then((result: any) => {
    //   console.log(result)
    // })
    console.log(this.pool.stats())

    // const worker = new Worker('./resourceWorker.ts', { type: 'module' })
    // const ResourceWorker =
    //   wrap<import('./resourceWorker').resourceWorker>(worker)
    // const resourceWorker = await new ResourceWorker(
    //   {
    //     id: this._id,
    //     minLatency: this._minLatency,
    //     maxLatency: this._maxLatency,
    //     failRate: this._failRate,
    //     concurrency: this._concurrency,
    //   },
    //   payload
    // )
    // const response = await resourceWorker.handleCall()
    // console.log(response)
  }
}

export type resource = typeof Resource

expose(Resource)
