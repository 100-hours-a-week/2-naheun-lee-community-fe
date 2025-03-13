import { getPosts, getUserById } from "../api/info.js"; 

document.addEventListener("DOMContentLoaded", async function () {
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

    let posts = [];
    try {
        posts = await getPosts();
    } catch (error) {
        console.error("게시글 데이터를 불러오는 중 오류 발생:", error);
    }

    let visiblePosts = 0;

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

    function truncateTitle(title, maxLength = 26) {
        return title.length > maxLength ? title.substring(0, maxLength) : title;
    }

    async function renderPosts() {
        while (visiblePosts < posts.length) {
            const post = posts[visiblePosts];
            const postCard = document.createElement("div");
            postCard.classList.add("post-card");
            const author = await getUserById(post.author);
            postCard.innerHTML = `
                <div class="post-title">${truncateTitle(post.title)}</div>
                <div class="post-info">
                    <span class="info-style">좋아요 ${formatNumber(post.likes)}</span>
                    <span class="info-style">댓글 ${formatNumber(post.comments.length)}</span>
                    <span>조회수 ${formatNumber(post.views)}</span>
                    <span style="float: right;">${formatDate(post.created_at)}</span>
                </div>
                <div class="post-divider"></div>
                <div class="comment-section">
                    <img src="${author.profile.img}" alt="프로필" class="comment-profile">
                    <span id="nickname">${author.profile.nickname}</span>
                </div>
            `;
            postCard.addEventListener('click', function () {
                window.location.href = "viewpost.html?postid=" + post.id;
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
