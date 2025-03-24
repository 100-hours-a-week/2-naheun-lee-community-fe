// 현재 로그인된 사용자 정보 
export function getAuthToken() {
    return localStorage.getItem("token");
}

// 인증된 사용자 요청 형식(헤더에 토큰 포함)
export async function authFetch(url, options = {}) {
    const token = getAuthToken();

    const headers = options.headers || {};
    const isFormData = options.body instanceof FormData;

    const defaultHeaders = {
        ...headers,
        ...(token && { "Authorization": `Bearer ${token}` }),
        ...(!isFormData && { "Content-Type": "application/json" }),
    };

    return fetch(url, {
        ...options,
        headers: defaultHeaders
    });
}

// 사용자 정보 가져오기: (GET) /user/profile
export async function getUserProfile() {
    try {
        const response = await authFetch("http://localhost:8080/user", {
            method: "GET"
        });

        if (response.ok) {
            const result = await response.json();
            return {
                success: true,
                data: result.data
            };
        } else {
            const result = await response.json();
            return {
                success: false,
                message: result.message || "회원 정보를 가져올 수 없습니다."
            };
        }
    } catch (error) {
        return {
            success: false,
            message: "서버와의 연결에 실패했습니다."
        };
    }
}

// 게시글 목록 가져오기: (GET) post//posts
export async function getPosts() {
    try {
        const response = await authFetch("http://localhost:8080/post/posts", {
            method: "GET",
        });

        if (response.ok) {
            const result = await response.json();
            return {
                success: true,
                data: result.data  
            };
        } else {
            const result = await response.json();
            return {
                success: false,
                message: result.message || "게시글을 가져오는 데 실패했습니다."
            };
        }
    } catch (error) {
        return {
            success: false,
            message: "서버와의 연결에 실패했습니다."
        };
    }
}

// 특정 게시글 정보 가져오기: (GET) /post/{postId}
export async function getPostById(postId) {
    try {
        const posts = await getPosts(); 
        const post = posts.find(post => post.id === postId);  
        if (post) {
            return post;
        } else {
            throw new Error('게시글을 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error('게시글 정보를 가져오는 중 오류 발생:', error);
        return null; 
    }
}

//특정 댓글 정보 가져오기: '/comments/{commentId}' 포함된 url에 사용
export async function getCommentById(postId, commentID) {
    try {
        const post = await getPostById(postId); 
        const comment = post.comments.find(comment => comment.id === commentID);  
        if (comment) {
            return comment;
        } else {
            throw new Error('댓글을 찾을 수 없습니다.');
        }
    } catch (error) {
        console.error('댓글 정보를 가져오는 중 오류 발생:', error);
        return null; 
    }
}