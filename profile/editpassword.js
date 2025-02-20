document.addEventListener("DOMContentLoaded", function () {
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm-password");
    const editButton = document.getElementById("edit-button");

    function showError(id, message) {
        const element = document.getElementById(id);
        element.textContent = message;
        element.style.visibility = "visible";
    }

    function hideError(id) {
        document.getElementById(id).style.visibility = "hidden";
    }

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

    function validateForm() {
        const passwordValid = passwordInput.value && document.getElementById("password-helper").style.visibility === "hidden";
        const confirmPasswordValid = confirmPasswordInput.value === passwordInput.value;
        if (passwordValid && confirmPasswordValid ) {
            editButton.disabled = false;
            editButton.style.backgroundColor = "#7F6AEE";
        } else {
            editButton.disabled = true;
            editButton.style.backgroundColor = "#ACA0EB";
        }
    }
    
    // 수정하기 버튼 클릭 시
    editButton.addEventListener("click", function (event) {
        event.preventDefault();
        if (!editButton.disabled) {
            alert("수정 완료");
            window.location.href = "../community/posts.html"; 
        }
    });
});