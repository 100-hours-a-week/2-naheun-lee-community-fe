import { signupUser } from "../api/userService.js";

document.addEventListener("DOMContentLoaded", function () {
    const profilePicInput = document.getElementById("profile-pic");
    const profilePreview = document.getElementById("profile-preview");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const nicknameInput = document.getElementById("nickname");
    const signupBtn = document.getElementById("signup-btn");
    const plusIcon = document.getElementById("plus-icon");

    function showError(id, message) {
        const element = document.getElementById(id);
        element.textContent = message;
        element.style.visibility = "visible";
    }

    function hideError(id) {
        document.getElementById(id).style.visibility = "hidden";
    }

    // 프로필 사진 업로드
    profilePicInput.addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePreview.src = e.target.result;
                profilePreview.style.display = "block"; 
                plusIcon.style.display = "none";
                hideError("profile-helper");
            };
            reader.readAsDataURL(file);
        }
        else{
            profilePreview.style.display = "none";
            plusIcon.style.display = "block";
            showError("profile-helper", "프로필 사진을 추가해주세요.");
        }
    });


    // 이메일 유효성 검사
    emailInput.addEventListener("input", function () {
        const email = emailInput.value.trim();
        if (!email) {
            showError("email-helper", "이메일을 입력해주세요.");
        } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            showError("email-helper", "올바른 이메일 주소 형식을 입력해주세요.");
        } else {
            hideError("email-helper");
        }
        validateForm();
    });

    // 비밀번호 유효성 검사
    passwordInput.addEventListener("input", function () {
        const password = passwordInput.value;
        if (!password) {
            showError("password-helper", "비밀번호를 입력해주세요.");
        } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/.test(password)) {
            showError("password-helper", "비밀번호는 8~20자이며, 대/소문자/숫자/특수문자를 각각 최소 1개 포함해야 합니다.");
        } else {
            hideError("password-helper");
        }
        validateForm();
    });

    // 비밀번호 확인 유효성 검사
    confirmPasswordInput.addEventListener("input", function () {
        if (confirmPasswordInput.value !== passwordInput.value) {
            showError("confirm-password-helper", "비밀번호가 다릅니다.");
        } else {
            hideError("confirm-password-helper");
        }
        validateForm();
    });

    // 닉네임 유효성 검사
    nicknameInput.addEventListener("input", function () {
        const nickname = nicknameInput.value.trim();
        if (!nickname) {
            showError("nickname-helper", "닉네임을 입력해주세요.");
        } else if (nickname.includes(" ")) {
            showError("nickname-helper", "띄어쓰기를 없애주세요.");
        } else if (nickname.length > 10) {
            showError("nickname-helper", "닉네임은 최대 10자까지 작성 가능합니다.");
        } else {
            hideError("nickname-helper");
        }
        validateForm();
    });

    // 폼 유효성 검사 및 회원가입 버튼 활성화
    function validateForm() {
        const emailValid = emailInput.value.trim() && document.getElementById("email-helper").style.visibility === "hidden";
        const passwordValid = passwordInput.value && document.getElementById("password-helper").style.visibility === "hidden";
        const confirmPasswordValid = confirmPasswordInput.value === passwordInput.value;
        const nicknameValid = nicknameInput.value.trim() && document.getElementById("nickname-helper").style.visibility === "hidden";
        const profileValid = profilePreview.src && profilePreview.src !== "";

        if (emailValid && passwordValid && confirmPasswordValid && nicknameValid && profileValid) {
            signupBtn.disabled = false;
            signupBtn.style.backgroundColor = "#7F6AEE";
        } else {
            signupBtn.disabled = true;
            signupBtn.style.backgroundColor = "#ACA0EB";
        }
    }

    // 회원가입 버튼 클릭 시
    signupBtn.addEventListener("click", async function (event) { 
        event.preventDefault();
        if (!signupBtn.disabled) {
    
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const nickname = nicknameInput.value.trim();
            const file = profilePicInput.files[0];  

            const result = await signupUser(email, password, nickname, file);
            
            if (result.success) {
                window.location.href = "login.html";
            } else {
                alert(result.message);
            }
        }
    });
});
