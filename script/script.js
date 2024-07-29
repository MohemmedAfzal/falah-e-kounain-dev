
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('nav-toggle').onclick = function () {
        document.getElementById('nav-links').classList.toggle('show');
    }
    const currentDate = new Date();
    fetchFarazNamazData(currentDate);
    fetchNafilNamazData(currentDate);
});

function fetchFarazNamazData(currentDate) {
    fetch('excel/namaz-timings.xlsx') // Adjust the path to your Excel file
        .then(response => response.arrayBuffer())
        .then(data => {
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);

        

            const todaysTimings = jsonData.find(entry => {
                const excelDate = new Date((entry.Date- (25567 + 2)) * 86400 * 1000); 
                return excelDate.toDateString() === currentDate.toDateString();
            });
            
            if (todaysTimings) {
                document.getElementById('fajr-starts').textContent = todaysTimings['fajr-starts'];
                document.getElementById('fajr-azan').textContent = todaysTimings['fajr-azan'];
                document.getElementById('fajr').textContent = todaysTimings['fajr'];
                document.getElementById('fajr-ends').textContent = todaysTimings['fajr-ends'];
                document.getElementById('zuhar-starts').textContent = todaysTimings['zuhar-starts'];
                document.getElementById('zuhar-azan').textContent = todaysTimings['zuhar-azan'];
                document.getElementById('zuhar').textContent = todaysTimings['zuhar'];
                document.getElementById('zuhar-ends').textContent = todaysTimings['zuhar-ends'];
                document.getElementById('asar-starts').textContent = todaysTimings['asar-starts'];
                document.getElementById('asar-azan').textContent = todaysTimings['asar-azan'];
                document.getElementById('asar').textContent = todaysTimings['asar'];
                document.getElementById('asar-ends').textContent = todaysTimings['asar-ends'];
                document.getElementById('maghrib-starts').textContent = todaysTimings['maghrib-starts'];
                document.getElementById('maghrib-azan').textContent = todaysTimings['maghrib-azan'];
                document.getElementById('maghrib').textContent = todaysTimings['maghrib'];
                document.getElementById('maghrib-ends').textContent = todaysTimings['maghrib-ends'];
                document.getElementById('isha-starts').textContent = todaysTimings['isha-starts'];
                document.getElementById('isha-azan').textContent = todaysTimings['isha-azan'];
                document.getElementById('isha').textContent = todaysTimings['isha'];
                document.getElementById('isha-ends').textContent = todaysTimings['isha-ends'];
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
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);



            const todaysTimings = jsonData.find(entry => {
                const excelDate = new Date((entry.Date- (25567 + 2)) * 86400 * 1000);
                return excelDate.toDateString() === currentDate.toDateString();
            });
            console.log(todaysTimings)
            if (todaysTimings) {
                document.getElementById('tahajjud-starts').textContent = todaysTimings['tahajjud-starts'];
                document.getElementById('tahajjud-ends').textContent = todaysTimings['tahajjud-ends'];
                document.getElementById('isharaque-starts').textContent = todaysTimings['isharaque-starts'];
                document.getElementById('isharaque-ends').textContent = todaysTimings['isharaque-ends'];
                document.getElementById('chast-starts').textContent = todaysTimings['chast-starts'];
                document.getElementById('chast-ends').textContent = todaysTimings['chast-ends'];
                document.getElementById('awwabeen-starts').textContent = todaysTimings['awwabeen-starts'];
                document.getElementById('awwabeen-ends').textContent = todaysTimings['awwabeen-ends'];
            } else {
                document.getElementById('namaz-timings').innerHTML = '<p>No timings available for today.</p>';
            }
        })
        .catch(error => console.error('Error fetching the Excel file:', error));
}