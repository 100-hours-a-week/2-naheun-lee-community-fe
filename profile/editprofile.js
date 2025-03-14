import { getCurrentUser } from "../api/info.js";
import { updateProfile, deleteUser } from "../api/userService.js"; 

document.addEventListener("DOMContentLoaded", async function () {
    const profilePicInput = document.getElementById("profile-pic");
    const profilePreview = document.getElementById("profile-preview");
    const emailInput = document.getElementById("email");
    const nicknameInput = document.getElementById("nickname");
    const editButton = document.getElementById("edit-button");
    const editIcon = document.getElementById("edit-icon");
    const loginButton = document.getElementById("login-button");
    const cancelButton = document.getElementById("cancel-btn");
    const confirmButton = document.getElementById("confirm-btn");
    const dropdown = new DropdownMenu();
    
    dropdown.render("dropdown");

    async function loadUserProfile() {
        const user = await getCurrentUser(); 
        if (!user) {
            alert("로그인이 필요합니다.");
            window.location.href = "../auth/login.html"; 
            return;
        }

        emailInput.value = user.email; 
        nicknameInput.value = user.profile.nickname;
        profilePreview.src = user.profile.img; 
        profilePreview.style.display = "block"; 
        editIcon.style.display = "none";

        validateForm(); 
    }

    // 프로필 정보 로드
    await loadUserProfile();

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
                hideError("profile-helper");
            };
            reader.readAsDataURL(file);
            validateForm();
        }
        else{
            profilePreview.style.display = "none";
            editIcon.style.display = "block";
            showError("profile-helper","프로필 사진을 추가해주세요.");
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

    // 폼 유효성 검사 및 버튼 활성화
    function validateForm() {
        const emailValid = emailInput.value.trim().length > 0 && window.getComputedStyle(document.getElementById("email-helper")).visibility === "hidden";
        const nicknameValid = nicknameInput.value.trim().length > 0 && window.getComputedStyle(document.getElementById("nickname-helper")).visibility === "hidden";
        const profileValid = profilePreview.src !== "default-profile.png";


        if (emailValid && nicknameValid && profileValid) {
            editButton.disabled = false;
            editButton.style.backgroundColor = "#7F6AEE";
        } else {
            editButton.disabled = true;
            editButton.style.backgroundColor = "#ACA0EB";
        }
    }

    // 프로필 정보 수정 이벤트
    editButton.addEventListener("click", async function (event) { 
        event.preventDefault(); 
        if (!editButton.disabled) {
            const email = emailInput.value.trim();         
            const nickname = nicknameInput.value.trim();       
            const profileImg = profilePreview.src;             

            const result = await updateProfile(email, nickname, profileImg); 
            if (result.success) {
                alert("프로필 정보가 수정되었습니다.")
                window.location.href = "../community/posts.html";
            } else {
                alert(result.message);
            }
        }
    });

    // 회원 탈퇴 모달    
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
        deleteUser();
        window.location.href = "../auth/login.html"; 
    });
});