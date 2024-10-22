const startTimeSelectElement = document.getElementById('start-time');
const endTimeSelectElement = document.getElementById('end-time');

let startHour = 8;
let endHour = 17;

const populateDropDownMenu = (selectElement, selectedValue) => {
    for (let i = 0; i< 24; i++) {
        const optionElement = document.createElement('option');
        
        let hour = i % 12 === 0 ? 12 : i % 12;
        hour += ':00';
        hour += i < 12 ? ' AM' : ' PM';
        optionElement.value = i;
        optionElement.text = hour;

        if (i === selectedValue) {
            optionElement.selected = true;
        }
        selectElement.appendChild(optionElement);
    }
}

populateDropDownMenu(startTimeSelectElement, 8);
populateDropDownMenu(endTimeSelectElement, 17);

startTimeSelectElement.addEventListener('change', (event) => {
    startHour = parseInt(event.target.value);
});

endTimeSelectElement.addEventListener('change', (event) => {
    endHour = parseInt(event.target.value);
});