import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

const MOUNT_NODE = document.getElementById('app')

const Layout = styled.div`
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
  width: 300px;
  height: 600px;
  margin: 0 auto;
  padding: 15px;
  text-align: center;
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
    , hours = parseInt((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds + "." + `${millis}`.padEnd(2, '0')
}

const App = () => {
  const [counter, setCounter] = useState(0)
  const [paused, setPaused] = useState(true)
  const [laps, setLaps] = useState([])

  useEffect(() => {
    const interval = setInterval(() => {
      if (!paused) setCounter(counter + 10)
    }, 10)

    return () => {
      clearInterval(interval);
    }
  })

  const handleStart = () => {
    setPaused(false)
  }

  const handleStop = () => {
    setPaused(true)
  }

  const handleReset = () => {
    setCounter(0)
    setLaps([])
  }

  const handleLap = () => {
    if (paused) return
    setLaps([...laps, counter])
  }

  return (
    <Layout>
      <TimerDisplay>{fmtTime(counter)}</TimerDisplay>
      <TimerControls>
        {paused ?
          <TimerButton onClick={handleStart}>Start</TimerButton> :
          <TimerButton onClick={handleStop}>Stop</TimerButton>
        }

        <TimerButton onClick={handleReset}>Reset</TimerButton>
        <TimerButton onClick={handleLap}>Lap</TimerButton>
      </TimerControls>

      <LapList>
        {laps.map((lap, i) => (
          <Lap key={i}>Lap {i + 1}: {fmtTime(lap)}</Lap>
        ))}
      </LapList>
    </Layout>
  )
}

ReactDOM.render(<App />, MOUNT_NODE)