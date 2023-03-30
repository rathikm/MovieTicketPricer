import React, { useState } from 'react';
import Listing from './components/Listing';
import './App.css';

function App() {
  const [movieName, setMovieName] = useState("")
  const [movies, setMovies] = useState([])
andleChange = (event) => {
    setMovieName(event.target.value)
  }

  // //credit to http://blog.stevenlevithan.com/archives/javascript-roman-numeral-converter
  // const romanize = (num) => {
  //   let lookup = {m:1000,cm:900,d:500,cd:400,c:100,xc:90,l:50,xl:40,x:10,ix:9,v:5,iv:4,i:1},
  //       roman = '',
  //       i;
  //   for (i in lookup) {
  //     while (num >= lookup[i]) {
  //       roman += i;
  //       num -= lookup[i];
  //     }
  //   }
  //   return roman;
  // }
  
  const handleClick = async () => {
    try {
      let m = movieName.toLowerCase()
      for (let i=0;i<m.length;i++) {
        const c = m[i]
        if (c === " " || !c.match(/[a-z]/i) ) {
          if(m[i-1] !== "-") {
            m = m.replace(c, "-")
          } else {
            m = m.replace(c, "")
            i--
          }
        } 
      }
      console.log(m)
      const response = await fetch('api/' + m)
      m = await response.json()
      setMovies(m)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="App">
      <input placeholder='Enter movie name' onChange={handleChange}/>
      <button onClick={handleClick}>Find Tickets</button>
      {movies.length > 0 && movies.map((movie) => {
        
        return movie.formatted_time_price_list.map((formatted_time_price_combo) => {
          return formatted_time_price_combo.time_prices_combos.map((combo) => {
            return <Listing className="listing" theater={movie.theater} addy={movie.addy} time={combo.time} price={combo.prices[0]} format={formatted_time_price_combo.format}/>
          })
        })
      })}
    </div>
  );
}

export default App;
