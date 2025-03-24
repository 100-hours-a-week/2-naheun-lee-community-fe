import { authFetch} from "./info.js";

// 로그인: (POST) /user/login
export async function loginUser(email, password) {
    try {
        const response = await fetch("http://localhost:8080/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (response.ok) {
            const token = result.token;
            localStorage.setItem("token", token); 
            return { success: true };
        } else {
            if (result.message === "Invalid credentials") {
                return { success: false, message: "이메일 또는 비밀번호가 잘못되었습니다." };
            }
            return { success: false, message: result.message || "로그인 실패" };
        }
    } catch (error) {
        return { success: false, message: "서버와의 연결에 실패했습니다." };
    }
}

// 회원가입: (POST) /user/signup
export async function signupUser(email, password, nickname, profileImageFile) {
    try {
        const formData = new FormData();

        const userData = {
            email: email,
            password: password,
            nickname: nickname
        };
        
        
        formData.append("data", new Blob([JSON.stringify(userData)], { type: "application/json" }));

        if (profileImageFile) {
            formData.append("profileImage", profileImageFile);
        }

        const response = await fetch("http://localhost:8080/user", {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            return { success: true };
        } else {
            const result = await response.json();
            return { success: false, message: result.message || "회원가입 실패" };
        }
    } catch (error) {
        return { success: false, message: "서버와의 연결에 실패했습니다." };
    }
}

// 프로필 수정: (PATCH) /user/profile
export async function updateProfile(email, nickname, profileImg) {
    
}

// 비밀번호 수정: (PATCH) /user/password
export async function updatePassword(newPassword) {
   
}

// 로그아웃: (POST) /user/logout
export function logoutUser() {
    localStorage.removeItem("user");
}

//회원탈퇴: (DELETE) /user
export function deleteUser() {
    localStorage.removeItem("user");
}




