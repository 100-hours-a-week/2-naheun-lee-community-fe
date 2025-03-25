import { getPostInfo } from "../api/info.js";
import { updatePost } from "../api/postService.js";

document.addEventListener("DOMContentLoaded", async function () {
    const backBtn = document.querySelector(".back-btn");
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const fileInput = document.getElementById("image");
    const fileNameDisplay = document.getElementById("file-name");
    const writeBtn = document.getElementById("write-btn");
    const contentHelper = document.getElementById("content-helper");
    const dropdown = new DropdownMenu();
    
    dropdown.render("dropdown");

    const params = new URLSearchParams(window.location.search);
    const postId = params.get("postId");
    if (!postId) {
        console.error("postid가 전달되지 않았습니다.");
        window.location.href = "posts.html";
        return;
    }

    backBtn.addEventListener("click", function () {
        window.location.href = `viewpost.html?postId=${postId}`; 
    });

    const result = await getPostInfo(Number(postId));
    if (!result.success) {
        console.error("게시글 데이터를 불러올 수 없습니다.");
        alert(result.message);
        return;
    }

    let postData = result.data;

    // 원본 값 저장
    const originalTitle = postData.title;
    const originalContent = postData.content;

    titleInput.value = originalTitle 
    contentInput.value = originalContent;
    fileInput.src = postData.postImg;
    fileNameDisplay.textContent = postData.postImg ? postData.postImg : "파일을 선택하세요.";

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

    // 게시글 수정
    writeBtn.addEventListener("click", async function (event) {
        event.preventDefault();

        const currentTitle = titleInput.value.trim();
        const currentContent = contentInput.value.trim();
        const imageFile = fileInput.files[0];

        const updateData = {};
        if (currentTitle !== originalTitle) {
            updateData.title = currentTitle;
        }
        if (currentContent !== originalContent) {
            updateData.content = currentContent;
        }
        if (imageFile) {
            updateData.image = imageFile;
        }

        if (Object.keys(updateData).length === 0) {
            alert("수정된 내용이 없습니다.");
            return;
        }

        const result = await updatePost(Number(postId), updateData);

        if (result.success) {
            alert("게시글이 수정되었습니다.");
            window.location.href = `viewpost.html?postId=${postId}`; 
        } else {
            alert(result.message); 
        }
    });
});