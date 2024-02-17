import { toggleSettings, showAddToFrontContainer, hideAddToFrontContainer, showfrontersContainer, hidefrontersContainer, showMemberCreationContainer, hideMemberCreationContainer } from './utils.js';

document.addEventListener('DOMContentLoaded', async function () {
  setTimeout(function () {
    if (!TOKEN) {
      TOKEN = prompt("Please enter your PluralKit API token:");
      localStorage.setItem('TOKEN', TOKEN);
        window.location.reload();
      
    }
  }, 200);

  const alertElement = document.getElementById("alert");

  window.showAlert = function(message) {
    alertElement.textContent = message;
    alertElement.style.left = '0';
    setTimeout(function () {
      alertElement.style.left = '-100%';
    }, 2000);
  };

  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const members = await window.fetchMembers(window.apiUrl, window.systemRef, window.TOKEN);
    const fronters = await window.fetchFronters(window.apiUrl, window.systemRef, window.TOKEN);

    window.displayMembers(members, fronters);

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
