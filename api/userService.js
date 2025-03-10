import { getUsers, getCurrentUser } from "./info";

// 로그인
export async function loginUser(email, password) {
    try {
        const users = await getUsers();
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            localStorage.setItem("user", JSON.stringify({
                id: user.id,
                email: user.email,
                nickname: user.profile.nickname,
                img: user.profile.img
            }));

            return { success: true, data: user };
        } else {
            return { success: false, message: "아이디 또는 비밀번호를 확인해주세요." };
        }
    } catch (error) {
        return { success: false, message: "로그인 중 오류가 발생했습니다." };
    }
}

// 회원가입 
export async function signupUser(email, password, nickname, profileImg) {
    try{
        const users = await getUsers();

        const emailExists = users.some(user => user.email === email);
        if (emailExists) {
            return { success: false, message: "이미 사용 중인 이메일입니다." };
        }

        const nicknameExists =  users.some(user => user.profile.nickname === nickname);
        if (nicknameExists) {
            return { success: false, message: "이미 사용 중인 닉네임입니다." };
        }

        const newUser = {
            id: users.length + 1, 
            email: email,
            password: password, 
            profile: {
                nickname: nickname,
                img: profileImg || "default-profile.png"
            }
        };

        return { success: true, data: newUser };
    } catch (error) {
        return { success: false, message: "회원가입 중 오류가 발생했습니다." };
    }
}

// 프로필 수정
export async function updateProfile(email, nickname, profileImg) {
    try {
        const users = await getUsers();

        const currentUser = getCurrentUser(); 
        if (!currentUser) {
            return { success: false, message: "로그인이 필요합니다." };
        }
        
        const emailExists = users.some(user => user.email === email && user.id !== currentUser.id);
        if (emailExists) {
            return { success: false, message: "이미 사용 중인 이메일입니다." };
        }

        const nicknameExists = users.some(user => user.profile.nickname === nickname && user.id !== currentUser.id);
        if (nicknameExists) {
            return { success: false, message: "이미 사용 중인 닉네임입니다." };
        }

        currentUser.email = email; 
        currentUser.profile.nickname = nickname; 
        currentUser.profile.img = profileImg || "default-profile.png"; 

        return { success: true, data: currentUser };
    } catch (error) {
        return { success: false, message: "프로필 수정 중 오류가 발생했습니다." };
    }
}

// 비밀번호 수정
export async function updatePassword(newPassword) {
    try {
        const users = await getUsers();
        
        const currentUser = getCurrentUser(); 
        if (!currentUser) {
            return { success: false, message: "로그인이 필요합니다." };
        }

        currentUser.password = newPassword;

        return { success: true, message: "비밀번호가 성공적으로 변경되었습니다." };
    } catch (error) {
        return { success: false, message: "비밀번호 수정 중 오류가 발생했습니다." };
    }
}

// 로그아웃 
export function logoutUser() {
    localStorage.removeItem("user");
}




