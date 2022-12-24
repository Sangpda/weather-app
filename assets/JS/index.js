const $ = document.querySelector.bind(document)


const input = $('#search-bar_input')
input.onchange = function (e) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${this.value.trim()}&appid=fded9b09b1e0b7d8375dbf03f10dd258&units=metric&lang=vi`)
        .then(async res => {    
            const state = await res.json();
            if (state.cod == 200) {
                $('.info-location_city-name').innerHTML = state.name || "--"
                $('.info-location_city-temperature').innerText = state.main.temp.toFixed(1) + "°C"
                $('.info-location_weather-state').innerHTML = state.weather[0].description
                $('.info-location_weather-icon').setAttribute('src',`http://openweathermap.org/img/wn/${state.weather[0].icon}@2x.png`)
                $('.windspeed').innerHTML = (state.wind.speed*3.6).toFixed(1)
                $('.sunrise').innerHTML = moment.unix(state.sys.sunrise).format('H:MM')
                $('.sunset').innerHTML = moment.unix(state.sys.sunset).format('H:MM')
                $('.humidity').innerHTML = state.main.humidity + "%"
                $('.info-location_city-temp_feellike').innerHTML = state.main.feels_like.toFixed(1) + "°C"
                $('.temp_min').innerHTML = state.main.temp_min.toFixed(1) + "°C"
                $('.temp_max').innerHTML = state.main.temp_max.toFixed(1) + "°C"
                // if(state.weather[0].description.includes('mây')) {
                //     $('.container').style.background = 'linear-gradient(145deg, #ccc, #000)'
                // }
                // if(state.weather[0].description.includes('nắng'|| 'quang')) {
                //     $('.container').style.background = 'linear-gradient(145deg, #ccc, #000)'
                // }
            }
            if (state.cod == 404) {
                alert(state.message)
            }

        })
}

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
const recognition = new SpeechRecognition()
const syth = window.speechSynthesis

const speak = (text) => {
    if (syth.speaking){
        console.log("busy speech recognition");
        return
    }
    const utter = new SpeechSynthesisUtterance(text)
    utter.onend = () => {
        console.log("end");
    }
    utter.onerror = () => {
        console.log("error");
    }
    syth.speak(utter)
    
}

function handlerEvent (text) {
    const handlerText = text.toLowerCase();
    if (handlerText.includes('thời tiết tại')) {
        const location = handlerText.split('tại')[1].trim();
        input.value = location;
        input.dispatchEvent(new Event('change'));
        return
    }
    if (handlerText.includes('mấy giờ')) {
        // const realTime = 
        speak(`${moment().hours()} hours ${moment().minutes()} minutes`)
        return
    }
    speak('try again')
}

recognition.lang = 'vi-VI'
recognition.continuous = false

$('.microphone-icon').onclick = () => {
    recognition.start()
    $('.microphone').classList.add('recoding')
}
recognition.onspeechend = () => {
    recognition.stop()
    $('.microphone').classList.remove('recoding')
}
recognition.onerror = (err) => {
    alert('Please try again')
    $('.microphone').classList.remove('recoding')
}
recognition.onresult = (e) => {
    const text = e.results[0][0].transcript
    handlerEvent(text)
}




