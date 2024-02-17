async function fetchMembers(apiUrl, systemRef, TOKEN) {
  try {
    const response = await fetch(`${apiUrl}/systems/${systemRef}/members`, {
      headers: {
        Authorization: TOKEN
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch members");
    }

    const members = await response.json();

    // console.log("Members:", members);
    // Generate and apply unique classes for each member
    // members.forEach((member) => {
    //   const className = `member-${member.id}`;
    //   member.class = className;
    // });
    return members;
  } catch (error) {
    console.error(error);
    return [];
  }
}
window.fetchMembers = fetchMembers;

async function fetchFronters() {
  try {
    const response = await fetch(`${window.apiUrl}/systems/${window.systemRef}/fronters`, {
      headers: {
        Authorization: window.TOKEN
      },
    });
    
    if (!response.ok) {
      console.log("No response");
      throw new Error("Failed to fetch fronters");
    }
    
    const responseData = await response.text();
    if (!responseData.trim()) {
      // If response is empty, display "No One"
      console.log("No response data");
      return; // Exit the function
    }
    const fronters = JSON.parse(responseData);
    
    // Is there the members array
    if (!fronters || !Array.isArray(fronters.members) || fronters.members.length === 0) {
      console.log("invalid or empty response format");
      
    }
    
    // console.log("Fronters:", fronters.members);
    
    // const frontingMember = document.getElementById("frontingMember");
    
      // display them names separated by commas
    // const frontersNames = fronters.members.map(member => member.name).join(", ");
    // frontingMember.textContent = frontersNames;
    return fronters;
  } catch (error) {
    showAlert("Error: Fetching Fronters was unsuccessful.")
    return [];
  }
}
window.fetchFronters = fetchFronters;

async function populateFrontersList() {
  try {
    const fronters = await fetchFronters(window.apiUrl, window.systemRef, window.TOKEN);

    if (!fronters || !Array.isArray(fronters.members) || fronters.members.length === 0) {
      showAlert("No fronters available.");
      return;
    }

    const frontersListContainer = document.getElementById("frontersList");
    frontersListContainer.innerHTML = ""; // Clear previous content

    fronters.members.forEach((member) => {
      const memberTab = document.createElement("div");
        memberTab.classList.add("memberTab");
        memberTab.style.height = "100px";
        memberTab.style.padding = "0.5em";
        memberTab.style.background = "rgba(24, 24, 24, 0.301)";
        memberTab.style.display = "grid";
        memberTab.style.gridTemplateColumns = "100px 1fr";

        const img = document.createElement("img");
        img.style.width = "100%";
        img.style.height = "100%";
        img.src = member.avatar_url || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";

        const infoContainer = document.createElement("div");
        infoContainer.style.margin = "0 auto";
        infoContainer.style.display = "flex";
        infoContainer.style.flexDirection = "column";
        infoContainer.style.justifyContent = "center";

        const nameHeading = document.createElement("h3");
        nameHeading.style.margin = "0";
        nameHeading.textContent = member.name;

        const pronounsHeading = document.createElement("h4");
        pronounsHeading.style.margin = "0";
        pronounsHeading.textContent = member.pronouns || "No Pronouns";

        // Append elements to memberTab
        memberTab.appendChild(img);
        infoContainer.appendChild(nameHeading);
        infoContainer.appendChild(pronounsHeading);
        memberTab.appendChild(infoContainer);

        // Append memberTab to fronters list container
        frontersListContainer.appendChild(memberTab);
    });
  } catch (error) {
    console.error(error);
    showAlert("Error: Failed to populate fronters list.");
  }
}

// Call populateFrontersList when the DOM content is loaded
document.addEventListener('DOMContentLoaded', populateFrontersList);

document.getElementById("checkFronters");

function displayMembers(members) {
  // Sort members array alphabetically by name
  members.sort((a, b) => a.name.localeCompare(b.name));
  
  const memberList = document.getElementById("memberContainer");
  const frontMemberList = document.getElementById("frontMemberList");
  
  members.forEach((member) => {
    // Create HTML elements for the main member list
    const memberDiv = document.createElement("div");
    memberDiv.classList.add("member");
    memberDiv.dataset.memberId = member.id;
    
    const memberSelf = document.createElement("p");
    memberSelf.textContent = member.id;
    memberSelf.style.position = "relative";
    memberSelf.style.textAlign = "left";
    memberSelf.style.height = 0;
    memberSelf.style.margin = "2px";
    memberSelf.style.zIndex = "-8";
    memberSelf.style.userSelect = "none";
    
    const memberImg = document.createElement("img");
    memberImg.dataset.memberId = member.id;
    memberImg.src = member.avatar_url || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";
    memberImg.alt = member.name + "'s avatar";
    memberImg.draggable = false;
    
    const x = document.createElement("span");
    x.textContent = "x";
    x.style.color = "red";
    x.style.opacity = "0.25";
    x.style.cursor = "pointer";
    x.userSelect = "none";

    const memberName = document.createElement("h3");
    memberName.textContent = member.name;
    
    const memberPronouns = document.createElement("h4");
    memberPronouns.textContent = member.pronouns || "No Pronouns";
    
    const memberColor = document.createElement("div");
    memberColor.classList.add("member-color");
    memberColor.style.backgroundColor = "#" + (member.color || "00000030"); // Default color black
    
    memberDiv.appendChild(x);
    memberDiv.appendChild(memberSelf);
    memberDiv.appendChild(memberImg);
    memberDiv.appendChild(memberName);
    memberDiv.appendChild(memberPronouns);
    memberDiv.appendChild(memberColor);
    
    memberList.appendChild(memberDiv);
    
    // Create HTML elements for the list in frontMemberList
    const memberTab = document.createElement("div");
    memberTab.classList.add("memberTab");
    memberTab.style.height = "100px";
    memberTab.style.padding = "0.5em";
    memberTab.style.background = "rgba(24, 24, 24, 0.301)";
    memberTab.style.display = "grid";
    memberTab.style.gridTemplateColumns = "100px 1fr auto";
    
    const img = document.createElement("img");
    img.style.width = "100%";
    img.style.height = "100%";
    img.src = member.avatar_url || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";
    
    const infoContainer = document.createElement("div");
    infoContainer.style.margin = "0 auto";
    infoContainer.style.display = "flex";
    infoContainer.style.flexDirection = "column";
    infoContainer.style.justifyContent = "center";
    
    const nameHeading = document.createElement("h3");
    nameHeading.style.margin = "0";
    nameHeading.textContent = member.name;
    
    const pronounsHeading = document.createElement("h4");
    pronounsHeading.style.margin = "0";
    pronounsHeading.textContent = member.pronouns || "No Pronouns";
    
    const checkbox = document.createElement("input");
    checkbox.style.margin = "1em";
    checkbox.type = "checkbox";
    checkbox.id = `frontingBool-${member.id}`;
    checkbox.name = "areTheyFronting";
    
    // Append elements to memberTab
    memberTab.appendChild(img);
    infoContainer.appendChild(nameHeading);
    infoContainer.appendChild(pronounsHeading);
    memberTab.appendChild(infoContainer);
    memberTab.appendChild(checkbox);
    
    // Append memberTab to frontMemberList
    frontMemberList.appendChild(memberTab);

    x.addEventListener("mouseover", () => {
      x.style.opacity = "1";
    });
    
    // Add event listener for mouseout to change opacity back to 0.25
    x.addEventListener("mouseout", () => {
      x.style.opacity = "0.25";
    });

    // Assuming `member` is the object representing the member you want to delete
    const memberId = member.id; // Replace this with the actual member ID

    // Add event listener for click to delete the member
    x.addEventListener("dblclick", async () => {
      try {
        const response = await fetch(`https://api.pluralkit.me/v2/members/${memberId}`, {
          method: "DELETE",
          headers: {
            "Authorization": TOKEN // Assuming TOKEN is the authorization token
          }
        });
      
        if (!response.ok) {
          throw new Error("Failed to delete member");
        }
      
        // Optionally, you can remove the UI element for the member here
        // For example:
        // x.parentElement.remove(); // Remove the parent element of the "x" span
      
        showAlert("Member deleted successfully");
        setTimeout(function () {
          window.location.reload();
        }, 4000);
      } catch (error) {
        console.error("Error deleting member:", error);
      }
    });


  });
}
window.displayMembers = displayMembers;

document.getElementById('switch').addEventListener('click', async function () {
  try {
    console.log("Starting switch recording process...");

    const checkedMembers = [];
    const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');



    console.log("Identifying selected members...");
    checkboxes.forEach(checkbox => {
      const checkboxIdParts = checkbox.id.split('-');
      if (checkboxIdParts.length !== 2) {
        console.error("Invalid checkbox ID format:", checkbox.id);
        return; // Skip this checkbox if ID format is invalid
      }
      const memberId = checkboxIdParts[1]; // Extract member ID from checkbox ID
      checkedMembers.push(memberId);
    });

    console.log("Selected member IDs:", checkedMembers); // Log the array after all members are added

    console.log("Constructing request body...");
    const timestamp = new Date().toISOString(); // Get current timestamp
    const requestBody = {
      timestamp: timestamp,
      members: checkedMembers
    };

    console.log("Sending POST request to record switch...");
    const response = await fetch(`${apiUrl}/systems/${systemRef}/switches`, {
      method: 'POST',
      headers: {
        'Authorization': TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      throw new Error("Failed to record switch. Server responded with status: " + response.status);
    }

    showAlert("Switch recorded successfully");
    setTimeout(function () {
      window.location.reload();
    }, 4000);

    // Optionally, you can reset the checkboxes after recording the switch
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
  } catch (error) {
    console.error("Error:", error.message);
  }
});

document.getElementById('memberContainer').addEventListener('dblclick', function (event) {
  if (event.target.tagName === 'H3' || event.target.tagName === 'H4') {
    const memberElement = event.target.closest('.member');
    const memberId = memberElement.dataset.memberId;
    event.target.contentEditable = true;
    event.target.focus();

    event.target.addEventListener('keydown', async function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        const newValue = event.target.textContent.trim();
        const attribute = event.target.tagName === 'H3' ? 'name' : 'pronouns';
        if (newValue !== '') {
          await updateAttribute(memberId, attribute, newValue);
        }
      }
    });
  } else if (event.target.tagName === 'IMG') {
    const memberId = event.target.dataset.memberId;
    const imageUrl = prompt("Please enter the URL of the image you want to use as the avatar:");
    if (imageUrl) {
      updateAvatar(memberId, imageUrl);
    }
  } else if (event.target.classList.contains('member-color')) {
    const memberId = event.target.closest('.member').dataset.memberId;
    const color = prompt("Please select a color:");
    if (color) {
      updateColor(memberId, color);
    }
  }
});

async function updateAttribute(memberId, attribute, newValue) {
  try {
    const response = await fetch(`${apiUrl}/members/${memberId}`, {
      method: 'PATCH',
      headers: {
        Authorization: TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ [attribute]: newValue })
    });

    if (!response.ok) {
      const errorMessage = await response.text();
      showAlert(`Failed to update ${attribute}: ${errorMessage}`);
      throw new Error(`Failed to update ${attribute}: ${errorMessage}`);
    }

    console.log(`${attribute} updated successfully`);
    showAlert("Attribute Updated");
    setTimeout(function () {
      window.location.reload();
    }, 4000);

  } catch (error) {
    console.error(error);
    showAlert(`Failed to update member ${attribute}. Please try again.`);
    window.location.reload();
  }
}

async function updateAvatar(memberId, imageUrl) {
  try {
    const response = await fetch(`${apiUrl}/members/${memberId}`, {
      method: 'PATCH',
      headers: {
        Authorization: TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ avatar_url: imageUrl }) // Send image URL in request body
    });

    if (!response.ok) {
      throw new Error("Failed to update avatar");
    }

    console.log("Avatar updated successfully");
    if (imageUrl) {
      window.location.reload();
    }
  } catch (error) {
    console.error(error);
  }
}

