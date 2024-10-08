document.addEventListener('DOMContentLoaded', function () {
    let currentDate = new Date();
    console.log(currentDate)
    fetchFarazNamazData(currentDate);
    fetchNafilNamazData(currentDate);
    fetchMakroohNamazTimings(currentDate);
});
document.getElementById('date-button').onclick = function () {
    let dateInput = document.getElementById('dateInput').value;
    // Convert the string to a Date object (if needed)
    let selectedDate = new Date(dateInput);
    // Log the date
    let currentDate = new Date(selectedDate);
    showLog("Selected "+ currentDate.toDateString())
    fetchFarazNamazData(currentDate,true);
    fetchNafilNamazData(currentDate);
    fetchMakroohNamazTimings(currentDate);
}
function showLog(message) {
    const alertBox = document.getElementById('customAlert');
    alertBox.textContent = message;
    alertBox.classList.add('show');

    // Automatically hide the alert after 3 seconds
    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 3000);
}
function fetchFarazNamazData(currentDate,datePicker) {
    fetch('excel/namaz-timings.xlsx') // Adjust the path to your Excel file
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, {type: 'array'});
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

            const todaysTimings = jsonData.find(entry => {
                const excelDate = new Date((entry.Date - (25567 + 2)) * 86400 * 1000);
                return excelDate.toDateString() === currentDate.toDateString();
            });

            if (todaysTimings) {
                fetchUpcomingNamaz(todaysTimings);
                fetchZuharNamazTimingInOtherMasjid(excelTimeToJSTimeString(todaysTimings['zuhar']));
                fetchAsrNamazTimingInOtherMasjid(excelTimeToJSTimeString(todaysTimings['asar']));
                fetchIshaEarlyNamazTimingInOtherMasjid(excelTimeToJSTimeString(todaysTimings['isha-azan']),datePicker);
                fetchIshaLaterNamazTimingInOtherMasjid(excelTimeToJSTimeString(todaysTimings['isha']),datePicker);

                document.getElementById('fajr-starts').textContent = excelTimeToJSTimeString(todaysTimings['fajr-starts']);
                document.getElementById('fajr-azan').textContent = excelTimeToJSTimeString(todaysTimings['fajr-azan']);
                document.getElementById('fajr').textContent = excelTimeToJSTimeString(todaysTimings['fajr']);
                document.getElementById('fajr-ends').textContent = excelTimeToJSTimeString(todaysTimings['fajr-ends']);
                document.getElementById('zuhar-starts').textContent = excelTimeToJSTimeString(todaysTimings['zuhar-starts']);
                document.getElementById('zuhar-azan').textContent = excelTimeToJSTimeString(todaysTimings['zuhar-azan']);
                document.getElementById('zuhar').textContent = excelTimeToJSTimeString(todaysTimings['zuhar']);
                document.getElementById('zuhar-ends').textContent = excelTimeToJSTimeString(todaysTimings['zuhar-ends']);
                document.getElementById('asar-starts').textContent = excelTimeToJSTimeString(todaysTimings['asar-starts']);
                document.getElementById('asar-azan').textContent = excelTimeToJSTimeString(todaysTimings['asar-azan']);
                document.getElementById('asar').textContent = excelTimeToJSTimeString(todaysTimings['asar']);
                document.getElementById('asar-ends').textContent = excelTimeToJSTimeString(todaysTimings['asar-ends']);
                document.getElementById('maghrib-starts').textContent = excelTimeToJSTimeString(todaysTimings['maghrib-starts']);
                document.getElementById('maghrib-azan').textContent = excelTimeToJSTimeString(todaysTimings['maghrib-azan']);
                document.getElementById('maghrib').textContent = excelTimeToJSTimeString(todaysTimings['maghrib']);
                document.getElementById('maghrib-ends').textContent = excelTimeToJSTimeString(todaysTimings['maghrib-ends']);
                document.getElementById('isha-starts').textContent = excelTimeToJSTimeString(todaysTimings['isha-starts']);
                document.getElementById('isha-azan').textContent = excelTimeToJSTimeString(todaysTimings['isha-azan']);
                document.getElementById('isha').textContent = excelTimeToJSTimeString(todaysTimings['isha']);
                document.getElementById('isha-ends').textContent = excelTimeToJSTimeString(todaysTimings['isha-ends']);
            } else {
                document.getElementById('namaz-timings').innerHTML = '<p>No timings available for today.</p>';
            }
        })
        .catch(error => console.error('Error fetching the Excel file:', error));
}

