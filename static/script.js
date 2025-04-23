document.addEventListener('DOMContentLoaded', function () {
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-box');
    const userInfoForm = document.getElementById('user-info-form');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const submitUserInfoBtn = document.getElementById('submit-user-info');

    function getCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        let minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        return `${hours}:${minutes} ${ampm}`;
    }

    function appendMessage(sender, message) {
        const messageContainer = document.createElement('div');
        messageContainer.classList.add('flex', 'items-end', 'mb-2');

        if (sender === 'user') {
            messageContainer.classList.add('justify-end'); 
        } else {
            messageContainer.classList.add('justify-start'); 
        }

        messageContainer.innerHTML = sender === 'bot' ? `
            <div class="flex items-center">
                <img src="https://www.sprbuilders.in/img/logo/logo-spr.svg" alt="Bot" class="h-8 w-8 full mr-2">
                <div class="max-w-xl px-4 py-2 rounded-lg shadow bg-[#FF0000] text-white">
                    <p>${message.replace(/\n/g, '<br>')}</p>
                    <span class="block text-xs text-white-600 mt-1">${getCurrentTime()}</span>
                </div>
            </div>
        ` : `
            <div class="max-w-xl px-4 py-2 rounded-lg shadow bg-gray-300 text-black">
                <p>${message.replace(/\n/g, '<br>')}</p>
                <span class="block text-xs text-gray-600 mt-1">${getCurrentTime()}</span>
            </div>
        `;

        chatBox.appendChild(messageContainer);
        chatBox.scrollTop = chatBox.scrollHeight;
    }

    function showWelcomeMessage() {
        appendMessage('bot', "Welcome to SPR Builders!🎯✨");
    }

    showWelcomeMessage();

    function sendMessage() {
        const userMessage = userInput.value.trim();
        if (!userMessage) return;

        appendMessage('user', userMessage);
        
        fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `message=${encodeURIComponent(userMessage)}`
        })
        .then(response => response.json())
        .then(data => {
            appendMessage('bot', data.bot_response);

            if (data.ask_user_info) {
                userInfoForm.classList.remove('hidden');
                userInput.disabled = true;
                sendBtn.disabled = true;
            }
        })
        .catch(error => {
            appendMessage('bot', "An error occurred. Please try again.");
            console.error('Error:', error);
        });

        userInput.value = '';
    }

    function submitUserInfo() {
        const name = nameInput.value.trim();
        const email = emailInput.value.trim();
        const phone = phoneInput.value.trim();


        if (!name || name.length < 2) {
            alert("Please provide a valid name (at least 2 characters).");
            return;
        }

        if (!email || !/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)) {
            alert("Please provide a valid email address.");
            return;
        }

        if (!phone || phone.length < 7) {
            alert("Please provide a valid phone number (at least 7 digits).");
            return;
        }


        fetch('/store_user_info', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.bot_response.includes("error")) {
                appendMessage('bot', data.bot_response);
            } else {
                userInfoForm.classList.add('hidden');
                appendMessage('bot', data.bot_response);
                userInput.disabled = false;
                sendBtn.disabled = false;
            }
        })
        .catch(error => {
            console.error('Error:', error);
            appendMessage('bot', "An error occurred while saving your information.");
        });
    }

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') sendMessage();
    });
    submitUserInfoBtn.addEventListener('click', submitUserInfo);
});