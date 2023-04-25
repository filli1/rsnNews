function getDateTime() {
    //Gets the current date time
    let currentDateTime = new Date();

    const options = { timeZoneName: 'longGeneric' };
    //console.log()

    //Gets the current hour, minute and second
    let hour = currentDateTime.getHours();
    let minute = currentDateTime.getMinutes();
    let second = currentDateTime.getSeconds();

    //Gets the time in format HH:MM:SS
    let timeString = currentDateTime.toLocaleTimeString();

    //Get the current day of month (1-31)
    let day = currentDateTime.getDate();

    //Sets the day of week as a string
    let weekday = ['Mandag','Tirsdag','Onsdag','Torsdag','Fredag','Lørdag','Søndag'];
    weekday = weekday[currentDateTime.getUTCDay()-1];

    //Sets the month as a string
    let month = ['Januar', 'Februar','Marts','April','Maj','Juni','Juli','August','September','Oktober','November','December'];
    month = month[currentDateTime.getMonth()]

    //Gets the current year
    let year = currentDateTime.getFullYear();

    //Gets the timezone
    let timezone = String(currentDateTime.toLocaleDateString('da-DK', { timeZoneName: 'shortOffset' })).split(' ')[1]+' (C'+String(currentDateTime.toLocaleDateString('da-DK', { timeZoneName: 'longGeneric' })).split(" C")[1]+')'

    //Creates an object with the current time inside of it
    let dateTime = {
        hour: hour,
        minute: minute,
        second: second,
        timeString: timeString,
        day: day,
        weekday: weekday,
        month: month,
        year: year,
        timezone: timezone,
        //this is returning the date in the form YYYY-MM-DD
        date: year+"-"+((currentDateTime.getMonth()+1)<10?'0'+(currentDateTime.getMonth()+1):(currentDateTime.getMonth()+1))+"-"+(day<10?'0'+day:day)
    }

    return dateTime;
    
}

//this function is updating the time widget in the application
function updateTime(){
    //Configuring the time widget
    let timeElement = document.getElementById("time");
    let dateElement = document.getElementById("date");
    let timezoneElement = document.getElementById("timezone");
    //this is does so that the inner javascript is running every 1ms.
    setTimeout(() => {
        let dateTime = getDateTime();
        timeElement.innerHTML = dateTime.timeString;
        dateElement.innerHTML = "D. "+dateTime.day+" "+dateTime.weekday+", "+dateTime.month+" "+dateTime.year
        timezoneElement.innerHTML = dateTime.timezone;
        //An animationframe is requested so that the time can update in real-time
        window.requestAnimationFrame(updateTime)
    }, 1);
}