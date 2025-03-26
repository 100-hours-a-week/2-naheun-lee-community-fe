import { getProfileInfo } from "../api/info.js";
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

    let originalNickname = "";
    let originalProfileImg = "";
    let selectedFile = null; 

     // 프로필 정보 로드
    async function loadUserProfile() {
        const result = await getProfileInfo();
        if (!result.success) {
            alert(result.message);
            return;
        }

        const user = result.data;
        emailInput.textContent = user.email;
        nicknameInput.value = user.nickname;
        profilePreview.src = user.profileImg;
        originalNickname = user.nickname;
        originalProfileImg = user.profileImg;

        validateForm();
    }

    loadUserProfile();

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
        const nicknameValid = nicknameInput.value.trim().length > 0 && 
        window.getComputedStyle(document.getElementById("nickname-helper")).visibility === "hidden";
        const profileValid = profilePreview.src !== "" && profilePreview.src !== null &&
        window.getComputedStyle(document.getElementById("profile-helper")).visibility === "hidden";

        if ( nicknameValid && profileValid) {
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

        const nickname = nicknameInput.value.trim();

        const updateData = {};
        if (nickname !== originalNickname) updateData.nickname = nickname;
        if (selectedFile) updateData.profileImg = selectedFile;

        if (Object.keys(updateData).length === 0) {
            alert("수정된 내용이 없습니다.");
            return;
        }

        const result = await updateProfile(updateData);

        if (result.success) {
            alert("프로필 정보가 수정되었습니다.");
            window.location.href = "../community/posts.html";
        } else {
            alert(result.message);
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
    confirmButton.addEventListener("click", async function (event) {
        event.preventDefault();
        closeDeleteModal();
    
        const result = await deleteUser(); 
        if (result.success) {
            alert("회원 탈퇴가 완료되었습니다.");
            window.location.href = "../auth/login.html";
        } else {
            alert(result.message);
        }
    });
});