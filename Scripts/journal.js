
function saveToLocalStorage() {
  const persistentTxtContent = document.getElementById("persistentTxt").innerText;
  localStorage.setItem("persistentContent", persistentTxtContent);
}

function updateFromLocalStorage() {
  const persistentTxtContent = localStorage.getItem("persistentContent");
  if (persistentTxtContent !== null) {
    document.getElementById("persistentTxt").innerText = persistentTxtContent;
  }
}

updateFromLocalStorage();


document.addEventListener("DOMContentLoaded", () => {
  updateFromLocalStorage();
});

document.getElementById("persistentTxt").addEventListener("input", () => {
  saveToLocalStorage();
});

window.addEventListener("load", () => {
  updateFromLocalStorage();
});



// Daily
function getCurrentDate() {
  const now = new Date();
  const year = now.getFullYear();
  let month = now.getMonth() + 1;
  let day = now.getDate();

  if (month < 10) {
    month = '0' + month;
  }
  if (day < 10) {
    day = '0' + day;
  }

  return `${year}-${month}-${day}`;
}
console.log(getCurrentDate());

function saveDailyText() {
  const dailyTxtContent = document.getElementById("dailyTxt").innerText.trim();
  const currentDate = getCurrentDate();
  
  if (dailyTxtContent) {
    localStorage.setItem("dailyText", JSON.stringify({ content: dailyTxtContent, date: currentDate }));
  } else {
    localStorage.removeItem("dailyText");
  }
}

function loadDailyText() {
  const dailyContent = JSON.parse(localStorage.getItem("dailyText"));
  
  if (dailyContent && dailyContent.date === getCurrentDate()) {
    document.getElementById("dailyTxt").innerText = `${dailyContent.date} • ${dailyContent.content}`;
  } else {
    document.getElementById("dailyTxt").innerText = '';
    localStorage.removeItem("dailyText");
  }
}
loadDailyText();

document.getElementById("dailyTxt").addEventListener("blur", function() {
  const dailyContent = JSON.parse(localStorage.getItem("dailyText"));
  if (dailyContent) {
    document.getElementById("dailyTxt").innerText = `${dailyContent.date} \u2022 ${dailyContent.content}`;
  }
});


document.getElementById("dailyTxt").addEventListener("input", saveDailyText);

document.getElementById("dailyTxt").addEventListener("focus", function() {
  const dailyContent = JSON.parse(localStorage.getItem("dailyText"));
  if (dailyContent) {
    document.getElementById("dailyTxt").innerText = dailyContent.content;
  }
});

window.addEventListener("load", loadDailyText);
