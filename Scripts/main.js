import { toggleSettings, showAddToFrontContainer, hideAddToFrontContainer, showfrontersContainer, hidefrontersContainer, showMemberCreationContainer, hideMemberCreationContainer } from './utils.js';
import { TOKEN } from "./init.js";
const alertElement = document.getElementById("alert");

export function showAlert(message) {
  alertElement.textContent = message;
  alertElement.style.left = '0';
  setTimeout(function () {
    alertElement.style.left = '-100%';
  }, 2000);
};

document.addEventListener('DOMContentLoaded', async function () {
  let TOKENkey;

  // Check if the token is already stored in localStorage
  if (!localStorage.getItem('TOKEN')) {
    // If not, prompt the user to enter the token
    TOKENkey = prompt("Please enter your PluralKit API token:");

    // Store the token in localStorage
    if (TOKENkey) {
      localStorage.setItem('TOKEN', TOKENkey);
    }
  }

  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;

  } catch (error) {
    console.error(error);
    showAlert("Failed to fetch members or fronters. Please try again.");
  }

  document.getElementById('hamburger').addEventListener('click', toggleSettings);
  document.getElementById('settingsTitle').addEventListener('click', toggleSettings);

  document.getElementById('addToFront').addEventListener('click', function () {
    showAddToFrontContainer();
    hidefrontersContainer();
    hideMemberCreationContainer();
  });
  document.getElementById('cancelAddToFront').addEventListener('click', hideAddToFrontContainer);

  document.getElementById('checkFronters').addEventListener('click', function () {
    showfrontersContainer();
    hideAddToFrontContainer();
    hideMemberCreationContainer();
  });
  document.getElementById('returnFronters').addEventListener('click', hidefrontersContainer);

  document.getElementById('createMember').addEventListener('click', function () {
    showMemberCreationContainer();
    hidefrontersContainer();
    hideAddToFrontContainer();
  });
  document.getElementById('cancelCreateMember').addEventListener('click', hideMemberCreationContainer);
  
});
