import { DropdownMenu } from "./DropdownMenu.js";

class HeaderComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    async connectedCallback() {
        const showBackButton = this.getAttribute("back") !== null;
        const showProfile = this.getAttribute("profile") !== null;
        const backPath = this.getAttribute("back-path") || null;

        this.shadowRoot.innerHTML = `
           <style>
                .custom-header {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 60px;
                    background-color: #f5f5f5;
                    border-bottom: 1px solid black;
                    z-index: 1000;
                }
                .header-container {
                    max-width: 500px;
                    margin: 0 auto;
                    display: grid;
                    grid-template-columns: 35px 1fr 35px;
                    align-items: center;
                    height: 100%;
                }
                .header-title {
                    cursor: pointer;
                    margin: 0;
                    text-align: center;
                    font-weight: normal; 
                    font-size: 28px;
                    line-height: 1;
                }
                .back-button {
                    background: none;
                    border: none;
                    font-size: 35px;
                    cursor: pointer;
                    padding: 0;
                }
                #profile-img {
                    width: 35px;
                    height: 35px;
                    border-radius: 50%;
                    cursor: pointer;
                    object-fit: cover;
                }
                .profile-container {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    height: 100%;
                }    
                .placeholder {
                    width: 35px;
                    height: 35px;
                }
            </style>
            <header class="custom-header">
                <div class="header-container">
                    ${showBackButton ? `<button class="back-button" id="back-btn">‹</button>` : `<div class="placeholder"></div>`}
                    <h1 class="header-title" id="title">아무 말 대잔치</h1>
                    ${showProfile ? `<div class="profile-container"><img id="profile-img" alt="프로필 이미지"></div>` : `<div class="placeholder"></div>`}
                </div>
            </header>
        `;

        const title = this.shadowRoot.getElementById("title");
        title.addEventListener("click", () => {
            const path = window.location.pathname;
            if (!path.includes("login") && !path.includes("signup")) {
                window.location.href = "../community/posts.html";
            }
        });

        if (showBackButton) {
            const backBtn = this.shadowRoot.getElementById("back-btn");
            backBtn.addEventListener("click", () => {
                window.location.href = backPath || document.referrer || "javascript:history.back()";
            });
        }

        if (showProfile) {
            const profileImg = this.shadowRoot.getElementById("profile-img");
            const dropdown = new DropdownMenu(profileImg, this.shadowRoot);
            await dropdown.render();
        }
    }
}

customElements.define("header-component", HeaderComponent);
