document.addEventListener("DOMContentLoaded", function () {
    const deletePostBtn = document.getElementById("deletepost");
    const deleteModal = document.getElementById("delete-modal");
    const deleteModal2 = document.getElementById("delete-modal2");
    const confirmButton = document.getElementById("confirm-btn");
    const confirmButton2 = document.getElementById("confirm-btn2");
    const cancelButton = document.getElementById("cancel-btn");
    const cancelButton2 = document.getElementById("cancel-btn2");
    const commentList = document.getElementById("comments-list");
    const commentTexts = document.getElementById("comment-text");

    let postData = {
        title: "첫 번째 게시글",
        content: "어느 날, 한 소년은 작은 마을에서 살고 있었습니다. 그 마을은 아주 평화롭고 아름다운 곳이었지만, 소년은 항상 새로운 것에 대한 호기심이 넘쳤습니다. 그는 늘 마을 외곽의 숲을 탐험하며, 그곳에서 특별한 것을 발견하고 싶어 했습니다. 어느 날, 소년은 숲속 깊은 곳에서 반짝이는 빛을 발견하고, 그 빛을 따라가기로 결심했습니다.",
        image: "image.jpg",
        likes: 120,
        views: 10500,
        commentlist: [],
        date: "2024-02-19 12:30:00",
        profileImage: "default-profile.png",
        nickname: "사용자1"
    };

    function formatNumber(num) {
        return num >= 100000 ? `${Math.floor(num / 100000)}00k`
            : num >= 10000 ? `${Math.floor(num / 1000)}k`
            : num >= 1000 ? `${(num / 1000).toFixed(1)}k`
            : num;
    }

    function loadPost() {
        document.querySelector('.title').innerText = postData.title;
        document.querySelector('.nickname').innerText = postData.nickname;
        document.querySelector('.date').innerText = postData.date;
        document.querySelector('.post-content img').src = postData.image;
        document.querySelector('.post-content p').innerText = postData.content;
        document.getElementById('like-count').innerText = formatNumber(postData.likes);
        document.getElementById('view-count').innerText = formatNumber(postData.views);
        document.getElementById('comment-count').innerText = formatNumber(postData.commentlist.length);
    }

    loadPost();

    document.getElementById('like-btn').addEventListener('click', function () {
        if (this.style.backgroundColor === 'rgb(172, 160, 235)') {
            postData.likes--;
            this.style.backgroundColor = '#D9D9D9';
        } else {
            postData.likes++;
            this.style.backgroundColor = '#ACA0EB';
        }
        document.getElementById('like-count').innerText = postData.likes;
    });

    commentTexts.addEventListener('input', function () {
        const commentBtn = document.getElementById('comment-btn');
        commentBtn.disabled = this.value.trim() === "";
    });

    document.getElementById('comment-btn').addEventListener('click', function () {
        addComment();
    });

    // 댓글 추가
    function addComment() {
        const commentText = commentTexts.value;
        const commentItem = document.createElement('div');
        commentItem.classList.add('comment-item');
        
        commentItem.innerHTML = `
        <div class="post-meta" id="post-meta">
            <div class="profile-group">
                <span class="post-img"><img src="default-profile.png" alt="프로필"></span>
                <span class="nickname">사용자2</span> 
                <span class="date">2024-02-19 12:30:00</span>
            </div>
            <div class="btn-group">
                <button class="edit-btn" id="edit-btn">수정</button>
                <button class="delete-btn" id="deletecomment">삭제</button>
            </div>
        </div>
        <div class="comment-content" id="comment-content">${commentText}</div>
        `;
        
        commentList.appendChild(commentItem);
        commentTexts.value = '';
        document.getElementById('comment-btn').disabled = true;
    }

    // 댓글 수정
    function editComment(commentItem) {
        const commentTextElement = commentItem.querySelector('.comment-content'); 
        commentTexts.value = commentTextElement.innerText; 
        document.getElementById('comment-btn').innerText = '댓글 수정'; 

        const commentBtn = document.getElementById('comment-btn');

        // 기존에 설정된 이벤트 리스너를 제거하고 새 이벤트 설정
        commentBtn.replaceWith(commentBtn.cloneNode(true)); 
        const newCommentBtn = document.getElementById('comment-btn');

        newCommentBtn.onclick = function () {
            if (commentTexts.value.trim() !== "") {
                commentTextElement.innerText = commentTexts.value; 
            
                commentTexts.value = ''; 
                newCommentBtn.disabled = true; 
                newCommentBtn.innerText = '댓글 등록'; 
                newCommentBtn.onclick = addComment;
            }
        };
    }

    // 모달 열기/닫기
    function openDeleteModal2(commentItem) {
        if (deleteModal2) {
            deleteModal2.style.display = "flex";
            deleteModal2.commentItem = commentItem;  
        }
    }

    function closeDeleteModal2() {
        if (deleteModal2) deleteModal2.style.display = "none";
    }

    // 댓글 삭제 확인
    confirmButton2.addEventListener('click', function () {
        alert("댓글이 삭제되었습니다.");
        const commentItem = deleteModal2.commentItem; 
        commentItem.remove();  
        closeDeleteModal2();
        commentTexts.value = '';
        document.getElementById('comment-btn').disabled = true;
        document.getElementById('comment-btn').innerText = '댓글 등록';
    });

    cancelButton2.addEventListener('click', function () {
        closeDeleteModal2();
    });

    // 댓글 삭제 버튼 클릭 시 모달 열기
    commentList.addEventListener('click', function (event) {
        if (event.target && event.target.id === 'deletecomment') {
            const commentItem = event.target.closest('.comment-item');
            openDeleteModal2(commentItem);
        }

        if (event.target && event.target.id === 'edit-btn') {
            const commentItem = event.target.closest('.comment-item');
            editComment(commentItem);
        }
    });

    function openDeleteModal() {
        if (deleteModal) deleteModal.style.display = "flex";
    }

    function closeDeleteModal() {
        if (deleteModal) deleteModal.style.display = "none";
    }

    deletePostBtn.addEventListener('click', function () {
        openDeleteModal();
    });

    confirmButton.addEventListener('click', function () {
        alert("게시글이 삭제되었습니다.");
        closeDeleteModal();
        window.location.href = "posts.html";
    });

    cancelButton.addEventListener('click', function () {
        closeDeleteModal();
    });
});




