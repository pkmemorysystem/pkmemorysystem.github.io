function savePronounsSelection() {
  const pronounsSelection = document.getElementById("pronounsSelection").value;
  localStorage.setItem("pronounsSelection", pronounsSelection);
  window.location.reload()
}

export function updateNoPronounPlaceholder() {
  // retrieve the selected option from localStorage
  const selectedOption = localStorage.getItem('pronounsSelection');
  const pronounsSelection = document.getElementById('pronounsSelection');

  // set  option based on  localStorage
  if (selectedOption === 'space') {
    pronounsSelection.value = 'space';
  } else if (selectedOption === 'show') {
    pronounsSelection.value = 'show';
  }

  // Return placeholder 
  if (pronounsSelection.value === 'space') {
    return "\u00A0"; // this is supposed to be a space (cause it still needs to be editable)
  } else {
    return "No Pronouns";
  }
}

// update localStorage when the selection changes
document.getElementById('pronounsSelection').addEventListener('change', function() {
  localStorage.setItem('pronounsSelection', this.value);
  savePronounsSelection();
});




// ----------------------------------------
//  
// ----------------------------------------

function updateBackgroundImage() {
  const selectedOption = localStorage.getItem('backgroundSelection');
  const body = document.body;

  if (selectedOption === 'custom') {
    const customImage = localStorage.getItem('customBackgroundImage');
    body.style.backgroundImage = `url('${customImage}')`;
  } else {
    body.style.backgroundImage = "url('bgImg.jpg')";
  }
}

function handleBackgroundSelectionChange() {
  const backgroundSelection = document.getElementById('backgroundSelection');

  const selectedOption = localStorage.getItem('backgroundSelection');
  if (selectedOption) {
    backgroundSelection.value = selectedOption;
  }

  backgroundSelection.addEventListener('change', function() {
    localStorage.setItem('backgroundSelection', this.value);
    updateBackgroundImage(); // Update background image when selection changes
  });
}

function handleCustomBackgroundSubmission() {
  const bgImgSubmission = document.getElementById('bgImgSubmission');

  bgImgSubmission.addEventListener('change', function() {
    const file = this.files[0];
    const reader = new FileReader();

    reader.onload = function(event) {
      const imageData = event.target.result;
      localStorage.setItem('customBackgroundImage', imageData);
      updateBackgroundImage(); // after submission update
    };

    reader.readAsDataURL(file);
  });
}

handleBackgroundSelectionChange();
handleCustomBackgroundSubmission();
updateBackgroundImage(); // Update background image when the page loads

// ----------------------------------------
//  
// ----------------------------------------

const checkbox = document.getElementById('doDividerHandling');
function updateCheckboxLocalStorage() {
  if (checkbox.checked) {
    localStorage.setItem('dividerCheckboxChecked', 'true');
    checkbox.checked = true;
  } else {
    localStorage.setItem('dividerCheckboxChecked', 'false');
  }
}

document.addEventListener('DOMContentLoaded', function() {
  if (localStorage.getItem('dividerCheckboxChecked') === "true") {
    checkbox.checked = true;
  } else {
    checkbox.checked = false;
  }
});

document.getElementById('doDividerHandling').addEventListener('change', function() {
  updateCheckboxLocalStorage();
  setTimeout(function () {
    window.location.reload();
  }, 200);
});
// ----------------------------------------
//  
// ----------------------------------------

document.addEventListener('DOMContentLoaded', function() {
  const preferDisplayNamesCheckbox = document.getElementById('preferDisplayNames');
  preferDisplayNamesCheckbox.checked = localStorage.getItem('preferDisplayNamesChecked') === 'true';

  preferDisplayNamesCheckbox.addEventListener('change', function() {
    localStorage.setItem('preferDisplayNamesChecked', this.checked.toString());
  });
});