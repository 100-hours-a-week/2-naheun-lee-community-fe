import { getPostInfo } from "../api/info.js";
import { addAPIComment, editAPIComment, deleteAPIComment, addLike, removeLike, deletePost } from "../api/postService.js";
import { BASE_URL } from "../assets/config/config.js";

document.addEventListener("DOMContentLoaded", async function () {
    const editBtn =  document.getElementById("editbtn");
    const deletePostBtn = document.getElementById("deletebtn");
    const deleteModal = document.getElementById("delete-modal");
    const deleteModal2 = document.getElementById("delete-modal2");
    const confirmButton = document.getElementById("confirm-btn");
    const confirmButton2 = document.getElementById("confirm-btn2");
    const cancelButton = document.getElementById("cancel-btn");
    const cancelButton2 = document.getElementById("cancel-btn2");
    const commentList = document.getElementById("comments-list");
    const commentTextArea = document.getElementById("comment-text");
    const likeBtn = document.getElementById("like-btn");
    const commentBtn = document.getElementById("comment-btn");
    const dropdown = new DropdownMenu();
    
    dropdown.render("dropdown");

    const params = new URLSearchParams(window.location.search);
    const postId = params.get("postId");
    if (!postId) {
        console.error("postid가 전달되지 않았습니다.");
        window.location.href = "posts.html";
        return;
    }

    const result = await getPostInfo(Number(postId));
    if (!result.success) {
        console.error("게시글 데이터를 불러올 수 없습니다.");
        alert(result.message);
        return;
    }

    let postData = result.data;

    function formatNumber(num) {
        return num >= 100000 ? `${Math.floor(num / 100000)}00k`
            : num >= 10000 ? `${Math.floor(num / 1000)}k`
            : num >= 1000 ? `${(num / 1000).toFixed(1)}k`
            : num;
    }

    // 게시글 정보 렌더링
    function renderPost() {
        document.querySelector('.title').innerText = postData.title;
        const isActiveUser = postData.user.active;
        const profileImgUrl = isActiveUser ? `${BASE_URL}${postData.user.profileImgUrl}` : `${BASE_URL}/profileuploads/default-profile.png`;
        const nickname = isActiveUser ? postData.user.nickname : "(알 수 없음)";
        document.querySelector('.nickname').innerText = nickname|| "작성자";
        document.querySelector('.post-img img').src = profileImgUrl || "이미지";
        document.querySelector('.date').innerText = postData.createdAt;
        const postImgElement = document.querySelector('.post-content img');
        if (postData.postImgUrl) {
            if (postImgElement) {
                postImgElement.src = `${BASE_URL}${postData.postImgUrl}`;
                postImgElement.style.display = "block"; 
            }
        } else {
            if (postImgElement) postImgElement.remove(); 
        }
        document.querySelector('.post-content p').innerText = postData.content;
        document.getElementById('like-count').innerText = formatNumber(postData.likesCount);
        document.getElementById('view-count').innerText = formatNumber(postData.views);
        document.getElementById('comment-count').innerText = formatNumber(postData.commentsCount);
        if (postData.likedByCurrentUser ) {
            likeBtn.classList.add("liked");
        } else {
            likeBtn.classList.remove("liked");
        }
        renderComments();
    }
    renderPost();

    // 댓글 목록 렌더링
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
            };
        }
    }

    // 게시글 수정 페이지로 이동
    editBtn.addEventListener('click', function () {
        window.location.href = "editpost.html?postId=" + postId;
    });
    
    // 좋아요 추가/취소 처리(이벤트 위임 방식)
    document.body.addEventListener("click", async function (e) {
        const likeBtn = e.target.closest("#like-btn");
        if (!likeBtn) return; 

        let result;

        if (likeBtn.classList.contains("liked")) {
            result = await removeLike(Number(postId));
        } else {
            result = await addLike(Number(postId));
        }

        if (result.success) {
            const updatedResult = await getPostInfo(Number(postId));
            if (updatedResult.success) {
                postData = updatedResult.data;
                renderPost(); 
            }
        } else {
            alert(result.message);
        }
    });

    // 게시글 삭제 모달
    deletePostBtn.addEventListener("click", function () {
        deleteModal.style.display = "flex";
    });
    cancelButton.addEventListener('click', function () {
        deleteModal.style.display = "none";
    });
    confirmButton.addEventListener('click', async function () {
        const result = await deletePost(Number(postId));
        if (result.success) {
            alert("게시글이 삭제되었습니다.");
            deleteModal.style.display = "none";
            window.location.href = "posts.html";
        } else {
            alert(result.message);
        }
    });

    // 댓글 입력 활성화
    commentTextArea.addEventListener('input', function () {
        commentBtn.disabled = commentTextArea.value.trim() === "";
    });


    let isEditing = false;
    let editingCommentId = null;

    // 댓글 버튼 이벤트
    commentBtn.addEventListener("click", async function () {
        if (isEditing) {
            await updateComment();
        } else {
            await addComment();
        }
    });

    // 댓글 등록 함수
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

    // 댓글 수정 함수
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

    // 댓글 수정/삭제 이벤트
    commentList.addEventListener("click", function (e) {
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
            openDeleteModal2(commentId);
        }
    });

    // 댓글 상태 초기화 함수
    function resetCommentState() {
        isEditing = false;
        editingCommentId = null;
        commentTextArea.value = "";
        commentBtn.innerText = "댓글 등록";
        commentBtn.disabled = true;
    }

    // 댓글 삭제 모달 
    let selectedCommentId = null;
    function openDeleteModal2(commentId) {
        selectedCommentId = commentId;
        deleteModal2.style.display = "flex";
    }
    function closeDeleteModal2() {
        deleteModal2.style.display = "none";
        selectedCommentId = null;
    }
    cancelButton2.addEventListener("click", function () {
        closeDeleteModal2();
    });
    confirmButton2.addEventListener("click", async function () {
        if (!selectedCommentId) return;
    
        const result = await deleteAPIComment(Number(postId), selectedCommentId);
        if (result.success) {
            const updatedResult = await getPostInfo(Number(postId));
            if (updatedResult.success) {
                postData = updatedResult.data;
                renderPost();
                closeDeleteModal2();
            }
        } else {
            alert(result.message);
        }
    });

});