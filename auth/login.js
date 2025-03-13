import { loginUser } from "../api/userService.js";

document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginButton = document.getElementById("login-button");

    function showError(id, message) {
        const element = document.getElementById(id);
        element.textContent = message;
        element.style.visibility = "visible";
    }

    function hideError(id) {
        document.getElementById(id).style.visibility = "hidden";
    }

    function validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function validatePassword(password) {
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
        return passwordRegex.test(password);
    }

    function updateButtonState() {
        if (validateEmail(emailInput.value) && validatePassword(passwordInput.value)) {
            loginButton.style.backgroundColor = "#7F6AEE"; 
            loginButton.disabled = false;
        } else {
            loginButton.style.backgroundColor = "#ACA0EB"; 
            loginButton.disabled = true;
        }
    }

    emailInput.addEventListener("input", function () {
        updateButtonState();
        if (!validateEmail(emailInput.value)) {
            showError("email-helper", "올바른 이메일 주소 형식을 입력해주세요.");
        } else {
            hideError("email-helper");
        }
    });

    passwordInput.addEventListener("input", function () {
        updateButtonState();
        if (!passwordInput.value) {
            showError("password-helper", "비밀번호를 입력해주세요.");
        } else if (!validatePassword(passwordInput.value)) {
            showError("password-helper", "비밀번호는 8~20자이며, 대문자/소문자/숫자/특수문자를 각각 최소 1개 포함해야 합니다.");
        } else {
            hideError("password-helper");
        }
    });

    loginButton.addEventListener("click", async function (event) {
        event.preventDefault();
        if (!validateEmail(emailInput.value) || !validatePassword(passwordInput.value)) {
            alert("아이디 또는 비밀번호를 확인해주세요.");
            return;
        }

        const email = emailInput.value;
        const password = passwordInput.value;
        
        // loginUser API 호출
        const result = await loginUser(email, password);
        if (result.success) {
            window.location.href = "../community/posts.html";
        } else {
            alert(result.message);
        }


    });
});

