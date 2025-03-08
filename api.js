
// 로그인
export async function loginUser(email, password) {
    try {
        const response = await fetch('/data/users.json');
        if (!response.ok) {
            throw new Error('네트워크 오류: 데이터를 가져올 수 없습니다.');
        }

        const users = await response.json();
        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
            localStorage.setItem("user", JSON.stringify({
                id: user.id,
                email: user.email,
                nickname: user.profile.nickname,
                img: user.profile.img
            }));

            return {
                success: true,
                user: {
                    id: user.id,
                    email: user.email,
                    nickname: user.profile.nickname,
                    img: user.profile.img
                }
            };
        } else {
            return { success: false, message: "아이디 또는 비밀번호를 확인해주세요." };
        }
    } catch (error) {
        console.error('로그인 오류:', error);
        return { success: false, message: "로그인 중 오류가 발생했습니다." };
    }
}

// 회원가입 
export async function registerUser(email, password, nickname, profileImg) {
    const emailExists = await checkEmailExists(email);
    if (emailExists) {
        return { success: false, message: "이미 사용 중인 이메일입니다." };
    }

    const nicknameExists = await checkNicknameExists(nickname);
    if (nicknameExists) {
        return { success: false, message: "이미 사용 중인 닉네임입니다." };
    }

    const newUser = {
        id: Date.now(), 
        email: email,
        password: password, 
        profile: {
            nickname: nickname,
            img: profileImg || "default-profile.png"
        }
    };

    // 로컬 스토리지에 추가 (서버 없이 저장)
    let users = JSON.parse(localStorage.getItem("users")) || [];
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    return { success: true, user: newUser };
}

// 로그아웃 (사용자 정보 삭제)
export function logoutUser() {
    localStorage.removeItem("user");
}


// 현재 로그인된 사용자 정보 가져오기
export function getCurrentUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}


// 사용자 목록 가져오기
export async function getUsers() {
    try {
        const response = await fetch('/data/users.json');
        if (!response.ok) {
            throw new Error('네트워크 오류: 데이터를 가져올 수 없습니다.');
        }
        return await response.json();
    } catch (error) {
        console.error('사용자 목록을 가져오는 중 오류 발생:', error);
        return [];
    }
}

// 이메일 중복 체크
export async function checkEmailExists(email) {
    const users = await getUsers();
    return users.some(user => user.email === email);
}

// 닉네임 중복 체크
export async function checkNicknameExists(nickname) {
    const users = await getUsers();
    return users.some(user => user.profile.nickname === nickname);
}



