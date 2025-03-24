import { authFetch , getPosts, getPostById, getCommentById } from "./info.js";

// 게시글 작성: (POST) /post
export async function createPost(title, content, imageFile) {
    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify({ title, content })], { type: "application/json" }));
    
    if (imageFile) {
        formData.append("postImage", imageFile);
    }

    try {
        const response = await authFetch("http://localhost:8080/post", {
            method: "POST",
            body: formData
        });

        if (response.ok) {
            return { success: true };
        } else {
            const result = await response.json();
            return { success: false, message: result.message || "게시글 작성 실패" };
        }
    } catch (error) {
        return { success: false, message: "서버와의 연결에 실패했습니다." };
    }
}

// 게시글 수정: (PATCH) /post/{postId}
export async function updatePost(postId, newTitle, newContent, newPostImg) {
    try {
        const user = getCurrentUser();
        if (!user) {
            return { success: false, message: "로그인이 필요합니다." };
        }

        let  post = await getPostById(postId);
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

// 게시글 삭제: (DELETE) /post/{postId}
export async function deletePost(postId) {
    try {
        const user = getCurrentUser();
        if (!user) {
            return { success: false, message: "로그인이 필요합니다." };
        }

        const post = await getPostById(postId);
        if (post.author !== user.id) {
            return { success: false, message: "게시글 삭제 권한이 없습니다." };
        }

        return { success: true, message: "게시글이 삭제되었습니다." };
    } catch (error) {
        return { success: false, message: "게시글 삭제 중 오류가 발생했습니다." };
    }
}

// 조회수 증가: (POST) /patch/{postId}/views
export async function increaseViewCount(postId) {
    try {
        const response = await authFetch(`http://localhost:8080/post/${postId}/views`, {
            method: "PATCH"
        });
        const result = await response.json();

        if (response.ok) {
            return { success: true, message: result.message };
        } else {
            return { success: false, message: result.message || "조회수 증가 실패" };
        }
    } catch (error) {
        return { success: false, message: "서버와의 연결에 실패했습니다." };
    }
}

// 게시글 좋아요 추가: (POST) /post/{postId}likes
export async function addLike() {
    try {
        const user = getCurrentUser();
        if (!user) {
            return { success: false, message: "로그인이 필요합니다." };
        }

        //백엔드와 데이터베이스에서 추가 로직 필요!! 일단 프론트엔드에서 +1로 처리
        return { success: true, message: "좋아요가 추가되었습니다." };
    } catch (error) {
        return { success: false, message: "좋아요 업데이트 중 오류가 발생했습니다." };
    }
}

// 게시글 좋아요 취소: (DELETE) /post/{postId}likes
export async function removeLike() {
    try {
        const user = getCurrentUser();
        if (!user) {
            return { success: false, message: "로그인이 필요합니다." };
        }

        //백엔드와 데이터베이스에서 추가 로직 필요!! 일단 프론트엔드에서 -1로 처리
        return { success: true, message: "좋아요가 취소되었습니다." };
    } catch (error) {
        return { success: false, message: "좋아요 업데이트 중 오류가 발생했습니다." };
    }
}

// 댓글 등록: (POST) /post/{postId}/comments
export async function addAPIComment(postId, commentText) {
    try {
        const user = getCurrentUser();
        if (!user) {
            return { success: false, message: "로그인이 필요합니다." };
        }

        const post = await getPostById(postId);
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

// 댓글 수정: (PATCH) /post/{postId}/comments/{commentId}
export async function editAPIComment(postId, commentId, newCommentText) {
    try {
        const user = getCurrentUser();
        if (!user) {
            return { success: false, message: "로그인이 필요합니다." };
        }

        let comment = await getCommentById(postId, commentId);
        if (comment.userId !== user.id) {
            return { success: false, message: "댓글 수정 권한이 없습니다." };
        }

        comment = {
            ...comment,
            content: newCommentText,
            created_at: new Date().toISOString() 
        };

        return { success: true, data: comment }; 
    } catch (error) {
        return { success: false, message: "댓글 수정 중 오류가 발생했습니다." };
    }
}

// 댓글 삭제: (DELETE) /post/{postId}/comments/{commentId}
export async function deleteAPIComment(postId, commentId) {
    try {
        const user = getCurrentUser();
        if (!user) {
            return { success: false, message: "로그인이 필요합니다." };
        }

        const comment = await getCommentById(postId, commentId);
        if (comment.userId !== user.id) {
            return { success: false, message: "댓글 삭제 권한이 없습니다." };
        }

        return { success: true, message: "댓글이 삭제되었습니다." };
    } catch (error) {
        return { success: false, message: "댓글 삭제 중 오류가 발생했습니다." };
    }
}
