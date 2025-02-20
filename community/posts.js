document.addEventListener("DOMContentLoaded", function () {
    const postList = document.getElementById("post-list");
    const writeBtn = document.getElementById("write-btn");
    const sentinel = document.getElementById("sentinel");
    const dropdown = new DropdownMenu();
    
    dropdown.render("dropdown");
 
    const observerOptions = {
        root: postList,
        rootMargin: "100px",
        threshold: 0.1
    };

    let posts = [
        { title: "첫 번째 게시글", likes: 1200, comments: 15, views: 10500, date: "2024-02-19 12:30:00", profile: "../assets/image/커피.jpg", nickname: "사용자1" },
        { title: "두 번째 게시글", likes: 999, comments: 2, views: 500, date: "2024-02-18 14:10:00", profile: "../assets/image/커피.jpg", nickname: "사용자2" },
        { title: "세 번째 게시글", likes: 20500, comments: 100, views: 200000, date: "2024-02-17 09:45:00", profile: "../assets/image/커피.jpg", nickname: "사용자3" },
        { title: "네 번째 게시글", likes: 20500, comments: 100, views: 200000, date: "2024-02-17 09:45:00", profile: "../assets/image/커피.jpg", nickname: "사용자3" },
        { title: "다섯 번째 게시글", likes: 20500, comments: 100, views: 200000, date: "2024-02-17 09:45:00", profile: "../assets/image/커피.jpg", nickname: "사용자3" },
        { title: "여섯 번째 게시글", likes: 20500, comments: 100, views: 200000, date: "2024-02-17 09:45:00", profile: "../assets/image/커피.jpg", nickname: "사용자3" },
        { title: "일곱 번째 게시글", likes: 20500, comments: 100, views: 200000, date: "2024-02-17 09:45:00", profile: "../assets/image/커피.jpg", nickname: "사용자3" }
    ];

    let visiblePosts = 0;

    function formatNumber(num) {
        return num >= 100000 ? `${Math.floor(num / 100000)}00k`
            : num >= 10000 ? `${Math.floor(num / 1000)}k`
            : num >= 1000 ? `${(num / 1000).toFixed(1)}k`
            : num;
    }

    function truncateTitle(title, maxLength = 26) {
        return title.length > maxLength ? title.substring(0, maxLength) : title;
    }

    function renderPosts() {
        while (visiblePosts < posts.length) {
            const post = posts[visiblePosts];
            const postCard = document.createElement("div");
            postCard.classList.add("post-card");
            postCard.innerHTML = `
                <div class="post-title">${truncateTitle(post.title)}</div>
                <div class="post-info">
                    <span class="info-style">좋아요 ${formatNumber(post.likes)}</span>
                    <span class="info-style">댓글 ${formatNumber(post.comments)}</span>
                    <span>조회수 ${formatNumber(post.views)}</span>
                    <span style="float: right;">${post.date}</span>
                </div>
                <div class="post-divider"></div>
                <div class="comment-section">
                    <img src="${post.profile}" alt="프로필" class="comment-profile">
                    <span id="nickname">${post.nickname}</span>
                </div>
            `;
            postCard.addEventListener('click', function () {
                window.location.href = "viewpost.html";  // 클릭 시 상세 페이지로 이동
            });
            postList.insertBefore(postCard, sentinel);
            visiblePosts++;
            if (postList.offsetHeight > window.innerHeight) break;
        }
    }

    function loadMorePosts(entries) {
        if (entries[0].isIntersecting) {
            renderPosts();
        }
    }

    const observer = new IntersectionObserver(loadMorePosts, observerOptions);
    observer.observe(sentinel);

    renderPosts();

    writeBtn.addEventListener("click", function () {
        window.location.href = "makepost.html";
    });



});
