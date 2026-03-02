// const path = window.location.pathname;

// function initHomePage() {
//     const buttons = querySelectorAll(".icon-button");

//     buttons.forEach(button => {
//         button.addEventListener("click", () => {
//             const grade = button.dataset.grade;
//             window.location.href = `term.html?grade=${grade}`;
//         });
//     });
// }

// function initTermPage

// read grade clicked on
const params = new URLSearchParams(window.location.search);
const grade = params.get("grade");
const term = params.get("term");

console.log(grade);

fetch("data/lessons.json")
    .then(res => res.json())
    .then(data => {

    const gradeData = data.grades[grade];

    const container = document.getElementById("termsContainer");
    Object.keys(gradeData).forEach(term => {
      const div = document.createElement("div");
      div.textContent = term.toUpperCase();
      div.classList.add("icon-button");

      div.addEventListener("click", () => {
        window.location.href = `lesson.html?grade=${grade}&term=${term}`;
      });

      container.appendChild(div);
    });
});

document.querySelectorAll(".icon-button").forEach(button => {
    button.addEventListener("click", () => {
        const grade = button.dataset.grade;
        const term = "term1"; // default
        window.location.href = `term.html?grade=${grade}&term=${term}`;
    });
});

