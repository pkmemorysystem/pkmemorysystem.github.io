import { updateNoPronounPlaceholder } from './settings.js';

export async function fetchMembers(apiUrl, systemRef, TOKEN) {
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

export async function highlightMentions() {
  try {
    const members = await fetchMembers(window.apiUrl, window.systemRef, window.TOKEN);

    if (!members || members.length === 0) {
      console.log("No members available.");
      return;
    }

    const memberNameRegex = new RegExp(members.map(member => `@${member.name}`).join('|'), 'gi');

    const txtboxTypes = document.querySelectorAll('.txtboxType');

    txtboxTypes.forEach(txtboxType => {
      const content = txtboxType.textContent;
      const newContent = content.replace(memberNameRegex, matchedName => {
        const member = members.find(member => `@${member.name}` === matchedName);
        if (member) {
          return `<span class="outlined" style="background-color: #${member.color}6b;">${matchedName}</span>`;
        }
        return matchedName; // Return the original name if no member is found
      });
      txtboxType.innerHTML = newContent;
    });

  } catch (error) {
    console.error("Error:", error);
  }
}


export async function fetchFronters() {
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

async function populateFrontersList() {
  try {
    const fronters = await fetchFronters(window.apiUrl, window.systemRef, window.TOKEN);

    if (!fronters || !Array.isArray(fronters.members) || fronters.members.length === 0) {
      showAlert("No fronters available.");
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

export function displayMembers(members) {
  // sort members array alphabetically by name
  members.sort((a, b) => a.name.localeCompare(b.name));

  const memberList = document.getElementById("memberContainer");
  const frontMemberList = document.getElementById("frontMemberList");

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
  });
}

function createMemberDiv(member) {
  // Create member div element
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
   xPath.style.opacity = "1";

   const memberName = document.createElement("h3");
   memberName.textContent = member.name;

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
  nameHeading.textContent = member.name;

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

  // Attach event listener to the checkbox
  checkbox.addEventListener('change', function() {
    // Check if checkbox is checked
    if (this.checked) {
      // Add member ID to an array when checkbox is checked
      checkedMembers.push(member.id);
      console.log('Member added to switch list:', member.id);
    } else {
      // Remove member ID from the array when checkbox is unchecked
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

document.addEventListener('DOMContentLoaded', populateFrontersList);

document.getElementById("checkFronters");
//   // sort members array alphabetically by name
//   members.sort((a, b) => a.name.localeCompare(b.name));
  
//   const memberList = document.getElementById("memberContainer");
//   const frontMemberList = document.getElementById("frontMemberList");
  
//   members.forEach((member) => {
//     // Add To Front
//     const memberTab = document.createElement("div");
//     memberTab.classList.add("memberTab");
//     memberTab.style.height = "100px";
//     memberTab.style.padding = "0.5em";
//     memberTab.style.background = "rgba(24, 24, 24, 0.301)";
//     memberTab.style.display = "grid";
//     memberTab.style.gridTemplateColumns = "100px 1fr auto";
    
//     const imageContainer = document.createElement("div");
//     imageContainer.style.width = "100px";
//     imageContainer.style.overflow = "hidden";

//     const img = document.createElement("img");
//     img.style.width = "100%";
//     img.src = member.avatar_url || "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";
//     img.style.overflow = "hidden";
    
//     const infoContainer = document.createElement("div");
//     infoContainer.style.margin = "0 auto";
//     infoContainer.style.display = "flex";
//     infoContainer.style.flexDirection = "column";
//     infoContainer.style.justifyContent = "center";
    
//     const nameHeading = document.createElement("h3");
//     nameHeading.style.margin = "0";
//     nameHeading.textContent = member.name;
    
//     const pronounsHeading = document.createElement("h4");
//     pronounsHeading.style.margin = "0";
//     pronounsHeading.textContent = member.pronouns || "No Pronouns";
    
//     const checkbox = document.createElement("input");
//     checkbox.style.margin = "1em";
//     checkbox.type = "checkbox";
//     checkbox.id = `frontingBool-${member.id}`;
//     checkbox.name = "areTheyFronting";
    
//     imageContainer.appendChild(img);
//     memberTab.appendChild(imageContainer);
//     infoContainer.appendChild(nameHeading);
//     infoContainer.appendChild(pronounsHeading);
//     memberTab.appendChild(infoContainer);
//     memberTab.appendChild(checkbox);
    
//     frontMemberList.appendChild(memberTab);

//     // x.addEventListener("mouseover", () => {
//     //   xPath.style.opacity = "1";
//     // });
    
//     // x.addEventListener("mouseout", () => {
//     //   xPath.style.opacity = "0.25";
//     // });

//     // const memberId = member.id;

//     // x.addEventListener("dblclick", async () => {
//     //   try {
//     //     const response = await fetch(`https://api.pluralkit.me/v2/members/${memberId}`, {
//     //       method: "DELETE",
//     //       headers: {
//     //         "Authorization": TOKEN
//     //       }
//     //     });
      
//     //     if (!response.ok) {
//     //       showAlert("Something went wrong, Member not deleted");
//     //       throw new Error("Failed to delete member");
//     //     }
            
//     //     showAlert("Member deleted successfully");
//     //     x.parentElement.remove();
//     //   } catch (error) {
//     //     console.error("Error deleting member:", error);
//     //   }
//     // });


//   });
// }
// window.displayMembers = displayMembers;

// switching in order - or at least trying
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
      showAlert("Error " +  response.status + ". Failed to record switch")
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

document.getElementById("memberContainer").addEventListener("contextmenu", function(event) {
  event.preventDefault();

  if (event.target.tagName === "IMG") {
    // get the memberId from the dataset
    const memberId = event.target.dataset.memberId;
    // find corresponding member element
    const memberElement = document.querySelector(`.member[data-member-id="${memberId}"]`);
    // get the member's name from the member element
    const memberName = memberElement.querySelector("h3").textContent;
    // print the member's name
    console.log("Slayer clicked:", memberName);
  }
});
// Gonna use this later for a memebr card or something

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
            // If pronouns are empty, remove the pronouns attribute
            await updateAttribute(memberId, 'pronouns', '');
          }
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
      body: JSON.stringify({ avatar_url: imageUrl })
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
  const memberForm = document.getElementById('memberForm');
  const createMemberForm = document.getElementById('createMemberForm');

  createMemberForm.addEventListener('click', async (e) => {
    e.preventDefault();

    const formData = new FormData(memberForm);

    const memberName = formData.get('name');
    const memberColor = formData.get('color');
    const memberPronouns = formData.get('pronouns');
    const memberAvatar = formData.get('avatar');

    // Step 1: create the member with just the name
    try {
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
      showAlert('New member created :: ' + newMember.name);
      console.log('New member created :: ', newMember);

      await modifyMember(newMember.id, { color: memberColor, pronouns: memberPronouns, avatar: memberAvatar });
    } catch (error) {
      console.error(error);
    }
  });
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

