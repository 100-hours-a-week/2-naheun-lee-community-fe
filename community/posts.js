import { getPostsInfo } from "../api/info.js"; 
import { increaseViewCount } from "../api/postService.js"
import { BASE_URL } from "../assets/config/config.js";

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
    const result = await getPostsInfo();

    let visiblePosts = 0;

    if (result.success) {
        posts = result.data;
        renderPosts(posts);  
    } else {
        alert(result.message);
    }

    function formatNumber(num) {
        return num >= 100000 ? `${Math.floor(num / 100000)}00k`
            : num >= 10000 ? `${Math.floor(num / 1000)}k`
            : num >= 1000 ? `${(num / 1000).toFixed(1)}k`
            : num;
    }

    function truncateTitle(title, maxLength = 26) {
        return title.length > maxLength ? title.substring(0, maxLength) : title;
    }

    async function renderPosts() {
        while (visiblePosts < posts.length) {
            const post = posts[visiblePosts];

            const isActiveUser = post.user.active;
            const profileImgSrc = isActiveUser ? `${BASE_URL}${post.user.profileImgUrl}`: `${BASE_URL}/profileuploads/default-profile.png`;
            const nickname = isActiveUser ? post.user.nickname : "(알 수 없음)";

            const postCard = document.createElement("div");
            postCard.classList.add("post-card");
            postCard.innerHTML = `
                <div class="post-title">${truncateTitle(post.title)}</div>
                <div class="post-info">
                    <span class="info-style">좋아요 ${formatNumber(post.likesCount)}</span>
                    <span class="info-style">댓글 ${formatNumber(post.commentsCount)}</span>
                    <span>조회수 ${formatNumber(post.views)}</span>
                    <span style="float: right;">${post.createdAt}</span>
                </div>
                <div class="post-divider"></div>
                <div class="user-section">
                    <img src="${profileImgSrc}" alt="프로필" class="user-profile">
                    <span id="nickname">${nickname}</span>
                </div>
            `;
            postCard.addEventListener('click', async function () {
                if (postCard.dataset.loading === "true") return; //더블클릭 요청 방지
                postCard.dataset.loading = "true";
                const result = await increaseViewCount(post.postId);
                if (result.success) window.location.href = "viewpost.html?postId=" + post.postId;
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
