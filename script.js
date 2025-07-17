const toggleBtn = document.getElementById("chat-toggle");
const chatPopup = document.getElementById("chat-popup");
const form = document.getElementById("chat-form");
const input = document.getElementById("chat-input");
const history = document.getElementById("chat-history");
const themeToggle = document.getElementById("theme-toggle");
const emojiBtn = document.getElementById("emoji-btn");
const emojiPicker = document.getElementById("emoji-picker");
const attachBtn = document.getElementById("attach-btn");
const fileInput = document.getElementById("file-input");

let attachedFile = null;

// Toggle chat popup
toggleBtn.addEventListener("click", () => {
  chatPopup.style.display = chatPopup.style.display === "flex" ? "none" : "flex";
});

// Toggle theme
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// Toggle emoji picker
emojiBtn.addEventListener("click", () => {
  emojiPicker.style.display = emojiPicker.style.display === "block" ? "none" : "block";
});

// Insert emoji
emojiPicker.addEventListener("click", (e) => {
  if (e.target.tagName === "SPAN" || e.target.nodeType === Node.TEXT_NODE) {
    const emoji = e.target.textContent;
    const cursorPos = input.selectionStart;
    const textBefore = input.value.substring(0, cursorPos);
    const textAfter = input.value.substring(cursorPos);
    input.value = textBefore + emoji + textAfter;
    input.focus();
    input.setSelectionRange(cursorPos + emoji.length, cursorPos + emoji.length);
    emojiPicker.style.display = "none";
  }
});

// Trigger file input
attachBtn.addEventListener("click", () => {
  fileInput.click();
});

// Handle file preview immediately after upload
fileInput.addEventListener("change", () => {
  if (fileInput.files.length > 0) {
    attachedFile = fileInput.files[0];

    const previewElem = document.createElement("div");
    previewElem.className = "message sent";

    let html = "";

    if (attachedFile.type.startsWith("image/")) {
      const imgURL = URL.createObjectURL(attachedFile);
      html += `<div class="file-preview"><img src="${imgURL}" alt="preview" /></div>`;
    } else if (attachedFile.type === "application/pdf") {
      html += `<div class="file-preview"><a href="${URL.createObjectURL(attachedFile)}" target="_blank">${attachedFile.name}</a></div>`;
    } else {
      html += `<div class="file-preview"><em>Unsupported file type</em></div>`;
    }

    const time = new Date().toLocaleTimeString();
    html += `<div class="timestamp">${time}</div>`;
    html += `<div class="status">Waiting to send</div>`;

    previewElem.innerHTML = html;
    previewElem.dataset.preview = "true"; // mark as preview to be replaced

    // Remove any existing preview
    const existingPreview = history.querySelector('[data-preview="true"]');
    if (existingPreview) existingPreview.remove();

    history.appendChild(previewElem);
    history.scrollTop = history.scrollHeight;
  }
});

// Send message or file
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const messageText = input.value.trim();
  if (!messageText && !attachedFile) return;

  const messageElem = document.createElement("div");
  messageElem.className = "message sent";

  let html = "";

  // Message text
  if (messageText) {
    html += `<div>${messageText}</div>`;
  }

  // File preview
  if (attachedFile) {
    if (attachedFile.type.startsWith("image/")) {
      const imgURL = URL.createObjectURL(attachedFile);
      html += `<div class="file-preview"><img src="${imgURL}" alt="preview" /></div>`;
    } else if (attachedFile.type === "application/pdf") {
      html += `<div class="file-preview"><a href="${URL.createObjectURL(attachedFile)}" target="_blank">${attachedFile.name}</a></div>`;
    } else {
      html += `<div class="file-preview"><em>Unsupported file type</em></div>`;
    }
  }

  const time = new Date().toLocaleTimeString();
  html += `<div class="timestamp">${time}</div>`;
  html += `<div class="status">Sent</div>`;

  messageElem.innerHTML = html;

  // Remove any existing file preview placeholder
  const existingPreview = history.querySelector('[data-preview="true"]');
  if (existingPreview) existingPreview.remove();

  history.appendChild(messageElem);
  history.scrollTop = history.scrollHeight;

  // Clear input + file
  input.value = "";
  attachedFile = null;
  fileInput.value = "";

  // Simulate status updates
  const statusElem = messageElem.querySelector(".status");
  setTimeout(() => statusElem.textContent = "Delivered", 1000);
  setTimeout(() => statusElem.textContent = "Read", 2000);
});
