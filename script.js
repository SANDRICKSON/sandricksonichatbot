const messageInput = document.querySelector(".message-input");
const chatBody = document.querySelector(".chat-body");
const sendMessageButton = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");

// ⚠️ API გასაღების უსაფრთხოება: API_KEY არ უნდა იყოს კოდში ჩაწერილი.
// უმჯობესია, რომ ის სერვერის მხარეს შეინახო.
const API_KEY = "AIzaSyAWYQRWPTv7KcxPr2fR3quFQQXeDu33Ad4";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

const userData = { 
    message: null,
    file: {
        data: null,
        mime_type: null
    }
};

// მესიჯის ელემენტის შექმნა
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
};

// ბოტის პასუხის გენერაცია
const generateBotResponse = async (incomingMessageDiv) => {
    const messageElement = incomingMessageDiv.querySelector(".message-text");
    const userMessage = userData.message || "Hello";

    const requestBody = {
        contents: [{
            parts: [
                { text: userMessage },
                ...(userData.file.data ? [{ inline_data: userData.file }] : [])
            ]
        }]
    };

    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody)
    };

    try {
        const response = await fetch(API_URL, requestOptions);
        const data = await response.json();

        if (!response.ok) throw new Error(data.error?.message || "API request failed");

        const apiResponseText = data.candidates[0].content.parts[0].text.trim();
        messageElement.innerText = apiResponseText;
    } catch (error) {
        console.error("Bot response error:", error);
        messageElement.innerText = "⚠️ შეცდომა! სცადეთ მოგვიანებით.";
    }
};

// მომხმარებლის მესიჯის გაგზავნა
const handleOutgoingMessage = (e) => {
    e.preventDefault();

    userData.message = messageInput.value.trim();
    if (!userData.message) return;

    messageInput.value = "";

    const messageContent = `<div class="message-text">${userData.message}</div>`;
    const outgoingMessageDiv = createMessageElement(messageContent, "user-message");

    chatBody.append(outgoingMessageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    setTimeout(() => {
        const botMessageContent = `
            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024" class="bot-avatar">
                <path d="M738.3 287.6H285.7c-59 0-106.8 47.8-106.8 106.8v303.1c0 59 47.8 106.8 106.8 106.8h81.5v111.1c0 .7.8 1.1 1.4.7l166.9-110.6 41.8-.8h117.4l43.6-.4c59 0 106.8-47.8 106.8-106.8V394.5c0-59-47.8-106.9-106.8-106.9zM351.7 448.2c0-29.5 23.9-53.5 53.5-53.5s53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5-53.5-23.9-53.5-53.5zm157.9 267.1c-67.8 0-123.8-47.5-132.3-109h264.6c-8.6 61.5-64.5 109-132.3 109zm110-213.7c-29.5 0-53.5-23.9-53.5-53.5s23.9-53.5 53.5-53.5 53.5 23.9 53.5 53.5-23.9 53.5-53.5 53.5z"></path>
            </svg>
            <div class="message-text">
                <div class="thinking-indicator">
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                </div>
            </div>`;

        const incomingMessageDiv = createMessageElement(botMessageContent, "bot-message", "thinking");
        chatBody.append(incomingMessageDiv);
        generateBotResponse(incomingMessageDiv);

        chatBody.scrollTop = chatBody.scrollHeight;
    }, 600);
};

// მესიჯის გაგზავნა "Enter"-ზე
messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        handleOutgoingMessage(e);
    }
});

// ფაილის ატვირთვა და Base64 კონვერტაცია
fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        const base64String = e.target.result.split(",")[1].trim();
        userData.file = {
            data: base64String,
            mime_type: file.type
        };
        fileInput.value = "";
    };
    reader.readAsDataURL(file);
});

// ღილაკზე დაჭერის შემთხვევაში მესიჯის გაგზავნა
sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));
document.querySelector("#file-upload").addEventListener("click", () => fileInput.click());

// Emoji Picker კონფიგურაცია


const chatForm = document.querySelector(".chat-form");
if (chatForm) {
    chatForm.appendChild(picker);
}
