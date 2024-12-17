const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');


// Registration - Save credentials to localStorage
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const regNo = document.getElementById('reg-no').value;
        const password = document.getElementById('password').value;

        if (localStorage.getItem(regNo)) {
            alert('Registration number already exists. Please use a different one.');
        } else {
            localStorage.setItem(regNo, JSON.stringify({ name, password, status: 'Not Paid', paymentHistory: [] }));
            alert(`Registered successfully as ${name}`);
            window.location.href = 'index.html';
        }
    });
}


// Login Logic
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const regNo = document.getElementById('reg-no').value;
        const password = document.getElementById('password').value;
        const userData = JSON.parse(localStorage.getItem(regNo));

        if (userData && userData.password === password) {
            alert(`Logged in successfully as ${userData.name}`);
            localStorage.setItem('loggedInStudent', JSON.stringify({ studentName: userData.name, regNo }));
            window.location.href = 'timetable.html';
        } else {
            alert('Invalid registration number or password.');
        }
    });
}



// Registration and login code remains the same
if (window.location.pathname.endsWith('timetable.html')) {
    window.onload = function() {
        const loggedInStudent = JSON.parse(localStorage.getItem('loggedInStudent'));

        // Redirect to index.html if not logged in
        if (!loggedInStudent) {
            alert('You must be logged in to access this page.');
            window.location.href = 'index.html';
        } else {
            // Load schedule data if logged in
            const storedSchedule = JSON.parse(localStorage.getItem(`schedule_${loggedInStudent.regNo}`));
            if (storedSchedule) {
                loadSchedule(storedSchedule);
            }
        }
    };
}




function addSchedule() {
    const subject = document.getElementById('subject').value;
    const day = document.getElementById('day').value;
    const time = document.getElementById('time').value;

    if (subject && day && time) {
        const table = document.getElementById('schedule-table').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();
        newRow.innerHTML = `<td>${subject}</td><td>${day}</td><td>${time}</td><td><button onclick="deleteRow(this)">Delete</button></td>`;
        document.getElementById('schedule-form').reset();

        // Save schedule to localStorage
        saveSchedule();
    }
}

function saveSchedule() {
    const loggedInStudent = JSON.parse(localStorage.getItem('loggedInStudent'));
    const regNo = loggedInStudent.regNo;

    const tableRows = document.getElementById('schedule-table').getElementsByTagName('tbody')[0].rows;
    const schedule = [];

    for (let i = 0; i < tableRows.length; i++) {
        const row = tableRows[i];
        const subject = row.cells[0].innerText;
        const day = row.cells[1].innerText;
        const time = row.cells[2].innerText;
        schedule.push({ subject, day, time });
    }

    // Store schedule in localStorage with key `schedule_<regNo>`
    localStorage.setItem(`schedule_${regNo}`, JSON.stringify(schedule));
}

function loadSchedule(schedule) {
    const table = document.getElementById('schedule-table').getElementsByTagName('tbody')[0];
    table.innerHTML = ''; // Clear the table first

    schedule.forEach((entry) => {
        const newRow = table.insertRow();
        newRow.innerHTML = `<td>${entry.subject}</td><td>${entry.day}</td><td>${entry.time}</td><td><button onclick="deleteRow(this)">Delete</button></td>`;
    });
}

function deleteRow(button) {
    const row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);

    // Update the schedule after deletion
    saveSchedule();
}



function logout() {
    localStorage.removeItem('loggedInStudent'); // Remove login session data
    window.location.href = 'index.html'; // Redirect to login page
}
