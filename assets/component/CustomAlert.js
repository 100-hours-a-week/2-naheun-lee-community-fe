export class CustomAlert {
    constructor() {
      this.createAlertElement();
    }
  
    createAlertElement() {
      this.alertEl = document.createElement("div");
      this.alertEl.id = "custom-alert";
      this.alertEl.style.cssText = `
        position: fixed;
        top: 0; left: 0;
        width: 100vw; height: 100vh;
        background: rgba(0, 0, 0, 0.4);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 9999;
      `;
  
      const box = document.createElement("div");
      box.className = "custom-alert-box";
      box.style.cssText = `
        background: white;
        border-radius: 10px;
        padding: 25px 30px;
        text-align: center;
        min-width: 300px;
        box-shadow: 0 0 10px rgba(0,0,0,0.2);
      `;
  
      const title = document.createElement("h3");
      title.id = "alert-title";
      title.style.cssText = `font-size: 18px; color: #333; margin-top: 0;`;
  
      const msg = document.createElement("p");
      msg.id = "alert-message";
      msg.style.cssText = `font-size: 15px; color: #555; margin: 10px 0 20px;`;
  
      const btn = document.createElement("button");
      btn.textContent = "확인";
      btn.style.cssText = `
        padding: 8px 18px;
        background-color: #7F6AEE;
        color: white;
        border: none;
        border-radius: 6px;
        font-size: 14px;
        cursor: pointer;
      `;
      btn.onclick = () => this.hide();
  
      box.append(title, msg, btn);
      this.alertEl.append(box);
      document.body.appendChild(this.alertEl);
    }
  
    show(title, message) {
      document.getElementById("alert-title").textContent = title;
      document.getElementById("alert-message").textContent = message;
      this.alertEl.style.display = "flex";
    }
  
    hide() {
      this.alertEl.style.display = "none";
    }
  }