async function updateColor(memberId, color) {
  try {
    const sanitizedColor = color.startsWith('#') ? color.substring(1) : color;
    const response = await fetch(`${apiUrl}/members/${memberId}`, {
      method: 'PATCH',
      headers: {
        Authorization: TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ color: sanitizedColor })
    });

    if (!response.ok) {
      throw new Error("Failed to update color");
    }

    console.log("Color updated successfully");
    window.location.reload();
  } catch (error) {
    console.error(error);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const createMemberForm = document.getElementById('createMemberForm');

  createMemberForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(createMemberForm);
    const memberName = formData.get('name');

    // Step 1: Create the member with just the name
    try {
      const createResponse = await fetch(`${apiUrl}/members`, {
        method: 'POST',
        headers: {
          'Authorization': TOKEN,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: memberName }), // Only include the name
      });

      if (!createResponse.ok) {
        throw new Error('Failed to create member');
      }

      const newMember = await createResponse.json();
      showAlert('New member created!');

      // Sequentially modify the member with additional information
      await modifyMember(newMember.id, formData);
    } catch (error) {
      console.error(error);
    }
  });
});

async function modifyMember(memberId, formData) {
  try {
    // Step 2: Modify the member color
    const memberColor = formData.get('color');
    const sanitizedColor = memberColor.startsWith('#') ? memberColor.substring(1) : memberColor;
    const modifyColorResponse = await fetch(`${apiUrl}/members/${memberId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ color: sanitizedColor }),
    });

    if (!modifyColorResponse.ok) {
      throw new Error('Failed to modify member color');
    }
    showAlert('Member color modified');

    // Step 3: Modify the member pronouns
    const memberPronouns = formData.get('pronouns');
    const modifyPronounsResponse = await fetch(`${apiUrl}/members/${memberId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ pronouns: memberPronouns }),
    });

    if (!modifyPronounsResponse.ok) {
      throw new Error('Failed to modify member pronouns');
    }
    showAlert('Member pronouns modified');

    // Step 4: Modify the member avatar
    const memberAvatar = formData.get('avatar');
    const modifyAvatarResponse = await fetch(`${apiUrl}/members/${memberId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ avatar_url: memberAvatar }),
    });

    if (!modifyAvatarResponse.ok) {
      throw new Error('Failed to modify member avatar');
    }
    showAlert('Member avatar modified');
    setTimeout(function () {
      window.location.reload();
    }, 4000);
  } catch (error) {
    console.error(error);
  }
}