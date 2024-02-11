import React from 'react'
import './Input.css'

const Input = ({label,state,placeholder,setState,type}) => {
  return (
    <div className='input-wrapper'>
        <p className='label-input'>{label}</p>
        <input
        value={state}
        placeholder={placeholder}
        type={type}
        onChange={(e)=>setState(e.target.value)}
        className='custom-input'
        />
        
    </div>
  )
}

export default Input