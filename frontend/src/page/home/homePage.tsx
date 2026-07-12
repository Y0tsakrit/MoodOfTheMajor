import React from 'react'
import NavBar from '../../components/navBar'

function  HomePage() {
  return (
    <div className='grid grid-cols-[1fr_2fr_1fr]'>
      <NavBar />
      <div>HomePage</div>
      <div>Right</div>
    </div>
  )
}

export default HomePage