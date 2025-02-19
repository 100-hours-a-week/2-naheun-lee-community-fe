// 게시글 데이터 정의 (임시 데이터)
const postData = {
    title: "첫 번째 게시글",
    content: "어느 날, 한 소년은 작은 마을에서 살고 있었습니다. 그 마을은 아주 평화롭고 아름다운 곳이었지만, 소년은 항상 새로운 것에 대한 호기심이 넘쳤습니다. 그는 늘 마을 외곽의 숲을 탐험하며, 그곳에서 특별한 것을 발견하고 싶어 했습니다. 어느 날, 소년은 숲속 깊은 곳에서 반짝이는 빛을 발견하고, 그 빛을 따라가기로 결심했습니다.",
    image: "image.jpg",
    likes: 120,
    views: 10500,
    comments: 2,
    commentlist: [
        { username: "사용자1", content: "정말 좋은 글이에요!" },
        { username: "사용자2", content: "잘 읽었습니다." }
    ],
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

// 게시글 정보 불러오기
function loadPost() {
    document.querySelector('.title').innerText = postData.title;
    document.querySelector('.nickname').innerText = postData.nickname;
    document.querySelector('.date').innerText = postData.date;
    document.querySelector('.post-content img').src = postData.image;
    document.querySelector('.post-content p').innerText = postData.content;
    
    // 통계 정보 업데이트
    document.getElementById('like-count').innerText = formatNumber(postData.likes);
    document.getElementById('view-count').innerText = formatNumber(postData.views);
    document.getElementById('comment-count').innerText = formatNumber(postData.comments);
}

// 페이지 로드 시 게시글 데이터 불러오기
window.onload = loadPost;

// 게시글 삭제 모달 열기
function openDeleteModal() {
    document.getElementById('delete-modal').style.display = 'flex';
}

// 게시글 삭제 모달 닫기
function closeDeleteModal() {
    document.getElementById('delete-modal').style.display = 'none';
}

// 게시글 삭제
function deletePost() {
    alert("게시글이 삭제되었습니다.");
    closeDeleteModal();
    // 여기에 게시글 삭제 로직을 추가
}

// 좋아요 버튼 클릭
document.getElementById('like-btn').addEventListener('click', function() {
    if (this.style.backgroundColor === 'rgb(172, 160, 235)') {
        postData.likes--;
        this.style.backgroundColor = '#D9D9D9';
    } else {
        postData.likes++;
        this.style.backgroundColor = '#ACA0EB';
    }
    document.getElementById('like-count').innerText = postData.likes;
});

// 댓글 등록 버튼 활성화
document.getElementById('comment-text').addEventListener('input', function() {
    const commentBtn = document.getElementById('comment-btn');
    if (this.value.trim() !== "") {
        commentBtn.disabled = false;
    } else {
        commentBtn.disabled = true;
    }
});

// 댓글 추가
function addComment() {
    const commentText = document.getElementById('comment-text').value;
    const commentList = document.getElementById('comments-list');
    
    const commentItem = document.createElement('div');
    commentItem.classList.add('comment-item');
    
    commentItem.innerHTML = `
        <div class="profile-img">
            <img src="default-profile.png" alt="프로필 이미지">
        </div>
        <div class="comment-text">${commentText}</div>
        <button class="edit-btn" onclick="editComment(this)">수정</button>
        <button class="delete-btn" onclick="deleteComment(this)">삭제</button>
    `;
    
    commentList.appendChild(commentItem);
    document.getElementById('comment-text').value = '';
    document.getElementById('comment-btn').disabled = true;
}

// 댓글 수정
function editComment(button) {
    const commentText = button.parentElement.querySelector('.comment-text');
    document.getElementById('comment-text').value = commentText.innerText;
    document.getElementById('comment-btn').innerText = '댓글 수정';
    document.getElementById('comment-btn').onclick = function() {
        commentText.innerText = document.getElementById('comment-text').value;
        document.getElementById('comment-btn').innerText = '댓글 등록';
        document.getElementById('comment-btn').onclick = addComment;
    };
}

// 댓글 삭제
function deleteComment(button) {
    if (confirm("댓글을 삭제하시겠습니까?")) {
        button.parentElement.remove();
    }
}
