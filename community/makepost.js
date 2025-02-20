document.addEventListener("DOMContentLoaded", function () {
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const fileInput = document.getElementById("image");
    const fileNameDisplay = document.getElementById("file-name");
    const writeBtn = document.getElementById("write-btn");
    const contentHelper = document.getElementById("content-helper");

    titleInput.addEventListener("input", function () {
        if (this.value.length > 26) {
            this.value = this.value.slice(0, 26); 
        }
        validateForm();
    });

    contentInput.addEventListener("input", validateForm);

    fileInput.addEventListener("change", function () {
        fileNameDisplay.textContent = this.files.length > 0 ? this.files[0].name : "파일을 선택하세요.";
    });

    function validateForm() {
        const isTitleFilled = titleInput.value.trim().length > 0;
        const isContentFilled = contentInput.value.trim().length > 0;

        if (!isTitleFilled || !isContentFilled) {
            contentHelper.textContent = "제목, 내용을 모두 작성해주세요"; 
            contentHelper.classList.add("visible");
            writeBtn.disabled = true;
            writeBtn.style.backgroundColor = "#ACA0EB"; 
        } else {
            contentHelper.textContent = ""; 
            contentHelper.classList.remove("visible");
            writeBtn.disabled = false;
            writeBtn.style.backgroundColor = "#7F6AEE"; 
        }
    }

    writeBtn.addEventListener("click", function (){
        alert("게시글이 등록되었습니다.");
        window.location.href = "posts.html"
    });
});
