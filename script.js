
let students = JSON.parse(
    localStorage.getItem("students")
) || [];

let attendance = JSON.parse(
    localStorage.getItem("attendance")
) || {};

let status = {};

document.getElementById("date").value =
    new Date().toLocaleDateString("en-CA");

function addStudent() {
    let roll = document.getElementById("roll").value.trim();
    let name = document.getElementById("name").value.trim();

    if (!roll || !name) {
        alert("Enter all student details!");
        return;
    }

    if (students.some(s => s.roll === roll)) {
        alert("Roll number already exists!");
        return;
    }

    students.push({ roll, name });

    localStorage.setItem("students", JSON.stringify(students));

    document.getElementById("roll").value = "";
    document.getElementById("name").value = "";

    showStudents();
    updateDashboard();
}

function showStudents() {
    let list = document.getElementById("studentList");
    list.innerHTML = "";

    students.forEach(s => {
        let div = document.createElement("div");
        div.className = "student";

        let info = document.createElement("span");
        info.textContent = s.roll + " - " + s.name;

        let actions = document.createElement("div");

        ["Present", "Absent"].forEach(value => {
            let btn = document.createElement("button");
            btn.textContent = value;
            btn.className = value === "Present"
                ? "present-btn" : "absent-btn";

            btn.onclick = () => {
                status[s.roll] = value;
                btn.parentElement.querySelectorAll("button")
                    .forEach(b => b.style.opacity = "0.5");
                btn.style.opacity = "1";
            };

            actions.appendChild(btn);
        });

        div.appendChild(info);
        div.appendChild(actions);
        list.appendChild(div);
    });
}

function saveAttendance() {
    let date = document.getElementById("date").value;

    if (!date) {
        alert("Select a date!");
        return;
    }

    if (students.length === 0) {
        alert("Add students first!");
        return;
    }

    if (!students.every(s => status[s.roll])) {
        alert("Mark attendance for every student!");
        return;
    }

    attendance[date] = { ...status };

    localStorage.setItem(
        "attendance", JSON.stringify(attendance)
    );

    alert("Attendance saved successfully!");

    updateDashboard();
    showRecords();
}

function updateDashboard() {
    let date = document.getElementById("date").value;
    let today = attendance[date] || {};

    let p = Object.values(today).filter(
        v => v === "Present"
    ).length;

    let a = Object.values(today).filter(
        v => v === "Absent"
    ).length;

    document.getElementById("total").textContent =
        students.length;

    document.getElementById("present").textContent = p;
    document.getElementById("absent").textContent = a;
}

function showRecords() {
    let records = document.getElementById("records");
    records.innerHTML = "";

    Object.keys(attendance).sort().reverse().forEach(date => {
        let p = Object.values(attendance[date]).filter(
            v => v === "Present"
        ).length;

        let a = Object.values(attendance[date]).filter(
            v => v === "Absent"
        ).length;

        let div = document.createElement("p");
        div.textContent =
            date + " | Present: " + p + " | Absent: " + a;

        records.appendChild(div);
    });
}

document.getElementById("date").addEventListener(
    "change", () => {
        status = { ...(attendance[
            document.getElementById("date").value
        ] || {}) };

        updateDashboard();
        showRecords();
    }
);

// Initial display
status = { ...(attendance[
    document.getElementById("date").value
] || {}) };

showStudents();
updateDashboard();
showRecords();
