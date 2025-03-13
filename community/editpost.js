import { getPostById } from "../api/info.js";
import { updatePost } from "../api/postService.js";

document.addEventListener("DOMContentLoaded", async function () {
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const fileInput = document.getElementById("image");
    const fileNameDisplay = document.getElementById("file-name");
    const writeBtn = document.getElementById("write-btn");
    const contentHelper = document.getElementById("content-helper");
    const dropdown = new DropdownMenu();
    
    dropdown.render("dropdown");

    const params = new URLSearchParams(window.location.search);
    const postId = params.get("postid");
    if (!postId) {
        console.error("postid가 전달되지 않았습니다.");
        window.location.href = "posts.html";
        return;
    }

    let postData = await getPostById(Number(postId));
    if (!postData) {
        alert("게시글 정보를 불러올 수 없습니다.");
        window.location.href = "posts.html";
        return;
    }

    titleInput.value = postData.title;
    contentInput.value = postData.content;
    fileInput.src = postData.image;
    fileNameDisplay.textContent = postData.img ? postData.img : "파일을 선택하세요.";

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

        const title = titleInput.value.trim();
        const content = contentInput.value.trim();
        const file = fileInput.files[0]; 

        const result = await updatePost(Number(postId), title, content, file);

        if (result.success) {
            alert("게시글이 수정되었습니다.");
            window.location.href = `viewpost.html?postid=${postId}`; 
        } else {
            alert(result.message); 
        }
    });
});