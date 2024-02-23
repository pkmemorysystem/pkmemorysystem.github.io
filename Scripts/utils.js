export function toggleSettings() {
  const settingsContainer = document.getElementById('settingsContainer');
    const currentRight = parseInt(getComputedStyle(settingsContainer).right);

    if (currentRight === 0) {
      settingsContainer.style.right = '-1000vw'; // Hide settings
    } else {
      settingsContainer.style.right = '0'; // Show settings
    }
}

export function showAddToFrontContainer() {
  const addToFrontContainer = document.getElementById('addToFrontContainer');
  const containerHeight = addToFrontContainer.offsetHeight;
  const topPosition = `calc(50% - (${containerHeight}px / 2))`;
  addToFrontContainer.style.top = topPosition;
}

export function hideAddToFrontContainer() {
  const addToFrontContainer = document.getElementById('addToFrontContainer');
  addToFrontContainer.style.top = "-1000vh"; // Move the container off-screen to hide it
}


export function showfrontersContainer() {
  const frontersContainer = document.getElementById('frontersContainer');
  const containerHeight = frontersContainer.offsetHeight;
  const bottomPosition = `calc(50% - (${containerHeight}px / 2))`;
  frontersContainer.style.bottom = bottomPosition;
}

export function hidefrontersContainer() {
  const frontersContainer = document.getElementById('frontersContainer');
  frontersContainer.style.bottom = "-1000vh"; // Move the container off-screen to hide it
}


export function showMemberCreationContainer() {
  const createMemberContainer = document.getElementById('createMemberContainer');
  const containerHeight = createMemberContainer.offsetWidth;
  const leftPosition = `calc(50% - (${containerHeight}px / 2))`;
  createMemberContainer.style.left = leftPosition;
}

export function hideMemberCreationContainer() {
  const createMemberContainer = document.getElementById('createMemberContainer');
  createMemberContainer.style.left = "-1000vw"; // Move the container off-screen to hide it
}

export function hideMemberInfo() {
  const memberInfo = document.getElementById('memberInfo');
  memberInfo.style.top = "-1000vh"
}



window.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('important');
  const texts = container.querySelectorAll('.importantText');
  const scrollingText = document.getElementById('scrollingText');
  
  try {
    const response = await fetch('Scripts/phrases.json');
    
    if (!response.ok) {
      throw new Error('Failed to load phrases');
    }

    const data = await response.json();
    const phrases = data.phrases;
    
    texts.forEach(text => {
    const randomIndex = Math.floor(Math.random() * phrases.length);
    const randomPhrase = phrases[randomIndex];

      text.textContent = randomPhrase;
      
      const totalWidth = Array.from(texts).reduce((acc, text) => acc + text.offsetWidth, 0);
      
      if (totalWidth >= container.clientWidth) {
        scrollingText.style.animation = 'scrollText 15s linear infinite';
      }
    });
  } catch (error) {
    console.error(error);
  }
});