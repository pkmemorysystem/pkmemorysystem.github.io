import { updateNoPronounPlaceholder } from './settings.js';
import { systemRef, apiUrl, TOKEN } from "./init.js";
import { showAlert } from "./main.js";
import { fetchSystem } from "./system.js";

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
    console.log(members);
    return members;
  } catch (error) {
    console.error(error);
    return [];
  }
}

const members = await fetchMembers(apiUrl, systemRef, TOKEN);

async function fetchFronters() {
  try {
    const response = await fetch(`${apiUrl}/systems/${systemRef}/fronters`, {
      headers: {
        Authorization: TOKEN
      },
    });

    if (!response.ok) {
      console.log("No response");
      throw new Error("Failed to fetch fronters");
    }

    const responseData = await response.text();
    if (!responseData.trim()) {
      console.log("No response data");
      return;
    }
    const fronters = JSON.parse(responseData);

    // Is there the members array
    if (!fronters || !Array.isArray(fronters.members) || fronters.members.length === 0) {
      console.log("Invalid or empty response format. Probably no one's fronting");
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
const fronters = await fetchFronters(apiUrl, systemRef, TOKEN);

async function populateFrontersList() {
  try {
    if (!fronters || !Array.isArray(fronters.members) || fronters.members.length === 0) {
      console.log("No fronters available.");
      return;
    }

    const frontersListContainer = document.getElementById("frontersList");
    frontersListContainer.style.overflow = "auto";
    frontersListContainer.innerHTML = ""; // clear previous content

    fronters.members.forEach((member) => {
      // Fronters
      const memberTab = document.createElement("div");
      memberTab.classList.add("memberTab");
      memberTab.style.height = "100px";
      memberTab.style.padding = "0.5em";
      memberTab.style.background = "rgba(24, 24, 24, 0.301)";
      memberTab.style.display = "grid";
      memberTab.style.gridTemplateColumns = "100px 1fr";

      const imgContainer = document.createElement("div");
      imgContainer.style.width = "100px";
      imgContainer.style.overflow = "hidden";

      const img = document.createElement("img");
      img.style.width = "100%";
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
      pronounsHeading.textContent = member.pronouns || " ";

      imgContainer.appendChild(img);
      memberTab.appendChild(imgContainer);
      infoContainer.appendChild(nameHeading);
      infoContainer.appendChild(pronounsHeading);
      memberTab.appendChild(infoContainer);

      frontersListContainer.appendChild(memberTab);
    });

  } catch (error) {
    console.error(error);
    showAlert("Error: Failed to populate fronters list.");
  }
}

async function displayMembers(members, fronters) {
  const memberList = document.getElementById("memberContainer");
  const frontMemberList = document.getElementById("frontMemberList");

  const searchInput = document.getElementById('searchInput');
  const searchFrontInput = document.getElementById('searchFrontInput'); // Add this line


  searchInput.addEventListener('input', function () {
    const searchTerm = this.value.toLowerCase().trim();
    const memberList = document.querySelectorAll('.member');

    memberList.forEach(member => {
      const memberName = member.querySelector('h3').textContent.toLowerCase();

      if (memberName.includes(searchTerm)) {
        member.style.display = 'block'; // Show the member if it matches the search term
      } else {
        member.style.display = 'none'; // Hide the member if it doesn't match the search term
      }
    });
  });

  searchFrontInput.addEventListener('input', function () { // Add this function
    const searchTerm = this.value.toLowerCase().trim();
    const frontMemberList = document.querySelectorAll('.memberTab');

    frontMemberList.forEach(member => {
      const memberName = member.querySelector('h3').textContent.toLowerCase();

      if (memberName.includes(searchTerm)) {
        member.style.display = 'grid'; // Show the member if it matches the search term
      } else {
        member.style.display = 'none'; // Hide the member if it doesn't match the search term
      }
    });
  });

  members.sort((a, b) => {
    const nameA = localStorage.getItem('preferDisplayNamesChecked') === 'true' && a.display_name ? a.display_name.toLowerCase() : a.name.toLowerCase();
    const nameB = localStorage.getItem('preferDisplayNamesChecked') === 'true' && b.display_name ? b.display_name.toLowerCase() : b.name.toLowerCase();
    return nameA.localeCompare(nameB);
  });
  members.forEach((member) => {
    // if (!member.name.startsWith("```") || !member.name.endsWith("```")) {
    //   // Add member to the main member list if it's not a divider member
    //   const memberDiv = createMemberDiv(member);
    //   memberList.appendChild(memberDiv);
    // }
    if (member.name.startsWith("```") && member.name.endsWith("```")) {
      if (localStorage.getItem('dividerCheckboxChecked') !== "true") {
        const memberDiv = createMemberDiv(member);
        memberList.appendChild(memberDiv);
      }
    } else {
      const memberDiv = createMemberDiv(member);
      memberList.appendChild(memberDiv);
    }


    // always add member to the front member list
    const memberTab = createMemberTab(member);
    frontMemberList.appendChild(memberTab);
    populateFrontersList();
  });
}

function createMemberDiv(member) {
  // Create member div element
  const memberDiv = document.createElement("div");
  memberDiv.classList.add("member");
  memberDiv.style.touchAction = "manipulation";
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

  const x = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  x.classList.add("btn");
  x.style.height = "2em";
  x.style.width = "2em";
  x.style.opacity = "0.25";
  x.setAttribute("clip-rule", "evenodd");
  x.setAttribute("fill-rule", "evenodd");
  x.setAttribute("stroke-linejoin", "round");
  x.setAttribute("stroke-miterlimit", "2");
  x.setAttribute("viewBox", "0 0 24 24");

  const xPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  xPath.style.opacity = "0.25";
  xPath.setAttribute("fill", "red");
  xPath.setAttribute("d", "m12 10.93 5.719-5.72c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.385-.219.532l-5.72 5.719 5.719 5.719c.147.147.22.339.22.531 0 .427-.349.75-.75.75-.192 0-.385-.073-.531-.219l-5.719-5.719-5.719 5.719c-.146.146-.339.219-.531.219-.401 0-.75-.323-.75-.75 0-.192.073-.384.22-.531l5.719-5.719-5.72-5.719c-.146-.147-.219-.339-.219-.532 0-.425.346-.749.75-.749.192 0 .385.073.531.219z");

  const memberName = document.createElement("h3");
  // memberName.textContent = localStorage.getItem('preferDisplayNamesChecked') === 'true' ? member.display_name : member.name;
  if (localStorage.getItem('preferDisplayNamesChecked') === 'true' && member.display_name) {
    memberName.textContent = member.display_name;
  } else {
    memberName.textContent = member.name;
  }


  let noPronounPlaceholder = updateNoPronounPlaceholder();
  const memberPronouns = document.createElement("h4");
  memberPronouns.textContent = member.pronouns || `${noPronounPlaceholder}`;

  const memberColor = document.createElement("div");
  memberColor.classList.add("member-color");
  memberColor.style.backgroundColor = "#" + (member.color || "00000030"); // Default color black

  x.appendChild(xPath);
  memberDiv.appendChild(x);
  memberDiv.appendChild(memberSelf);
  memberDiv.appendChild(memberImg);
  memberDiv.appendChild(memberName);
  memberDiv.appendChild(memberPronouns);
  memberDiv.appendChild(memberColor);

  x.addEventListener("mouseover", () => {
    xPath.style.opacity = "1";
  });

  x.addEventListener("mouseout", () => {
    xPath.style.opacity = "0.25";
  });

  x.addEventListener("dblclick", async (event) => {
    event.preventDefault();
    event.stopPropagation(); // Prevent the event from bubbling up to the member element
    const memberDiv = event.target.closest(".member"); // Find the closest parent member element
    if (memberDiv) {
      const memberId = memberDiv.dataset.memberId; // Extract the member ID
      try {
        const response = await fetch(`${apiUrl}/members/${memberId}`, {
          method: "DELETE",
          headers: {
            Authorization: TOKEN,
          },
        });
        if (!response.ok) {
          throw new Error("Failed to delete member");
        }
        showAlert("Member deleted successfully");
        memberDiv.remove(); // Remove the member element from the DOM
      } catch (error) {
        console.error(error);
        showAlert("Failed to delete member");
      }
    }
  });

  return memberDiv;
}


let checkedMembers = [];
function createMemberTab(member) {
  // for frontMemberList
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
  // nameHeading.textContent = member.name;
  if (localStorage.getItem('preferDisplayNamesChecked') === 'true' && member.display_name) {
    nameHeading.textContent = member.display_name;
  } else {
    nameHeading.textContent = member.name;
  }

  const pronounsHeading = document.createElement("h4");
  pronounsHeading.style.margin = "0";
  pronounsHeading.textContent = member.pronouns || "No Pronouns";

  const checkbox = document.createElement("input");
  checkbox.style.margin = "1em";
  checkbox.type = "checkbox";
  checkbox.id = `frontingBool-${member.id}`;
  checkbox.name = "areTheyFronting";

  memberTab.appendChild(img);
  infoContainer.appendChild(nameHeading);
  infoContainer.appendChild(pronounsHeading);
  memberTab.appendChild(infoContainer);
  memberTab.appendChild(checkbox);

  checkbox.addEventListener('change', function () {
    if (this.checked) {
      checkedMembers.push(member.id);
      console.log('Member added to switch list:', member.id);
    } else {
      const index = checkedMembers.indexOf(member.id);
      if (index !== -1) {
        checkedMembers.splice(index, 1);
        console.log('Member removed from switch list:', member.id);
      }
    }
  });

  frontMemberList.appendChild(memberTab);

  return memberTab;
}

displayMembers(members, fronters);

document.getElementById('switch').addEventListener('click', async function () {
  try {
    const timestamp = new Date().toISOString(); // get current time
    const requestBody = {
      timestamp: timestamp,
      members: checkedMembers
    };

    showAlert("Recording switch...");
    const response = await fetch(`${apiUrl}/systems/${systemRef}/switches`, {
      method: 'POST',
      headers: {
        'Authorization': TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      showAlert("Error " + response.status + ". Failed to record switch")
      throw new Error("Failed to record switch. Server responded with status: " + response.status);
    }

    showAlert("Switch recorded successfully");
    setTimeout(function () {
      window.location.reload();
    }, 2000);

  } catch (error) {
    console.error("Error:", error.message);
  }
});

// Function to fetch member data
async function fetchMember(memberRef) {
  try {
    const response = await fetch(`${apiUrl}/members/${memberRef}`, {
      headers: {
        Authorization: TOKEN
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch member data");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching member data:", error);
    return null;
  }
}

async function fetchMemberGroups(memberId) {
  try {
    const response = await fetch(`${apiUrl}/members/${memberId}/groups`, {
      headers: {
        Authorization: TOKEN
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch member groups");
    }

    const groups = await response.json();
    return groups;
  } catch (error) {
    console.error(error);
    return [];
  }
}

document.getElementById("memberContainer").addEventListener("contextmenu", async function (event) {
  event.preventDefault();

  if (event.target.tagName === "IMG") {
    const memberId = event.target.dataset.memberId;

    try {
      const member = await fetchMember(memberId);

      if (!member) {
        throw new Error("Member data not found");
      }

      const system = await fetchSystem(apiUrl, systemRef, TOKEN);

      document.getElementById("memberInfoName").textContent = member.name;

      if (system.tag) {
        document.getElementById("memberInfoTag").textContent = system.tag;
      } else {
        document.getElementById("memberInfoTag").textContent = "";
      }

      document.getElementById("memberInfoColor").style.backgroundColor = `#${member.color}`;

      if (member.display_name) {
        document.getElementById("memberInfoDN").innerHTML = member.display_name;
      } else {
        document.getElementById("memberInfoDN").parentElement.style.opacity = 0;
      }

      if (member.avatar_url) {
        document.getElementById("memberInfoImg").src = member.avatar_url;
      } else {
        document.getElementById("memberInfoImg").src = "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";
      }

      const memberDescription = member.description.replace(/\n/g, "<br>");

      document.getElementById("memberInfoDesc").innerHTML = memberDescription;
      document.getElementById("memberInfoDesc").setAttribute("data-member-id", memberId);

      const memberInfoPronouns = document.getElementById("memberInfoPronouns");

      if (member.pronouns) {
        memberInfoPronouns.textContent = member.pronouns;
      } else {
        memberInfoPronouns.textContent = "No Pronouns Set";
      }

      memberInfoPronouns.setAttribute("data-member-id", memberId);
      let originalPronouns;

      function handlePronounsEdit(event) {
        memberInfoPronouns.contentEditable = "true";
        originalPronouns = memberInfoPronouns.textContent;
        memberInfoPronouns.focus();

        memberInfoPronouns.addEventListener("keydown", handleKeyDown);
      }

      function handleKeyDown(event) {
        if (event.key === "Enter") {
          event.preventDefault();

          const newPronouns = memberInfoPronouns.textContent.trim();

          if (newPronouns !== originalPronouns) {
            updateAttribute(memberId, "pronouns", newPronouns);
          }

          memberInfoPronouns.contentEditable = "false";
          memberInfoPronouns.removeEventListener("keydown", handleKeyDown);
        }
      }

      memberInfoPronouns.addEventListener("dblclick", handlePronounsEdit);

      const memberInfoBday = document.getElementById("memberInfoBday");
      if (member.birthday) {
        memberInfoBday.textContent = member.birthday;
      } else {
        memberInfoBday.textContent = "No Birthday Set";
      }
      memberInfoBday.setAttribute("data-member-id", memberId);
      let originalBday;

      function handleDoubleClick(event) {
        originalBday = memberInfoBday.textContent;
        memberInfoBday.innerHTML = `<input type="date" value="${originalBday}">`;

        const inputField = memberInfoBday.querySelector("input");
        inputField.focus();

        inputField.addEventListener("blur", handleBlur);
      }

      function handleBlur(event) {
        const inputField = event.target;
        const newBday = inputField.value;

        if (newBday !== originalBday) {
          memberInfoBday.textContent = newBday;
          updateAttribute(memberId, "birthday", newBday);
        } else {
          memberInfoBday.textContent = originalBday;
        }

        inputField.remove();
        inputField.removeEventListener("blur", handleBlur);
      }

      memberInfoBday.addEventListener("dblclick", handleDoubleClick);


      document.getElementById("memberInfoBanner").style.backgroundImage = `url('${member.banner}')`;

      document.getElementById("memberInfo").style.top = `calc(50% - (700px / 2))`;

      const memberGroups = await fetchMemberGroups(memberId);

      const memberGroupsElement = document.getElementById("memberInfoGroups");
      if (memberGroups.length === 0) {
        memberGroupsElement.textContent = "No Groups";
      } else {
        const groupNames = memberGroups.map(group => group.name);
        memberGroupsElement.textContent = groupNames.join(", ");
      }

      document.getElementById("memberInfoDesc").addEventListener("keydown", function (event) {
        if (event.key === "Enter" && event.shiftKey) {
          return;
        }
        console.log("Now content :: ", this.innerHTML)
        if (event.key === "Enter") {
          event.preventDefault();
          const memberId = this.dataset.memberId;
          const newValue = this.innerHTML.replace(/<br>/g, "\n");
          console.log(newValue);
          updateAttribute(memberId, 'description', newValue);
        }
      });


    } catch (error) {
      console.error("Error updating member info:", error);
    }
  }

});



document.getElementById('memberContainer').addEventListener('dblclick', function (event) {
  if (event.target.tagName === 'H3' || event.target.tagName === 'H4') {
    const memberElement = event.target.closest('.member');
    const memberId = memberElement.dataset.memberId;
    const isPronouns = event.target.tagName === 'H4';
    event.target.contentEditable = true;
    event.target.focus();

    event.target.addEventListener('keydown', async function (event) {
      if (event.key === 'Enter') {
        event.preventDefault();
        const newValue = event.target.textContent.trim();
        const attribute = isPronouns ? 'pronouns' : 'name';
        if (newValue !== '') {
          await updateAttribute(memberId, attribute, newValue);
        } else {
          if (isPronouns) {
            await updateAttribute(memberId, 'pronouns', '');
          }
        }
      }
    });
  } else if (event.target.tagName === 'IMG') {
    const memberId = event.target.dataset.memberId;
    const imageUrl = prompt("Please enter the URL of the image you want to use as the avatar:");
    if (imageUrl) {
      updateAttribute(memberId, avatar_url, imageUrl);
    }
  } else if (event.target.classList.contains('member-color')) {
    const memberId = event.target.closest('.member').dataset.memberId;
    const colorNew = prompt("Please select a color:");
    if (color) {
      updateAttribute(memberId, color, colornew);
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

  } catch (error) {
    console.error(error);
    showAlert(`Failed to update member ${attribute}. Please try again.`);
    window.location.reload();
  }
}

const memberForm = document.getElementById('memberForm');
const createMemberForm = document.getElementById('createMemberForm');

createMemberForm.addEventListener('click', async (e) => {
  console.log("Create Member form button clicked");
  e.preventDefault();

  const formData = new FormData(memberForm);

  const memberName = formData.get('name');
  const memberColor = formData.get('color');
  const memberPronouns = formData.get('pronouns');
  const memberAvatar = formData.get('avatar');

  console.log("Member Name:", memberName);
  console.log("Member Color:", memberColor);
  console.log("Member Pronouns:", memberPronouns);
  console.log("Member Avatar:", memberAvatar);

  // Step 1: create the member with just the name
  try {
    console.log("Attempting to create member...");
    const createResponse = await fetch(`${apiUrl}/members`, {
      method: 'POST',
      headers: {
        'Authorization': TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: memberName }), // only include the name
    });

    if (!createResponse.ok) {
      throw new Error('Failed to create member');
    }

    const newMember = await createResponse.json();
    console.log('New member created :: ', newMember);
    showAlert('New member created :: ' + newMember.name);

    await modifyMember(newMember.id, { color: memberColor, pronouns: memberPronouns, avatar: memberAvatar });
  } catch (error) {
    console.error(error);
  }
});


async function modifyMember(memberId, formData) {
  try {
    // Step 2: Modify the member color
    const formData = new FormData(memberForm);
    const memberColor = formData.get('color');
    const sanitizedMemberColor = memberColor.startsWith('#') ? memberColor.substring(1) : memberColor;
    const modifyColorResponse = await fetch(`${apiUrl}/members/${memberId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ color: sanitizedMemberColor }),
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
    }, 2000);
  } catch (error) {
    console.error(error);
  }
}