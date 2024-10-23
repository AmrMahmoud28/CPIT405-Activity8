const startTimeSelectElement = document.getElementById("start-time");
const endTimeSelectElement = document.getElementById("end-time");

let startHour = 8;
let endHour = 17;

const populateDropDownMenu = (selectElement, selectedValue) => {
    for (let i = 0; i < 24; i++) {
        const optionElement = document.createElement("option");

        let hour = i % 12 === 0 ? 12 : i % 12;
        hour += ":00";
        hour += i < 12 ? " AM" : " PM";
        optionElement.value = i;
        optionElement.text = hour;

        if (i === selectedValue) {
            optionElement.selected = true;
        }
        selectElement.appendChild(optionElement);
    }
};

populateDropDownMenu(startTimeSelectElement, 8);
populateDropDownMenu(endTimeSelectElement, 17);

startTimeSelectElement.addEventListener("change", (event) => {
    startHour = parseInt(event.target.value);
    createTimeTable();
});

endTimeSelectElement.addEventListener("change", (event) => {
    endHour = parseInt(event.target.value);
    createTimeTable();
});

const createTimeTable = () => {
    const tableElement = document.getElementById("timeTable");
    const days = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
    ];

    let tableHtml = "<table><thead><tr><th></th>";
    days.forEach((day) => (tableHtml += `<th class="day-header">${day}</th>`));

    tableHtml += "</tr></thead><tbody>";

    for (let i = startHour; i <= endHour; i++) {
        let hour = i % 12 === 0 ? 12 : i % 12;
        hour += ":00";
        hour += i < 12 ? " AM" : " PM";

        tableHtml += `<tr><td class="time-label">${hour}</td>`;
        days.forEach(
            (day) =>
                (tableHtml += `<td class="time-slot" onclick="toggleTimeSlot(this)" data-day="${day}" data-time="${hour}"></td>`)
        );
        tableHtml += "</tr>";
    }

    tableHtml += "</tbody></table>";
    tableElement.innerHTML = tableHtml;
};

createTimeTable();

const selectedTimeSlots = new Set();

const toggleTimeSlot = (tdElement) => {
    const timeSlotId = `${tdElement.dataset.day}-${tdElement.dataset.time}`;

    if (selectedTimeSlots.has(timeSlotId)) {
        selectedTimeSlots.delete(timeSlotId);
        tdElement.classList.remove("selected");
    } else {
        selectedTimeSlots.add(timeSlotId);
        tdElement.classList.add("selected");
    }
};

document.getElementById("submitMeeting").addEventListener("click", async () => {
    const username = document.getElementById("user-name").value;
    const eventName = document.getElementById("event-name").value;
    if (!username || !eventName) {
        alert("Please enter both username and event name");
        return;
    }

    const bodyPayload = {
        username: username,
        eventName: eventName,
        slots: [...selectedTimeSlots],
    };

    const API_URL = "https://jsonplaceholder.typicode.com/posts";
    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyPayload),
    });
    if (!response.ok) {
        alert("Failed to create meeting. Please try again later.");
        return;
    }

    const data = await response.json();
    console.log("Meeting created successfully:", data);
    alert("Meeting created successfully!");
    selectedTimeSlots.clear();
    document.getElementById("user-name").value = "";
    document.getElementById("event-name").value = "";
    createTimeTable();
});