function fetchNafilNamazData(currentDate) {
    fetch('excel/nafil-timings.xlsx') // Adjust the path to your Excel file
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, {type: 'array'});
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);


            const todaysTimings = jsonData.find(entry => {
                const excelDate = new Date((entry.Date - (25567 + 2)) * 86400 * 1000);
                return excelDate.toDateString() === currentDate.toDateString();
            });
            const today = new Date();
            const options = {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                calendar: 'islamic',
                timeZone: 'Asia/Kolkata'
            };
            var islamicDateFormat = new Intl.DateTimeFormat('en-IN', options).format(today).split(" ");
            // console.log(islamicDateFormat);
            var date = islamicDateFormat[0];
            var month = getIslamicMonth(islamicDateFormat[1].split(",")[0]);
            var islamicDate = date + " " + month + " " + islamicDateFormat[2] + " " + "Hijri";
            document.getElementById("islamic-date").textContent = islamicDate;

            if (todaysTimings) {
                document.getElementById('tahajjud-starts').textContent = todaysTimings['tahajjud-starts'];
                document.getElementById('tahajjud-ends').textContent = excelTimeToJSTimeString(todaysTimings['tahajjud-ends']);
                document.getElementById('isharaque-starts').textContent = excelTimeToJSTimeString(todaysTimings['isharaque-starts']);
                document.getElementById('isharaque-ends').textContent = excelTimeToJSTimeString(todaysTimings['isharaque-ends']);
                document.getElementById('chast-starts').textContent = excelTimeToJSTimeString(todaysTimings['chast-starts']);
                document.getElementById('chast-ends').textContent = excelTimeToJSTimeString(todaysTimings['chast-ends']);
                document.getElementById('awwabeen-starts').textContent = todaysTimings['awwabeen-starts'];
                document.getElementById('awwabeen-ends').textContent = excelTimeToJSTimeString(todaysTimings['awwabeen-ends']);
                document.getElementById('sehri').textContent = excelTimeToJSTimeString(todaysTimings['sehri']);
                document.getElementById('iftari').textContent = excelTimeToJSTimeString(todaysTimings['iftari']);
            } else {
                document.getElementById('nafil-prayer-card').innerHTML = '<p>No timings available for today.</p>';
            }
        })
        .catch(error => console.error('Error fetching the Excel file:', error));
}

function fetchMakroohNamazTimings(currentDate) {
    fetch('excel/makrooh-timings.xlsx') // Adjust the path to your Excel file
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, {type: 'array'});
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);


            const todaysTimings = jsonData.find(entry => {
                const excelDate = new Date((entry.Date - (25567 + 2)) * 86400 * 1000);
                return excelDate.toDateString() === currentDate.toDateString();
            });
            const today = new Date();
            const options = {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                calendar: 'islamic',
                timeZone: 'Asia/Kolkata'
            };

            if (todaysTimings) {
                document.getElementById('sunrise-starts').textContent = excelTimeToJSTimeString(todaysTimings['sunrise-starts']);
                document.getElementById('sunrise-ends').textContent = excelTimeToJSTimeString(todaysTimings['sunrise-ends']);
                document.getElementById('junoob-starts').textContent = excelTimeToJSTimeString(todaysTimings['junoob-starts']);
                document.getElementById('junoob-ends').textContent = excelTimeToJSTimeString(todaysTimings['junoob-ends']);
                document.getElementById('sunset-starts').textContent = excelTimeToJSTimeString(todaysTimings['sunset-starts']);
                document.getElementById('sunset-ends').textContent = excelTimeToJSTimeString(todaysTimings['sunset-ends']);
            } else {
                document.getElementById('makrooh-prayer-timing-card').innerHTML = '<p>No timings available for today.</p>';
            }
        })
        .catch(error => console.error('Error fetching the Excel file:', error));
}

function excelTimeToJSTimeString(excelTime) {
    const totalSeconds = excelTime * 24 * 60 * 60;
    let hours = Math.floor(totalSeconds / 3600);
    let minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);
    // Determine AM/PM and convert hours to 12-hour format
    const period = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    if (minutes === 59) {
        hours = hours + 1;
        minutes = 0;
    }
    // Pad hours, minutes, and seconds with leading zeros if necessary
    const pad = (num) => num.toString().padStart(2, '0');
    return `${pad(hours)}:${pad(minutes)} ${period}`;
}

function fetchUpcomingNamaz(todaysTimings) {
    const now = new Date();
    let hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const time = hours + ':' + (minutes < 10 ? '0' + minutes : minutes) + ' ' + ampm;
    const strTime = convertToTime(time);
    if (strTime >= '00:00' && strTime >= convertToTime(excelTimeToJSTimeString(todaysTimings['isha'])) && strTime <= convertToTime(excelTimeToJSTimeString(todaysTimings['fajr']))) {
        document.getElementById('upcoming-namaz').textContent = "Fajr: " + excelTimeToJSTimeString(todaysTimings['fajr']);
    } else if (strTime >= convertToTime(excelTimeToJSTimeString(todaysTimings['fajr'])) && strTime <= convertToTime(excelTimeToJSTimeString(todaysTimings['zuhar']))) {
        document.getElementById('upcoming-namaz').textContent = "Zuhar: " + excelTimeToJSTimeString(todaysTimings['zuhar']);
    } else if (strTime >= convertToTime(excelTimeToJSTimeString(todaysTimings['zuhar'])) && strTime <= convertToTime(excelTimeToJSTimeString(todaysTimings['asar']))) {
        document.getElementById('upcoming-namaz').textContent = "Asar: " + excelTimeToJSTimeString(todaysTimings['asar']);
    } else if (strTime >= convertToTime(excelTimeToJSTimeString(todaysTimings['asar'])) && strTime <= convertToTime(excelTimeToJSTimeString(todaysTimings['maghrib']))) {
        document.getElementById('upcoming-namaz').textContent = "Magrib: " + excelTimeToJSTimeString(todaysTimings['maghrib']);
    } else if (strTime >= convertToTime(excelTimeToJSTimeString(todaysTimings['maghrib'])) && strTime <= convertToTime(excelTimeToJSTimeString(todaysTimings['isha']))) {
        document.getElementById('upcoming-namaz').textContent = "Isha: " + excelTimeToJSTimeString(todaysTimings['isha']);
    } else if (strTime >= convertToTime(excelTimeToJSTimeString(todaysTimings['isha']))) {
        document.getElementById('upcoming-namaz').textContent = "Fajr: " + excelTimeToJSTimeString(todaysTimings['fajr']);
    }
}

