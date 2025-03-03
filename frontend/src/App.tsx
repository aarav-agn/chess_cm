import { useState } from 'react'

import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <button className='bg-rd-200' >
      Join room
      </button>
    </>
  )
}

export default App
