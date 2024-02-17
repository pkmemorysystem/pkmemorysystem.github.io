// Function to save content to localStorage
function saveToLocalStorage() {
  const persistentTxtContent = document.getElementById("persistentTxt").innerText;
  localStorage.setItem("persistentContent", persistentTxtContent);
}

// Function to update content of #persistentTxt from localStorage
function updateFromLocalStorage() {
  const persistentTxtContent = localStorage.getItem("persistentContent");
  if (persistentTxtContent !== null) {
    document.getElementById("persistentTxt").innerText = persistentTxtContent;
  }
}

// Event listener to capture changes in #persistentTxt
document.getElementById("persistentTxt").addEventListener("input", () => {
  saveToLocalStorage();
});

// Update #persistentTxt from localStorage when the page loads
window.addEventListener("load", () => {
  updateFromLocalStorage();
});


// Function to save content to localStorage with date
function saveDailyToLocalStorage() {
  const dailyTxtContent = document.getElementById("dailyTxt").innerText;
  const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
  localStorage.setItem("dailyContent", JSON.stringify({ date: currentDate, content: dailyTxtContent }));
}

// Function to update content of #dailyTxt from localStorage
function updateDailyFromLocalStorage() {
  const dailyTxtData = JSON.parse(localStorage.getItem("dailyContent"));
  if (dailyTxtData !== null) {
    const currentDate = new Date().toISOString().slice(0, 10); // Get current date in YYYY-MM-DD format
    console.log("Current Date:", currentDate);
    if (dailyTxtData.date === currentDate) {
      document.getElementById("dailyTxt").innerText = dailyTxtData.content;
    } else {
      // Remove the entry from localStorage if it's not for today
      localStorage.removeItem("dailyContent");
    }
  }
}

// Event listener to capture changes in #dailyTxt
document.getElementById("dailyTxt").addEventListener("input", () => {
  saveDailyToLocalStorage();
});

// Update #dailyTxt from localStorage when the page loads
window.addEventListener("load", () => {
  updateDailyFromLocalStorage();
});
