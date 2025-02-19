document.addEventListener("DOMContentLoaded", function () {
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginButton = document.getElementById("login-button");
    const emailHelperText = document.getElementById("email-helper");
    const passwordHelperText = document.getElementById("password-helper");

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
            emailHelperText.textContent = "올바른 이메일 주소 형식을 입력해주세요.";
            emailHelperText.classList.add("visible");
        } else {
            emailHelperText.textContent = "";
            emailHelperText.classList.remove("visible");
        }
    });

    passwordInput.addEventListener("input", function () {
        updateButtonState();
        if (!passwordInput.value) {
            passwordHelperText.textContent = "비밀번호를 입력해주세요.";
            passwordHelperText.classList.add("visible");
        } else if (!validatePassword(passwordInput.value)) {
            passwordHelperText.textContent = "비밀번호는 8~20자이며, 대문자/소문자/숫자/특수문자를 각각 최소 1개 포함해야 합니다.";
            passwordHelperText.classList.add("visible");
        } else {
            passwordHelperText.textContent = "";
            passwordHelperText.classList.remove("visible");
        }
    });

    loginButton.addEventListener("click", function (event) {
        event.preventDefault();
        if (!validateEmail(emailInput.value) || !validatePassword(passwordInput.value)) {
            alert("아이디 또는 비밀번호를 확인해주세요.");
            return;
        }
        else{
            window.location.href = "../community/posts.html";
        }
    });
});

