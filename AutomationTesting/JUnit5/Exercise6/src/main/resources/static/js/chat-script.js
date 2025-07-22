// Dữ liệu mẫu cho contacts
let contacts = [];
const currentUserId = Number(document.getElementById("currentUserId").value);
// Dữ liệu tin nhắn mẫu
let messages = {};

let currentContactId = null;

// Khởi tạo ứng dụng
document.addEventListener('DOMContentLoaded', async function() {
    connectWebSocket(currentUserId);
    contacts = await fetchUserRelated();
    messages = groupMessagesByUser(await fetchUserChat())
    renderContacts();
    setupEventListeners();
});

const fetchUserRelated = async () => {
    try {
        const response = await fetch("/chat/related", {
            headers: {
                "X-Requested-With": "XMLHttpRequest",
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return [];
    }
};

const fetchUserChat = async () => {
    try {
        const response = await fetch("/chat/user", {
            headers: {
                "X-Requested-With": "XMLHttpRequest",
                "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        return [];
    }

}
async function fetchSendMessage(messageData) {
    try {
        const response = await fetch("/chat/send-message", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Requested-With": "XMLHttpRequest"
            },
            body: JSON.stringify(messageData)
        });

        if (!response.ok) {
            throw new Error("Gửi tin nhắn thất bại!");
        }
    } catch (error) {
    }
}


function groupMessagesByUser(flatMessages) {
    const grouped = {};

    flatMessages.forEach(msg => {
        const { senderId, receiverId, messageId, messageText, dateTime } = msg;
        const time = dateTime.split("T")[1].slice(0, 5);
        const otherUserId = senderId === currentUserId ? receiverId : senderId;
        const sent = senderId === currentUserId;
        const message = {
            id: messageId,
            text: messageText,
            sent,
            time
        };
        if (!sent) {

            const _u = contacts.find(u => u.userId === otherUserId);
            if (_u && _u.profilePicture) {
                message.avatar = _u.profilePicture;
            }

        }
        if (!grouped[otherUserId]) {
            grouped[otherUserId] = [];
        }
        grouped[otherUserId].push(message);
    });

    return grouped;
}



// Render danh sách contacts
function renderContacts() {
    const contactsList = document.getElementById('contactsList');
    contactsList.innerHTML = '';

    contacts.forEach(contact => {
        const contactElement = createContactElement(contact);
        contactsList.appendChild(contactElement);
    });
}

// Tạo element cho contact
function createContactElement(contact) {
    const contactDiv = document.createElement('div');
    contactDiv.className = 'contact-item';
    contactDiv.dataset.contactId = contact.userId;

    contactDiv.innerHTML = `
        <div class="avatar-container">
            <img src="${contact.profilePicture}" alt="${contact.firstName}" class="contact-avatar">
        </div>
        <div class="contact-info">
            <div class="contact-name">${contact.firstName} ${contact.lastName}</div>
        </div>
    `;

    contactDiv.addEventListener('click', () => selectContact(contact.userId));

    return contactDiv;
}

// Chọn contact
function selectContact(contactId) {
    // Remove active class from all contacts
    document.querySelectorAll('.contact-item').forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to selected contact
    document.querySelector(`[data-contact-id="${contactId}"]`).classList.add('active');

    // Update current contact
    currentContactId = contactId;
    const contact = contacts.find(c => c.userId === contactId);

    // Update chat header
    updateChatHeader(contact);

    // Load messages
    loadMessages(contactId);

    // Clear unread badge
    contact.unread = 0;
    renderContacts();
}

// Cập nhật header chat
function updateChatHeader(contact) {
    document.getElementById('headerAvatar').src = contact.profilePicture;
    document.getElementById('headerName').textContent = `${contact.firstName} ${contact.lastName}`;
    document.getElementById('headerStatus').textContent = contact.status === 'online' ? 'Đang hoạt động' : 'Không hoạt động';
    document.getElementById('headerStatus').className = `status ${contact.status}`;
}

// Load tin nhắn
function loadMessages(contactId) {
    const messagesContainer = document.getElementById('messagesContainer');
    messagesContainer.innerHTML = '';

    const contactMessages = messages[contactId] || [];
    contactMessages.forEach(message => {
        const messageElement = createMessageElement(message);
        messagesContainer.appendChild(messageElement);
    });

    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Tạo element tin nhắn
function createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.sent ? 'sent' : 'received'}`;

    messageDiv.innerHTML = `
        ${!message.sent ? `<img src="${message.avatar}" alt="Avatar" class="message-avatar">` : ''}
        <div class="message-content">
            ${message.text}
            <div class="message-time">${message.time}</div>
        </div>
    `;

    return messageDiv;
}

// Gửi tin nhắn
function sendMessage() {
    if (!currentContactId) return;

    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();

    if (!messageText) return;

    // Tạo tin nhắn mới
    const newMessage = {
        id: Date.now(),
        text: messageText,
        sent: true,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    };
    //DATABASE
    const newDbMessage = {
        receiverId : currentContactId,
        senderId : currentUserId,
        messageText : messageText
    }
    fetchSendMessage(newDbMessage);
    sendSocketMessage(currentUserId,currentContactId,messageText)
    // Thêm vào dữ liệu
    if (!messages[currentContactId]) {
        messages[currentContactId] = [];
    }
    messages[currentContactId].push(newMessage);
    // Render lại
    loadMessages(currentContactId);
    renderContacts();

    // Clear input
    messageInput.value = '';

}

// Thiết lập event listeners
function setupEventListeners() {
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const searchInput = document.getElementById('searchInput');

    // Send message on button click
    sendBtn.addEventListener('click', sendMessage);

    // Send message on Enter key
    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });



    // Auto-resize message input
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 100) + 'px';
    });
}

// Responsive menu toggle (for mobile)
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('active');
}

// Add menu button for mobile (you can add this to HTML if needed)
if (window.innerWidth <= 768) {
    const chatHeader = document.querySelector('.chat-header');
    const menuBtn = document.createElement('button');
    menuBtn.className = 'menu-btn';
    menuBtn.innerHTML = '☰';
    menuBtn.addEventListener('click', toggleSidebar);
    chatHeader.insertBefore(menuBtn, chatHeader.firstChild);
}


//SOCKE JS
let stompClient = null;

function connectWebSocket(currentUserId) {
    const socket = new SockJS('/ws');
    stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
        console.log("✅ WebSocket connected");
        stompClient.subscribe(`/topic/messages/${currentUserId}`, (message) => {
            const msg = JSON.parse(message.body);
            if (msg.senderId !== currentUserId) {
                messages[msg.senderId].push({
                    id: Date.now(),
                    text: msg.messageText,
                    sent: false,
                    time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
                    avatar: contacts.find(u => u.userId === msg.senderId).profilePicture
                })
                loadMessages(msg.senderId);
                renderContacts();
            }
        });
    });
}

function sendSocketMessage(senderId, receiverId, text) {
    const msg = {
        senderId,
        receiverId,
        messageText: text,
        sentAt: new Date().toISOString()
    };

    stompClient.send("/app/chat.send", {}, JSON.stringify(msg));
}
