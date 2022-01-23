import React, {useState} from 'react'
import axios from "axios";
import './style.css'
import CurrentDay from "./components/CurrentDay/CurrentDay";
import FiveDays from "./components/FIveDays/FiveDays";

function App() {
    const [weather, setWeather] = useState({});
    const [weatherFive, setWeatherFive] = useState({});
    const [city, setCity] = useState('');
    const [temp , setTemp] = useState('C');
    const [five, setFive] = useState(false);
    const [day, setDay] = useState(1);



    const getWeather = () => {
        axios(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=c3ca235f299a5ac03a9b15b27ae3fee0`)
            .then(({data})=> setWeather(data) );

    };



    const getWeatherForFiveDay = () => {
        axios(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=c3ca235f299a5ac03a9b15b27ae3fee0`)
            .then(({data})=> setWeatherFive(data));
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
        <main className='main'>
            {
                !five
                ? <CurrentDay setDay={setDay} setCity={setCity} getWeather={getWeather} weather={weather} temp={temp} setTemp={setTemp} toDate={toDate} getWeatherForFiveDay={getWeatherForFiveDay}/>
                : <FiveDays setFive={setFive} day={day} setDay={setDay} weatherFive={weatherFive} days={days} weather={weather} temp={temp} setTemp={setTemp}/>
            }

        </main>


    );
}




export default App;
