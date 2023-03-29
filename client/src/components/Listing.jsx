import React from 'react'
import './Listing.css'
const Listing = (props) => {
  return (
    <div className='Listing'>
        <div className='theater'>{props.theater}</div>
        <div className='address'>{props.addy}</div>
        <div className='format'>{props.format}</div>
        <div className='time'>{props.time}</div>
        <div className='price'>{props.price}</div>
    </div>
  )
}

export default Listing