function convertToTime(time) {
    let [timePart, modifier] = time.split(' ');

    let [hours, minutes] = timePart.split(':');
    hours = parseInt(hours, 10);

    if (modifier === 'PM' && hours !== 12) {
        hours += 12;
    } else if (modifier === 'AM' && hours === 12) {
        hours = 0;
    }

    // Format hours and minutes to always have two digits
    hours = hours.toString().padStart(2, '0');
    minutes = minutes.padStart(2, '0');

    return `${hours}:${minutes}`;
}

function fetchZuharNamazTimingInOtherMasjid(zuharTimeString) {
    fetch('excel/zuhar-timings.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, {type: 'array'});
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            const zuharTime = parseTimeString(zuharTimeString);
            populateTable(jsonData, zuharTime, "zuhar");
        });
}

function fetchAsrNamazTimingInOtherMasjid(asrTimeString) {
    fetch('excel/asr-timings.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, {type: 'array'});
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            const asrTime = parseTimeString(asrTimeString);
            populateTable(jsonData, asrTime, "asr");
        });
}

function fetchIshaEarlyNamazTimingInOtherMasjid(ishaTimeString,datePicker) {
    if(datePicker){
        tableBody = document.getElementById('masjidTableOnIsha').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '';
    }
    fetch('excel/isha-early-timings.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, {type: 'array'});
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            const ishaTime = parseTimeString(ishaTimeString);
            populateTable(jsonData, ishaTime, "isha");
        });
}

function fetchIshaLaterNamazTimingInOtherMasjid(ishaTimeString,datePicker) {
    if(datePicker){
        tableBody = document.getElementById('masjidTableOnIsha').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '';
    }
    fetch('excel/isha-later-timings.xlsx')
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, {type: 'array'});
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            const ishaTime = parseTimeString(ishaTimeString);
            populateTable(jsonData, ishaTime, "isha");
        });
}

function populateTable(data, diffNamazTime, namazTime) {
    let tableBody;
    if (namazTime === "zuhar") {
        tableBody = document.getElementById('masjidTable').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = ''; // Clear previous data
    } else if (namazTime === "asr") {
        tableBody = document.getElementById('masjidTableOnAsr').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = ''; // Clear previous data
    } else if (namazTime === "isha") {
        tableBody = document.getElementById('masjidTableOnIsha').getElementsByTagName('tbody')[0];
        tableBody.ariaSort;
    }

    data.forEach(row => {
        const tr = document.createElement('tr');
        const tdName = document.createElement('td');
        const tdTimeAdjustment = document.createElement('td');
        const tdNamazTime = document.createElement('td');

        tdName.textContent = row['masjid'];
        tdTimeAdjustment.textContent = row['time'];
        const adjustedTime = new Date(diffNamazTime);
        adjustedTime.setMinutes(adjustedTime.getMinutes() + parseInt(row['time'], 10));
        tdNamazTime.textContent = formatTime(adjustedTime);

        tr.appendChild(tdName);
        tr.appendChild(tdTimeAdjustment);
        tr.appendChild(tdNamazTime);
        tableBody.appendChild(tr);
    });
}

function parseTimeString(timeString) {
    const [time, modifier] = timeString.split(' ');
    let [hours, minutes] = time.split(':');
    hours = parseInt(hours, 10);
    if (hours === 12) {
        hours = 0;
    }
    if (modifier === 'PM') {
        hours += 12;
    }
    return new Date(`1970-01-01T${hours.toString().padStart(2, '0')}:${minutes}:00`);
}

function formatTime(date) {
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    return `${hours.toString().padStart(2, '0')}:${minutes} ${ampm}`;
}

function getIslamicMonth(month) {
    switch (month.toString().toLowerCase()) {
        case "january":
            return "Muharram";
        case "february":
            return "Safar";
        case "march":
            return "Rabi-Ul-Awwal";
        case "april":
            return "Rabi-Ul-Aakhir";
        case "may":
            return "Jamadil-Awwal";
        case "june":
            return "Jamadil-Aakhir";
        case "july":
            return "Rajab";
        case "august":
            return "Shabaan";
        case "september":
            return "Ramazan";
        case "october":
            return "Shawwal";
        case "november":
            return "Zi-Qaida";
        case "december":
            return "Zil-Hajj";
        default:
            return month;
    }
}
