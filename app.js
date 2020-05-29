import React, { useState, useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

const MOUNT_NODE = document.getElementById('app')

const Layout = styled.div`
  display: grid;
  text-align: center;
  font-family: sans-serif;
`

const TimerDisplay = styled.div`
  padding: 10px;
  font-family: 'VT323', sans-serif;
  font-size: 60px;
`

const TimerControls = styled.div`
  display: inline-block;
`

const TimerButton = styled.button`
  font-size: 20px;
  margin-right: 5px;
`

const LapList = styled.div`
  height: 600px;
  padding: 15px;
  text-align: right;
  overflow-y: scroll;
`

const Lap = styled.div`
  font-size: 16px;
  padding-bottom: 3px;
`

const fmtTime = (duration) => {
  let millis = parseInt((duration % 1000) / 10)
    , seconds = parseInt((duration / 1000) % 60)
    , minutes = parseInt((duration / (1000 * 60)) % 60)
    , hours = parseInt((duration / (1000 * 60 * 60)) % 24)

  hours = (hours < 10) ? "0" + hours : hours
  minutes = (minutes < 10) ? "0" + minutes : minutes
  seconds = (seconds < 10) ? "0" + seconds : seconds

  return hours + ":" + minutes + ":" + seconds + "." + `${millis}`.padStart(2, 0)
}

class Timer {
  constructor() {
    this.interval = null
    this.rate = 10
    this.time = 0
    this.paused = true
  }

  start() {
    this.paused = false
    this.interval = setInterval(() => {
      this.time = this.time + this.rate
    }, this.rate)
  }

  pause() {
    if (!this.interval) return
    clearInterval(this.interval)
    this.interval = null
    this.paused = true
  }

  reset() {
    this.time = 0
  }

  getTime() {
    return this.time
  }

  getElaspedSince(t) {
    return this.time - t
  }

  isPaused() {
    return this.paused
  }
}

const timer = new Timer()

const App = ({ timer }) => {
  const [time, setTime] = useState(timer.getTime())
  const [laps, setLaps] = useState([])

  const timerRef = useRef()

  const handleStart = () => {
    timer.start()
  }

  const handlePause = () => {
    timer.pause()
  }

  const handleReset = () => {
    timer.reset()
    setLaps([])
  }

  const handleLap = () => {
    if (timer.isPaused()) return

    const nextTotalDuration = timer.getTime()

    if (laps.length) {
      const [prevTotalDuration] = laps.slice(-1)[0]
      setLaps([...laps, [nextTotalDuration, nextTotalDuration - prevTotalDuration]])
    } else {
      setLaps([[nextTotalDuration, nextTotalDuration]])
    }
  }

  const animate = () => {
    setTime(timer.getTime())
    requestAnimationFrame(animate)
  }

  useEffect(() => {
    timerRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(timerRef.current)
  }, [])

  return (
    <Layout>
      <TimerDisplay>{fmtTime(time)}</TimerDisplay>
      <TimerControls>
        {timer.isPaused() ?
          <TimerButton onClick={handleStart}>Start</TimerButton> :
          <TimerButton onClick={handlePause}>Stop</TimerButton>
        }

        <TimerButton onClick={handleReset}>Reset</TimerButton>
        <TimerButton onClick={handleLap}>Lap</TimerButton>
      </TimerControls>

      <LapList>
        {laps.map(([_, lapDuration], i) => (
          <Lap key={i}>Lap {i + 1}: {fmtTime(lapDuration)}</Lap>
        ))}
      </LapList>
    </Layout>
  )
}

ReactDOM.render(<App timer={timer} />, MOUNT_NODE)