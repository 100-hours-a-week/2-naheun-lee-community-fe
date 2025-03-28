import { getProfileInfo } from "../api/info.js";
import { updateProfile, deleteUser } from "../api/userService.js"; 
import { BASE_URL } from "../assets/config/config.js";
import { CustomAlert } from "../assets/component/CustomAlert.js";


document.addEventListener("DOMContentLoaded", async function () {
    const profilePicInput = document.getElementById("profile-pic");
    const profilePreview = document.getElementById("profile-preview");
    const emailInput = document.getElementById("email");
    const nicknameInput = document.getElementById("nickname");
    const editButton = document.getElementById("edit-button");
    const loginButton = document.getElementById("login-button");
    const cancelButton = document.getElementById("cancel-btn");
    const confirmButton = document.getElementById("confirm-btn");

    const alertBox = new CustomAlert();

    let selectedFile = null; 
    let userData = null;


    // 프로필 정보 로드
    async function loadUserProfile() {
        const result = await getProfileInfo();
        if (!result.success) {
            alert(result.message);
            return;
        }

        userData = result.data;
        emailInput.textContent = userData.email;
        nicknameInput.value = userData.nickname;
        if (userData.profileImgUrl && userData.profileImgUrl !== "default-profile.png") {
            profilePreview.src = `${BASE_URL}${userData.profileImgUrl}`;
        }

        validateForm();
    }

    await loadUserProfile();

    function showError(id, message) {
        const element = document.getElementById(id);
        element.textContent = message;
        element.style.visibility = "visible";
    }

    function showToast(message) {
        const toast = document.getElementById("toast");
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(() => {
            toast.classList.remove("show");
        }, 1000);
    }

    function hideError(id) {
        document.getElementById(id).style.visibility = "hidden";
    }

    // 프로필 사진 업로드
    profilePicInput.addEventListener("change", function(event) {
        const file = event.target.files[0];
        if (file) {
            selectedFile = file; 
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
            validateForm();
        }
        else{
            selectedFile = null;
            profilePreview.src = `${BASE_URL}${userData.profileImgUrl}`;
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
        const profileValid = profilePreview.src !== "" && profilePreview.src !== null;

        if (nicknameValid && profileValid) {
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
        if (nickname !== userData.nickname) updateData.nickname = nickname;
        if (selectedFile) updateData.profileImg = selectedFile;

        if (Object.keys(updateData).length === 0) {
            alertBox.show("수정된 내용이 없습니다.");
            return;
        }

        const result = await updateProfile(updateData);

        if (result.success) {
            showToast("수정 완료");
        } else {
            console.log(result.message);
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
            window.location.href = "../auth/login.html";
        } else {
            console.log(result.message);
        }
    });
});