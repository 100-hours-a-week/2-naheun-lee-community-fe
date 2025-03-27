import { getPostInfo } from "../api/info.js";
import { updatePost, deletePostImage } from "../api/postService.js";
import { CustomAlert } from "../assets/component/CustomAlert.js";

document.addEventListener("DOMContentLoaded", async function () {
    const backBtn = document.querySelector(".back-btn");
    const titleInput = document.getElementById("title");
    const contentInput = document.getElementById("content");
    const fileInput = document.getElementById("image");
    const fileNameDisplay = document.getElementById("file-name");
    const editBtn = document.getElementById("edit-btn");
    const contentHelper = document.getElementById("content-helper");
    const deleteImgBtn = document.getElementById("delete-img-btn");
    const header = document.querySelector("header-component");

    const alertBox = new CustomAlert();

    const params = new URLSearchParams(window.location.search);
    const postId = params.get("postId");
    if (!postId) {
        console.error("postid가 전달되지 않았습니다.");
        window.location.href = "posts.html";
        return;
    }

    if (header && postId) {
        header.setAttribute("back-path", `../community/viewpost.html?postId=${postId}`);
    }

    let postData = null;
    let selectedFile = null;

    function getOriginalFileName(url) {
        return url?.split("_")[1] || "";
    }

    async function loadPostData() {
        const result = await getPostInfo(Number(postId));
        if (!result.success) {
            alert(result.message);
            return;
        }

        postData = result.data;

        titleInput.value = postData.title;
        contentInput.value = postData.content;

        const fileName = postData.postImgUrl ? getOriginalFileName(postData.postImgUrl) : "파일을 선택하세요.";
        updateFileNameDisplay(fileName, !!postData.postImgUrl);

        validateForm();
    }

    function updateFileNameDisplay(fileName, showDelete = false) {
        fileNameDisplay.textContent = fileName;
        deleteImgBtn.style.display = showDelete ? "inline" : "none";
    }

    await loadPostData();

    titleInput.addEventListener("input", function () {
        if (this.value.length > 26) {
            this.value = this.value.slice(0, 26);
        }
        validateForm();
    });

    contentInput.addEventListener("input", validateForm);

    fileInput.addEventListener("change", function () {
        if (this.files.length > 0) {
            selectedFile = this.files[0];
            updateFileNameDisplay(selectedFile.name, false); 
        } else {
            selectedFile = null;
            const fallbackName = postData.postImgUrl ? getOriginalFileName(postData.postImgUrl) : "파일을 선택하세요.";
            updateFileNameDisplay(fallbackName, !!postData.postImgUrl);
        }
    });

    function validateForm() {
        const isTitleFilled = titleInput.value.trim().length > 0;
        const isContentFilled = contentInput.value.trim().length > 0;

        if (!isTitleFilled || !isContentFilled) {
            contentHelper.textContent = "제목, 내용을 모두 작성해주세요";
            contentHelper.classList.add("visible");
            editBtn.disabled = true;
            editBtn.style.backgroundColor = "#ACA0EB";
        } else {
            contentHelper.textContent = "";
            contentHelper.classList.remove("visible");
            editBtn.disabled = false;
            editBtn.style.backgroundColor = "#7F6AEE";
        }
    }

    // 게시글 삭제
    editBtn.addEventListener("click", async function (event) {
        event.preventDefault();

        const currentTitle = titleInput.value.trim();
        const currentContent = contentInput.value.trim();

        const updateData = {};
        if (currentTitle !== postData.title) updateData.title = currentTitle;
        if (currentContent !== postData.content) updateData.content = currentContent;
        if (selectedFile) updateData.postImage = selectedFile;

        if (Object.keys(updateData).length === 0) {
            alertBox.show("알림", "수정된 내용이 없습니다.");
            return;
        }

        const result = await updatePost(Number(postId), updateData);

        if (result.success) {
            alertBox.show("성공", "게시글이 수정되었습니다.");
            window.location.href = `viewpost.html?postId=${postId}`;
        } else {
            alert(result.message);
        }
    });

    // 게시글 이미지 삭제
    deleteImgBtn.addEventListener("click", async function () {
        const result = await deletePostImage(postId);
        if (result.success) {
            alert("이미지가 삭제되었습니다.");
            fileInput.value = "";
            selectedFile = null;
            await loadPostData();
        } else {
            alert(result.message);
        }
    });
});
