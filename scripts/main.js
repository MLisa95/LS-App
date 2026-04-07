const path = window.location.pathname;
const backBtn = document.getElementById("backBtn");

// backBtn.addEventListener("click", () => {
//                 document.getElementById("lessonContent").style.display = "none";
//                 document.getElementById("topicsContainer").style.display = "flex";
//                 backBtn.style.display = "none";
//             });

function initHomePage() {
    const buttons = document.querySelectorAll(".icon-button");

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            const grade = button.dataset.grade;
            window.location.href = `term.html?grade=${grade}`;
        });
    });
}

function initTermPage() {
    const params = new URLSearchParams(window.location.search);
    const grade = params.get("grade");

    if (!grade) return;

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
                    window.location.href = `lessons.html?grade=${grade}&term=${term}`;
                });

                container.appendChild(div);
            });
        });
}

function initLessonsPage() {
    const params = new URLSearchParams(window.location.search);
    const grade = params.get("grade");
    const term = params.get("term");

    if (!grade || !term) return;

    fetch("data/lessons.json")
        .then(res => res.json())
        .then(data => {

            const topics = data.grades[grade][term];
            const container = document.getElementById("topicsContainer");
            const title = document.getElementById("lessonTitle");

            title.textContent = `Grade ${grade} - ${term.replace("term", "Term ")}`;

            topics.forEach(topic => {

                const div = document.createElement("div");
                div.textContent = topic.topic;
                div.classList.add("icon-button");

                div.addEventListener("click", () => {
                    loadLessonContent(topic.id);
                });

                container.appendChild(div);
            });
        });
}

function loadLessonContent(lessonId) {

    fetch("data/lessonContent.json")
        .then(res => res.json())
        .then(data => {

            const lesson = data.lessons[lessonId];

            const topicsContainer = document.getElementById("topicsContainer");
            const contentContainer = document.getElementById("lessonContent");
            const title = document.getElementById("lessonTitle");
            const backBtn = document.getElementById("backBtn");

            // hide topics
            topicsContainer.style.display = "none";

            // show content
            contentContainer.style.display = "block";
            backBtn.style.display = "block";

            contentContainer.innerHTML = ""; // clear old content

            title.textContent = lesson.title;
            const whiteboardBtn = document.createElement("button");
            whiteboardBtn.textContent = "🧠 Open Whiteboard";

            whiteboardBtn.addEventListener("click", () => {
                window.location.href = `whiteboard.html?lesson=${lessonId}`;
            });

            contentContainer.appendChild(whiteboardBtn);

            lesson.content.forEach(item => {

                if (item.type === "text") {
                    const p = document.createElement("p");
                    p.textContent = item.value;
                    contentContainer.appendChild(p);
                }

                if (item.type === "image" && item.src) {
                    const img = document.createElement("img");
                    img.src = item.src;
                    contentContainer.appendChild(img);

                    if (item.caption) {
                        const cap = document.createElement("p");
                        cap.textContent = item.caption;
                        contentContainer.appendChild(cap);
                    }
                }

            });
        });
}

function initWhiteboard() {
    const params = new URLSearchParams()
    const canvas = document.getElementById("whiteboard");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");

    // Resize canvas
    canvas.width = window.innerWidth * 0.7;
    canvas.height = window.innerHeight;

    let drawing = false;
    let tool = "pen";

    // 🎯 TOOL BUTTONS
    const penBtn = document.getElementById("penTool");
    const highlightBtn = document.getElementById("highlightTool");
    const eraserBtn = document.getElementById("eraserTool");

    if (penBtn) penBtn.onclick = () => tool = "pen";
    if (highlightBtn) highlightBtn.onclick = () => tool = "highlighter";
    if (eraserBtn) eraserBtn.onclick = () => tool = "eraser";

    function startDraw(e) {
        drawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY);
    }

    function draw(e) {
        if (!drawing) return;

        // 🧠 TOOL LOGIC
        if (tool === "pen") {
            ctx.globalAlpha = 1;
            ctx.strokeStyle = "black";
            ctx.lineWidth = 3;
            ctx.globalCompositeOperation = "source-over";
        }

        if (tool === "highlighter") {
            ctx.globalAlpha = 0.3;
            ctx.strokeStyle = "yellow";
            ctx.lineWidth = 15;
            ctx.globalCompositeOperation = "source-over";
        }

        if (tool === "eraser") {
            ctx.globalCompositeOperation = "destination-out";
            ctx.lineWidth = 20;
        }

        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
    }

    function stopDraw() {
        drawing = false;
    }

    canvas.addEventListener("mousedown", startDraw);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDraw);
    canvas.addEventListener("mouseleave", stopDraw);

    // 💾 SAVE BOARD (localStorage magic)
    function saveBoard() {
        const data = canvas.toDataURL();
        localStorage.setItem("whiteboard", data);
    }

    function loadBoard() {
        const saved = localStorage.getItem("whiteboard");
        if (!saved) return;

        const img = new Image();
        img.src = saved;
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
        };
    }

    canvas.addEventListener("mouseup", saveBoard);

    loadBoard();
}


if (path.includes("index.html") || path === "/") {
    initHomePage();
}

if (path.includes("term.html")) {
    initTermPage();
}

if (path.includes("lessons.html")) {
    initLessonsPage();
}

if (path.includes("whiteboard.html")) {
    initWhiteboard();
}

