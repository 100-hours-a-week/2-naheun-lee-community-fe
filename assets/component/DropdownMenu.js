import { getUserProfile } from "../../api/info.js"; 

class DropdownMenu {
    constructor() {}

    async render(containerId) {
        const container = document.getElementById(containerId);
        const result = await getUserProfile();
        const user = result.success ? result.data : null;
        const profileImgSrc = user && user.profileImg ? user.profileImg : "default-profile.png";

        const profileImgElement = document.getElementById("profile-img");
        if (profileImgElement) {
            profileImgElement.src = profileImgSrc;
        }

        container.innerHTML = `
            <style>
                .profile-dropdown {
                    display: none;
                    transition: opacity 0.1s ease, visibility 0.1s ease;
                    position: absolute;
                    right: calc((100vw - 500px) / 2);
                    top: 55px;
                    width: 120px;
                    height: 120px;
                    z-index: 2000;
                }

                .profile-dropdown.active {
                    display: block;
                }

                .menu-button {
                    padding:5px 0;
                    height: 30px;
                    text-align: center;
                    cursor: pointer;
                    background: #d9d9d9;
                    display: flex;
                    justify-content: center; 
                    align-items: center;
                }
                .menu-button:hover {
                    background: #E9E9E9;
                }

                .menu-button a {
                    text-decoration: none;
                    color: black;
                    font-size: 15px;
                }

                .menu-button a:hover {
                    color: black; 
                }
            </style>    
            <div id="profile-menu" class="profile-dropdown">
                <div class="menu-button">
                    <a href="../profile/editprofile.html">회원정보 수정</a>
                </div>
                <div class="menu-button">
                    <a href="../profile/editpassword.html">비밀번호 수정</a>
                </div>
                <div class="menu-button">
                    <a href="../auth/login.html">로그아웃</a>
                </div>
            </div>
        `;

        // 이벤트 리스너 추가
        this.addEventListeners();
    }

    addEventListeners() {
        const profileImg = document.getElementById('profile-img');
        const profileMenu = document.getElementById('profile-menu');

        profileImg.addEventListener("click", (e) => {
            e.stopPropagation();
            profileMenu.classList.toggle("active");
        });

        profileMenu.addEventListener("click", (e) => {
            e.stopPropagation();
        });

        window.addEventListener("click", (e) => {
            if (!profileImg.contains(e.target) && !profileMenu.contains(e.target)) {
                profileMenu.classList.remove("active");
            }
        });
    }
}

window.DropdownMenu = DropdownMenu;
