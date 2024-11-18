const groupFilter = document.querySelector(".group-filter");
const groupSelect = document.querySelector("#group");
const addStudentBtn = document.querySelector(".add-student-btn");
const openModalBtn = document.querySelector(".open-modal-btn");
const studentForm = document.querySelector(".student-form");
const studentModal = document.querySelector("#studentModal");
const studentTable = document.querySelector(".student-table tbody");
const studentModalTitle = document.querySelector("#studentModalLabel");
const searchInput = document.querySelector(".search-input");

let groups = ["REACT N12", "REACT N11", "REACT N13", "REACT N15"];

const STUDENTS = "students";
const STUDENT_GROUP = "student_group";

let studentsJSON = localStorage.getItem(STUDENTS);
let students = JSON.parse(studentsJSON) || [];

let selected = null;
let group = localStorage.getItem(STUDENT_GROUP) || "all";

let search = "";

function getStudentRow({ firstName, lastName, group, doesWork }, i) {
  return `
    <tr>
      <td>${i + 1}</td>
      <td>${firstName}</td>
      <td>${lastName}</td>
      <td>${group}</td>
      <td>${doesWork ? "Yes" : "No"}</td>
      <td>
        <button class="edit-btn" onclick="editStudent(${i})">Edit</button>
        <button class="delete-btn" onclick="deleteStudent(${i})">Delete</button>
      </td>
    </tr>
  `;
}

function getStudents() {
  studentTable.innerHTML = "";

  let result = students.filter(
    (student) =>
      student.firstName.toLowerCase().includes(search) ||
      student.lastName.toLowerCase().includes(search)
  );

  if (group !== "all") {
    result = students.filter((student) => student.group === group);
  }

  result.forEach((student, i) => {
    studentTable.innerHTML += getStudentRow(student, i);
  });
}

getStudents();

function getGroupOption(gr) {
  return `<option ${gr === group ? "selected" : ""} value="${gr}">${gr}</option>`;
}

groupFilter.innerHTML = `<option value='all'>All</option>`;

let groupOptions = "";

groups.forEach((group) => {
  groupOptions += getGroupOption(group);
});

groupFilter.innerHTML += groupOptions;
groupSelect.innerHTML = groupOptions;

studentForm.addEventListener("submit", function (event) {
  event.preventDefault();
  let checkForm = studentForm.checkValidity();
  if (checkForm) {
    let firstName = studentForm.elements.firstName.value;
    let lastName = studentForm.elements.lastName.value;
    let group = studentForm.elements.group.value;
    let doesWork = studentForm.elements.doesWork.checked;

    let student = { firstName, lastName, group, doesWork };

    if (selected === null) {
      students.push(student);
    } else {
      students = students.map((el, i) => (i === selected ? student : el));
    }

    localStorage.setItem(STUDENTS, JSON.stringify(students));

    getStudents();

    studentModal.style.display = "none";
  } else {
    studentForm.classList.add("was-validated");
  }
});

openModalBtn.addEventListener("click", function () {
  addStudentBtn.textContent = "Add";
  studentModalTitle.textContent = "Adding student";

  studentForm.elements.firstName.value = "";
  studentForm.elements.lastName.value = "";
  studentForm.elements.group.value = groups[0];
  studentForm.elements.doesWork.checked = false;

  studentModal.style.display = "flex";
});

function editStudent(i) {
  selected = i;

  addStudentBtn.textContent = "Save";
  studentModalTitle.textContent = "Editing student";

  let { firstName, lastName, group, doesWork } = students[i];

  studentForm.elements.firstName.value = firstName;
  studentForm.elements.lastName.value = lastName;
  studentForm.elements.group.value = group;
  studentForm.elements.doesWork.checked = doesWork;

  studentModal.style.display = "flex";
}

function deleteStudent(i) {
  let doesConfirm = confirm("Do you want to delete this student?");
  if (doesConfirm) {
    students = students.filter((_, index) => index !== i);
    localStorage.setItem(STUDENTS, JSON.stringify(students));
    getStudents();
  }
}

groupFilter.addEventListener("change", function () {
  group = this.value;
  localStorage.setItem(STUDENT_GROUP, group);
  getStudents();
});

searchInput.addEventListener("keyup", function () {
  search = this.value.trim().toLowerCase();
  getStudents();
});
