import { showAlert } from "./main.js";

export async function fetchSystem(apiUrl, systemRef, TOKEN) {
  try {
    const response = await fetch(`${apiUrl}/systems/${systemRef}`, {
      headers: {
        Authorization: TOKEN
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch system");
    }

    const system = await response.json();

    // console.log("Members:", members);
    // Generate and apply unique classes for each member
    // members.forEach((member) => {
    //   const className = `member-${member.id}`;
    //   member.class = className;
    // });
    return system;
  } catch (error) {
    console.error(error);
    return [];
  }
}