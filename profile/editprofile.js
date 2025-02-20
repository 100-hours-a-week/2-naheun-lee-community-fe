document.addEventListener("DOMContentLoaded", function () {
    const profilePicInput = document.getElementById("profile-pic");
    const profilePreview = document.getElementById("profile-preview");
    const profileHelper = document.getElementById("profile-helper");
    const emailInput = document.getElementById("email");
    const nicknameInput = document.getElementById("nickname");
    const editButton = document.getElementById("edit-button");
    const editIcon = document.getElementById("edit-icon");
    const loginButton = document.getElementById("login-button");
    const cancelButton = document.getElementById("cancel-btn");
    const confirmButton = document.getElementById("confirm-btn");

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
                editIcon.style.display = "none";
                hideError(profileHelper);
            };
            reader.readAsDataURL(file);
        }
        else{
            profilePreview.style.display = "none";
            editIcon.style.display = "block";
            showError(profileHelper,"프로필 사진을 추가해주세요.");
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
            // 여기에 중복 이메일 체크 로직 추가 가능 (서버 요청 필요)
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
            // 여기에 중복 닉네임 체크 로직 추가 가능 (서버 요청 필요)
        }
        validateForm();
    });

    // 폼 유효성 검사 및 회원가입 버튼 활성화
    function validateForm() {
        const emailValid = emailInput.value.trim() && document.getElementById("email-helper").style.visibility === "hidden";
        const nicknameValid = nicknameInput.value.trim() && document.getElementById("nickname-helper").style.visibility === "hidden";
        const profileValid = profilePreview.src !== "default-profile.png";

        if (emailValid && nicknameValid && profileValid) {
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

    // 회원탈퇴
    function openDeleteModal() {
        document.getElementById('delete-modal').style.display = 'flex';
    }

    function closeDeleteModal() {
        document.getElementById('delete-modal').style.display = 'none';
    }

    loginButton.addEventListener("click", function (event) {
        openDeleteModal();
    });
    cancelButton.addEventListener("click", function (event) {
        closeDeleteModal();
    });
    confirmButton.addEventListener("click", function (event) {
        event.preventDefault();
        closeDeleteModal();
        //탈퇴 로직 처리(서버)
        window.location.href = "../auth/login.html"; 
    });
});