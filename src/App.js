import React, {useState} from 'react'
import axios from "axios";
import './style.css'

function App() {
    const [weather, setWeather] = useState({});
    const [weatherFive, setWeatherFive] = useState({});
    const [city, setCity] = useState('');
    const [temp , setTemp] = useState('C');
    const [five, setFive] = useState(false);
    const [photo, setPhoto] = useState('');


    const getWeather = () => {
        axios(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=c3ca235f299a5ac03a9b15b27ae3fee0`)
            .then(({data})=>{
                setWeather(data);
                getPhoto(data.coord.lon, data.coord.lat)
            } );

    };

    const getPhoto = (lon,lat) => {
        axios(`https://api.flickr.com/services/rest/?method=flickr.photos.search&api_key=1452866c8cea54acd0075022ef573a07&lat=${lat}
        &lon=${lon}&accuracy=1&tags=square&sort=relevance&extras=url_l&format=json`)
            .then(({data})=> setPhoto(JSON.parse(data.slice(14, -1)).photos.photo.filter((item)=> item.url_l)[0].url_l))
    };


    const getWeatherForFiveDay = () => {
        axios(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=c3ca235f299a5ac03a9b15b27ae3fee0`)
            .then(({data})=>
                setWeatherFive(data)
            );
        setFive(true)
    };

    const toDate = (date) => {
        return new Intl.DateTimeFormat('ru-Ru', {
            day:'2-digit',
            month:'long',
            year:'numeric',
            hour:'2-digit',
            minute:'2-digit',
            second:'2-digit'
        }).format(new Date(date))
    };

   let days = JSON.stringify(weatherFive) === '{}' ? '':  weatherFive.list.map((item)=> item.dt_txt.slice(0,10));



    return (
        <main className='main'
              style={{'backgroundImage': `url(${photo === ''
                ? 'https://fourtonfish.com/tutorials/weather-web-app/images/default.jpg' 
                      : photo})`
              }}>
            {!five
                ? <section className='weather'>
                <div className="App">
                    <h1 className='weather__title'>Прогноз погоды</h1>
                    <div className='weather__form'>
                        <input type="text" onChange={(e)=> setCity(e.target.value)}/>
                        <button type='button' onClick={()=> getWeather()}>Получить</button>
                    </div>
                    {JSON.stringify(weather) === '{}'
                        ? ''
                        : <>
                            <div className='weather__top'>
                                <h2>{weather.name}</h2>
                                <p>{weather.sys.country}</p>
                            </div>
                            <div className='weather__temps'>
                                <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt=""/>
                                <p className='weather__temp'>
                                    {temp === 'C'
                                        ?  Math.round(weather.main.temp -273.15)
                                        :  Math.round((weather.main.temp - 273.15) * 9/5 + 32)
                                    }
                                </p>
                                <div className='weather__switch'>
                                <span className={temp === 'C' ? 'active' : ''} onClick={()=> setTemp('C')}>
                                    °C
                                </span>
                                    |
                                    <span className={temp === 'F' ? 'active' : ''} onClick={()=> setTemp('F')}>
                                    °F
                                </span>
                                </div>
                                <p className='weather__description'>{weather.weather[0].description}</p>
                            </div>
                            <p className='weather__time'>{toDate(Date.now())}</p>

                            <p className='weather__humidity'>
                                Влажность : <span className='weather__humidity-count'>{weather.main.humidity} %</span>
                            </p>
                            <button type='button' className='weather__5day' onClick={getWeatherForFiveDay}>Получить погоду на 5 дней</button>
                        </>

                    }

                </div>



            </section>
                : <section  className='weather-five'>
                      <div>
                          <h2>{weather.name}</h2>
                          <div className='weather__temps'>
                              <img src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`} alt=""/>
                              <p className='weather__temp'>
                                  {temp === 'C'
                                      ?  Math.round(weather.main.temp -273.15)
                                      :  Math.round((weather.main.temp - 273.15) * 9/5 + 32)
                                  }
                              </p>
                              <div className='weather__switch'>
                                <span className={temp === 'C' ? 'active' : ''} onClick={()=> setTemp('C')}>
                                    °C
                                </span>
                                  |
                                  <span className={temp === 'F' ? 'active' : ''} onClick={()=> setTemp('F')}>
                                    °F
                                </span>
                              </div>
                          </div>
                          {[...new Set(days)].map((item)=>{
                              return (
                                  <div className='weather-five__row' key={item}>
                                      <div className='weather-five__main'>
                                          <p className='weather-five__main-date'>
                                              {item}
                                          </p>
                                      </div>
                                      <ul className='weather-five__menu'>
                                          {weatherFive.list.map((el)=>{
                                              if (el.dt_txt.includes(item))
                                              return (
                                                  <li key={el.dt_txt} className='weather-five__menu-list'>
                                                      <p>{el.dt_txt}</p>
                                                      <img src={`http://openweathermap.org/img/wn/${el.weather[0].icon}@2x.png`} alt=""/>
                                                  </li>
                                              )
                                          })}
                                      </ul>
                                  </div>
                              )
                          })}

                      </div>
                </section>
            }

        </main>


    );
}




export default App;
