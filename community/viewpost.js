import { getPostById, getUserById } from "../api/info.js";
import { addAPIComment, editAPIComment, deleteAPIComment, addLike, removeLike, deletePost } from "../api/postService.js";

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
    const postId = params.get("postid");
    if (!postId) {
        console.error("postid가 전달되지 않았습니다.");
        window.location.href = "posts.html";
        return;
    }

    let postData = await getPostById(Number(postId));
    if (!postData) {
        console.error("게시글 데이터를 불러올 수 없습니다.");
        return;
    }

    const authorData = await getUserById(postData.author);

    function formatNumber(num) {
        return num >= 100000 ? `${Math.floor(num / 100000)}00k`
            : num >= 10000 ? `${Math.floor(num / 1000)}k`
            : num >= 1000 ? `${(num / 1000).toFixed(1)}k`
            : num;
    }

    function formatDate(isoString) {
        const date = new Date(isoString);
        return new Intl.DateTimeFormat("ko-KR", {
            year: "numeric",
            month: "long", 
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false
        }).format(date);
    }

    // 게시글 정보 로드
    function loadPost() {
        document.querySelector('.title').innerText = postData.title;
        document.querySelector('.nickname').innerText = authorData ? authorData.profile.nickname : "작성자";
        document.querySelector('.post-img img').src = authorData ? authorData.profile.img : "이미지";
        document.querySelector('.date').innerText = formatDate(postData.created_at);
        document.querySelector('.post-content img').src = postData.img;
        document.querySelector('.post-content p').innerText = postData.content;
        document.getElementById('like-count').innerText = formatNumber(postData.likes);
        document.getElementById('view-count').innerText = formatNumber(postData.views);
        document.getElementById('comment-count').innerText = formatNumber(postData.comments ? postData.comments.length : 0);
    }
    loadPost();

    // 댓글 목록 렌더링
    async function renderComments() {
        commentList.innerHTML = "";
        if (postData.comments && postData.comments.length > 0) {
            for (const comment of postData.comments) { 
                let commentUser = await getUserById(comment.userId);

                const commentItem = document.createElement("div");
                commentItem.classList.add("comment-item");
                commentItem.setAttribute("data-commentid", comment.id);
                commentItem.innerHTML = `
                    <div class="post-meta">
                        <div class="profile-group">
                            <span class="comment-img"><img src="${commentUser?.profile?.img}" alt="프로필"></span>
                            <span class="nickname">${commentUser?.profile?.nickname}</span>
                            <span class="date">${formatDate(comment.created_at)}</span>
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
    await renderComments();

    // 게시글 수정 페이지로 이동
    editBtn.addEventListener('click', function () {
        window.location.href = "editpost.html?postid=" + postId;
    });

    // 좋아요 추가/취소
    likeBtn.addEventListener("click", async function () {
        if (likeBtn.classList.contains("liked")) {
            const result = await removeLike(Number(postId));
            if (result.success) {
                postData.likes--;
                likeBtn.classList.remove("liked");
            } else {
                alert(result.message);
            }
        } else {
            const result = await addLike(Number(postId));
            if (result.success) {
                postData.likes++;
                likeBtn.classList.add("liked");
            } else {
                alert(result.message);
            }
        }
        document.getElementById('like-count').innerText = formatNumber(postData.likes);
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
            if (!postData.comments) postData.comments = [];
            postData.comments.push(result.data);
            renderComments();
            resetCommentState();
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
            postData.comments.find(c => c.id === editingCommentId).content = newText;
            renderComments();
            resetCommentState();
        } else {
            alert(result.message);
        }
    }

    // 댓글 수정/삭제 이벤트
    commentList.addEventListener("click", function (e) {
        const target = e.target;
        const commentItem = target.closest(".comment-item");
        if (!commentItem) return;
        const commentId = Number(commentItem.getAttribute("data-commentid"));

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
            postData.comments = postData.comments.filter(c => c.id !== selectedCommentId);
            renderComments();
            document.getElementById('comment-count').innerText = formatNumber(postData.comments.length);
            closeDeleteModal2();
        } else {
            alert(result.message);
        }
    });

});




