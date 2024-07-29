document.addEventListener('DOMContentLoaded', function () {
    const currentDate = new Date();
    fetchExcelData(currentDate);
});

function fetchExcelData(currentDate) {
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
