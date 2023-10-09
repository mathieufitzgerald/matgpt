document.getElementById('new-chat').addEventListener('click', () => {
  const welcome = document.getElementById('welcome');
  const chatContainer = document.getElementById('chat-container');
  const loadingSpinner = document.getElementById('loading-spinner');
  const chatArea = document.getElementById('chat-area');
  const inputBar = document.querySelector('.input-bar');

  welcome.style.animation = 'fadeOut 1s ease forwards';

  setTimeout(() => {
    welcome.style.display = 'none';
    chatContainer.style.display = 'flex';
    chatContainer.style.flexDirection = 'column';
    chatContainer.style.height = '100%';
    loadingSpinner.style.display = 'flex';
  }, 1000);

  setTimeout(() => {
    loadingSpinner.style.display = 'none';
    chatArea.style.display = 'block';
    inputBar.style.display = 'flex';
  }, 3000); // Adjust the delay here, currently set to 2000 milliseconds (2 seconds)
});




async function fetchGPTResponse(prompt) {
  try {  
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // Add this line
        messages: [
          {role: "system", content: "You are a helpful assistant."},
          {role: "user", content: prompt}
        ]
      }),
    });

    const data = await response.json();

    // Check if the API returned an error
    if (data.error) {
        console.error(data.error);
        return "Sorry, there was an error from the API: " + data.error.message;
    }

    // Use the returned 'choices' data
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
        return data.choices[0].message.content.trim();
    } else {
        console.error("Unexpected API response structure:", data);
        return "Sorry, there was an unexpected error. Please try again later.";
    }
  } catch (error) {
    console.error("Error fetching GPT response:", error);
    return "Sorry, there was an error. Please try again later.";
  }
}



document.getElementById('send-btn').addEventListener('click', async () => {
  const userInput = document.getElementById('user-input');
  const userText = userInput.value.trim();

  if (userText) {
    displayMessage(userText, 'user'); // Display user message
    const response = await fetchGPTResponse(userText);
    displayMessage(response, 'bot'); // Display response
  }

  userInput.value = '';
});

document.getElementById('user-input').addEventListener('keypress', async (event) => {
  if (event.key === 'Enter') {
    event.preventDefault(); // Prevent the default action (page reload)
    const userInput = document.getElementById('user-input');
    const userText = userInput.value.trim();

    if (userText) {
      displayMessage(userText, 'user'); // Display user message
      const response = await fetchGPTResponse(userText);
      displayMessage(response, 'bot'); // Display response
    }

    userInput.value = '';
  }
});

function displayMessage(text, sender) {
  const chatArea = document.getElementById('chat-area');
  const messageContainer = document.createElement('div');
  const profileImage = document.createElement('img');
  const message = document.createElement('div');
  const messageText = document.createElement('p');
  const messageSender = document.createElement('span');

  profileImage.classList.add('profile-pic');
  messageText.classList.add('message-text');
  messageSender.classList.add('message-sender');
  
  if (sender === 'user') {
      profileImage.src = 'user_profile.png';
      messageSender.textContent = 'User';
      message.classList.add('message', 'user');
  } else {
      profileImage.src = 'chatgpt_profile.jpg';
      messageSender.textContent = 'ChatGPT';
      message.classList.add('message', 'bot');
  }

  messageText.textContent = text;
  message.appendChild(profileImage);
  message.appendChild(messageSender);
  message.appendChild(messageText);
  messageContainer.appendChild(message);
  chatArea.appendChild(messageContainer);
  chatArea.scrollTop = chatArea.scrollHeight;
}
