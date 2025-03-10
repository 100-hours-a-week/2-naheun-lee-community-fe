import { getUsers, getCurrentUser, getPosts, getPostById, getCommentById } from "./info";

// 게시글 등록
export async function createPost(title, content, postImg) {
    try {
        const user = getCurrentUser(); 
        if (!user) {
            return { success: false, message: "로그인이 필요합니다." };
        }

        const newPost = {
            id: posts.length + 1, 
            author: user.id, 
            created_at: new Date().toISOString(),
            title: title,
            content: content,
            img: postImg ? URL.createObjectURL(postImg) : "default-image.png",
            likes: 0,
            views: 0,
            comments:[]
        };

        return { success: true, data: newPost };
    } catch (error) {
        return { success: false, message: "게시글 작성 중 오류가 발생했습니다." };
    }
}

// 게시글 수정
export async function updatePost(newTitle, newContent, newPostImg) {
    try {
        const user = getCurrentUser();
        if (!user) {
            return { success: false, message: "로그인이 필요합니다." };
        }

        const post = await getPostById();
        if (post.author !== user.id) {
            return { success: false, message: "게시글 수정 권한이 없습니다." };
        }

       post = {
            ...post,
            title: newTitle,
            content: newContent,
            img: newPostImg ? URL.createObjectURL(newPostImg) : "default-image.png",
            created_at: new Date().toISOString() 
        };

        return { success: true, data: post};
    } catch (error) {
        return { success: false, message: "게시글 수정 중 오류가 발생했습니다." };
    }
}

// 게시글 삭제
export async function deletePost() {
    try {
        const user = getCurrentUser();
        if (!user) {
            return { success: false, message: "로그인이 필요합니다." };
        }

        const post = await getPostById();
        if (post.author !== user.id) {
            return { success: false, message: "게시글 삭제 권한이 없습니다." };
        }

        return { success: true, message: "게시글이 삭제되었습니다." };
    } catch (error) {
        return { success: false, message: "게시글 삭제 중 오류가 발생했습니다." };
    }
}

// 게시글 좋아요 업데이트
export async function updateLikes(postId, likeIncrement) {
    try {
        // 서버와의 통신을 가정
        const response = await fetch(`/api/posts/${postId}/like`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ likeIncrement }) // +1 또는 -1
        });

        if (!response.ok) {
            throw new Error("좋아요 업데이트 실패");
        }

        const data = await response.json();
        return data; 
    } catch (error) {
        console.error("좋아요 업데이트 오류:", error);
        return { success: false, message: "좋아요 업데이트 중 오류가 발생했습니다." };
    }
}

// 댓글 등록
export async function addComment(commentText) {
    try {
        const user = getCurrentUser();
        if (!user) {
            return { success: false, message: "로그인이 필요합니다." };
        }

        const post = await getPostById();
        const newComment = {
            id:  post.comments.length + 1, 
            content: commentText,
            created_at: new Date().toISOString(),
            userId: user.id
        }

        return { success: true, data: newComment }; 
    } catch (error) {
        return { success: false, message: "댓글 등록 중 오류가 발생했습니다." };
    }
}

// 댓글 수정
export async function editComment(commentId, newCommentText) {
    try {
        const user = getCurrentUser();
        if (!user) {
            return { success: false, message: "로그인이 필요합니다." };
        }

        const comment = await getCommentById(commentId);
        if (comment.userId !== user.id) {
            return { success: false, message: "댓글 수정 권한이 없습니다." };
        }

        comment = {
            ...comment,
            content: newCommentText,
            date: new Date().toISOString() 
        };

        return { success: true, data: comment }; 
    } catch (error) {
        return { success: false, message: "댓글 수정 중 오류가 발생했습니다." };
    }
}

// 댓글 삭제
export async function deleteComment(commentId) {
    try {
        const user = getCurrentUser();
        if (!user) {
            return { success: false, message: "로그인이 필요합니다." };
        }

        const comment = await getCommentById(commentId);
        if (comment.userId !== user.id) {
            return { success: false, message: "댓글 삭제 권한이 없습니다." };
        }

        return { success: true, message: "댓글이 삭제되었습니다." };
    } catch (error) {
        return { success: false, message: "댓글 삭제 중 오류가 발생했습니다." };
    }
}
