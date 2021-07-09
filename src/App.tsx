import React, { useEffect } from 'react'
import './App.css'
import { wrap } from 'comlink'

function App() {
  useEffect(() => {
    sendRequest()
  })

  const sendRequest = async () => {
    const worker = new Worker('./workers/Resource', { type: 'module' })
    const Resource = wrap<import('./workers/Resource').resource>(worker)
    const resourceServer = await new Resource({
      id: 'resource',
      minLatency: 5000,
      maxLatency: 10000,
      failRate: 25,
    })
    console.log(await resourceServer.state)
    for (let i = 0; i < 5; i++) {
      resourceServer.call(i.toString())
    }
  }

  return <div className="App"></div>
}

export default App
