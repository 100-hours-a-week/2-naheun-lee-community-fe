document.addEventListener("DOMContentLoaded", function () {
    let postData ={
        title: "첫 번째 게시글",
        content: "어느 날, 한 소년은 작은 마을에서 살고 있었습니다. 그 마을은 아주 평화롭고 아름다운 곳이었지만, 소년은 항상 새로운 것에 대한 호기심이 넘쳤습니다. 그는 늘 마을 외곽의 숲을 탐험하며, 그곳에서 특별한 것을 발견하고 싶어 했습니다. 어느 날, 소년은 숲속 깊은 곳에서 반짝이는 빛을 발견하고, 그 빛을 따라가기로 결심했습니다.",
        image: "image.jpg",
    };
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const fileInput = document.getElementById("image");
    const fileNameDisplay = document.getElementById("file-name");
    const writeBtn = document.getElementById("write-btn");
    const contentHelper = document.getElementById("content-helper");

    titleInput.value = postData.title;
    contentInput.value = postData.content;
    fileInput.src = postData.image;
    fileNameDisplay.textContent = postData.image;

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
        } else {
            contentHelper.textContent = ""; 
            contentHelper.classList.remove("visible");
        }
    }

    writeBtn.addEventListener("click", function (){
        alert("게시글이 수정되었습니다.");
        window.location.href = "viewpost.html"
    });
});