import { BASE_URL } from "../assets/config/config.js";

// 현재 로그인된 사용자 정보 
export function getAuthToken() {
    return localStorage.getItem("token");
}

// 인증된 사용자 요청 형식(헤더에 토큰 포함)
export async function authFetch(url, options = {}) {
    const token = localStorage.getItem("token");
    const isFormData = options.body instanceof FormData;
  
    const headers = {
      ...(options.headers || {}),
      ...(token && { Authorization: `Bearer ${token}` }),
      ...(!isFormData && { "Content-Type": "application/json" }),
    };
  
    const config = {
      ...options,
      headers,
    };
  
    try {
      const response = await fetch(url, config);
  
      if (response.status === 401) {
        alert("세션이 만료되었습니다. 다시 로그인해주세요.");
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        window.location.href = "/auth/login.html";
        return;
      }
  
      return response;
    } catch (error) {
      console.error("네트워크 오류:", error);
    }
}

// 사용자 정보 가져오기: (GET) /user
export async function getProfileInfo() {
    try {
        const response = await authFetch(`${BASE_URL}/user`, {
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
export async function getPostsInfo() {
    try {
        const response = await authFetch(`${BASE_URL}/post/posts`, {
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
export async function getPostInfo(postId) {
    try {
        const response = await authFetch(`${BASE_URL}/post/${postId}`, {
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
                message: result.message || "게시글을 가져오는 데 실패했습니다."
            };
        }
    } catch (error) {
        console.error("게시글 정보를 가져오는 중 오류 발생:", error);
        return {
            success: false,
            message: "서버와의 연결에 실패했습니다."
        };
    }
}