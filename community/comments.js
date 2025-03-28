import { getPostInfo } from "../api/info.js";
import { addAPIComment, editAPIComment, deleteAPIComment } from "../api/postService.js";
import { BASE_URL } from "../assets/config/config.js";

export function initComments(postData, postId, renderPost) {
    const commentList = document.getElementById("comments-list");
    const commentTextArea = document.getElementById("comment-text");
    const commentBtn = document.getElementById("comment-btn");
    const deleteModal2 = document.getElementById("delete-modal2");
    const cancelButton2 = document.getElementById("cancel-btn2");
    const confirmButton2 = document.getElementById("confirm-btn2");

    let isEditing = false;
    let editingCommentId = null;
    let selectedCommentId = null;

    function renderComments() {
        commentList.innerHTML = "";
        if (postData.comments && postData.commentsCount > 0) {
            for (const comment of postData.comments) {
                const isActiveUser = comment.user.active;
                const commentImgUrl = isActiveUser ? `${BASE_URL}${comment.user.profileImgUrl}` : `${BASE_URL}/profileuploads/default-profile.png`;
                const nickname = isActiveUser ? comment.user.nickname : "(알 수 없음)";
                const commentItem = document.createElement("div");
                commentItem.classList.add("comment-item");
                commentItem.setAttribute("data-commentId", comment.commentId);
                commentItem.innerHTML = `
                    <div class="comment-meta">
                        <div class="profile-group">
                            <span class="comment-img"><img src="${commentImgUrl}" alt="프로필"></span>
                            <span class="nickname">${nickname}</span>
                            <span class="date">${comment.createdAt}</span>
                        </div>
                        <div class="btn-group">
                            <button class="edit-btn">수정</button>
                            <button class="delete-btn">삭제</button>
                        </div>
                    </div>
                    <div class="comment-content">${comment.content}</div>
                `;
                commentList.appendChild(commentItem);
            }
        }
    }

    function resetCommentState() {
        isEditing = false;
        editingCommentId = null;
        commentTextArea.value = "";
        commentBtn.innerText = "댓글 등록";
        commentBtn.disabled = true;
    }

    async function addComment() {
        const text = commentTextArea.value.trim();
        if (text === "") return;

        const result = await addAPIComment(Number(postId), text);
        if (result.success) {
            const updatedResult = await getPostInfo(Number(postId));
            if (updatedResult.success) {
                postData = updatedResult.data;
                renderPost();
                resetCommentState();
            }
        } else {
            alert(result.message);
        }
    }

    async function updateComment() {
        const newText = commentTextArea.value.trim();
        if (newText === "" || editingCommentId === null) return;

        const result = await editAPIComment(Number(postId), editingCommentId, newText);
        if (result.success) {
            const updatedResult = await getPostInfo(Number(postId));
            if (updatedResult.success) {
                postData = updatedResult.data;
                renderPost();
                resetCommentState();
            }
        } else {
            alert(result.message);
        }
    }

    async function deleteComment() {
        const result = await deleteAPIComment(Number(postId), selectedCommentId);
        if (result.success) {
            const updatedResult = await getPostInfo(Number(postId));
            if (updatedResult.success) {
                postData = updatedResult.data;
                renderPost();
                deleteModal2.style.display = "none";
            }
        } else {
            alert(result.message);
        }
    }

    commentBtn.addEventListener("click", () => {
        isEditing ? updateComment() : addComment();
    });

    commentTextArea.addEventListener("input", () => {
        commentBtn.disabled = commentTextArea.value.trim() === "";
    });

    commentList.addEventListener("click", (e) => {
        const target = e.target;
        const commentItem = target.closest(".comment-item");
        if (!commentItem) return;
        const commentId = Number(commentItem.getAttribute("data-commentId"));

        if (target.classList.contains("edit-btn")) {
            const commentTextElement = commentItem.querySelector(".comment-content");
            commentTextArea.value = commentTextElement.innerText;
            isEditing = true;
            editingCommentId = commentId;
            commentBtn.innerText = "댓글 수정";
            commentBtn.disabled = false;
        } else if (target.classList.contains("delete-btn")) {
            selectedCommentId = commentId;
            deleteModal2.style.display = "flex";
        }
    });

    cancelButton2.addEventListener("click", () => {
        deleteModal2.style.display = "none";
        selectedCommentId = null;
    });

    confirmButton2.addEventListener("click", deleteComment);

    renderComments();
}
