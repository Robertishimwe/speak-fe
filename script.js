import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

function loader(element) {
  element.textContent = "";

  loadInterval = setInterval(() => {
    // Update the text content of the loading indicator
    element.textContent += ".";

    // If the loading indicator has reached three dots, reset it
    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 20);
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
  return `
        <div class="wrapper ${isAi && "ai"}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? "bot" : "user"}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `;
}

/////////////////////////************************//////////////////////////

// Initialize the speech recognition object
const recognition = new webkitSpeechRecognition();
let transcript2;

// Set the recognition settings
recognition.continuous = true;
recognition.interimResults = true;
recognition.lang = "en-US";

// Initialize the timeout variable
let timeout;

// Get the text element
//const text = document.getElementById('text');

// Start the recognition process
recognition.start();

// Listen for speech recognition results
recognition.onresult = (event) => {
  // Clear the timeout
  clearTimeout(timeout);

  // Get the last result
  const result = event.results[event.results.length - 1];

  // Get the transcribed text
  const transcript = result[0].transcript.trim();
  transcript2 = transcript;

  // Append the transcribed text to the text element
  //text.innerHTML += `<p>${transcript}</p>`;

  // Start the timeout again
  timeout = setTimeout(() => {
    recognition.stop();
  }, 5000);
};

// Listen for speech recognition errors
recognition.onerror = (event) => {
  console.error(`Speech recognition error occurred: ${event.error}`);
};

// Listen for the end of the recognition process
recognition.onend = () => {
  // alert(`${transcript2}`);
  console.log(`text`);
  console.log(`text ${transcript2}`);
  console.log("Speech recognition stopped.");
  handleSubmit();
};

///////////////////////**********************////////////////////////////////////

const handleSubmit = async (e) => {
  // e.preventDefault()

  if (transcript2 == "" || transcript2 == null || transcript2 == undefined) {
    recognition.start();
  } else {
    const data = transcript2;
    // const data = new FormData(form)

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data);

    // to clear the textarea input
    form.reset();

    // bot's chatstripe
    const uniqueId = generateUniqueId();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

    // to focus scroll to the bottom
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div
    const messageDiv = document.getElementById(uniqueId);

    // messageDiv.innerHTML = "..."
    loader(messageDiv);

    const response = await fetch("https://ishimwe.cyclic.app/api/chat/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: data,
      }),
    });

    clearInterval(loadInterval);
    messageDiv.innerHTML = " ";

    if (response.ok) {
      const data = await response.json();
      const parsedData = data.bot.trim(); // trims any trailing spaces/'\n'

      typeText(messageDiv, parsedData);

      transcript2 = "";

      recognition.start();
    } else {
      const err = await response.text();

      messageDiv.innerHTML = "Something went wrong";
      alert(err);
    }
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
