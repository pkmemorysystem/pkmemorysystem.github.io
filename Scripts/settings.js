async function fetchSettings() {
  try {
    const response = await fetch(`${apiUrl}/systems/${systemRef}/settings`, {
      headers: {
        Authorization: TOKEN
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch settings");
    }

    const settings = await response.json();
    // console.log("Settings:", settings);

  } catch (error) {
    console.error(error);
  }
}

async function fetchSystem() {
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
    // console.log("System:", system);

  } catch (error) {
    console.error(error);
  }
}