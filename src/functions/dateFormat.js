const today = new Date();

// Get day, month, and year
const day = today.getDate().toString().padStart(2, "0");
const month = (today.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
const year = today.getFullYear().toString().substring(2); // Get the last two digits of the year

// Format the date
export const formattedDate = `today ${day}/${month}/${year}`;
