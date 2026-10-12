// Sends the message written on the torn ticket stub to your inbox through Web3Forms
// (a free form-to-email service, no server needed). The access key is not a secret.
const ENDPOINT = "https://api.web3forms.com/submit";

export async function sendMessage({ email, message, rating }) {
  const accessKey = import.meta.env.VITE_WEB3FORMS_KEY;

  if (!accessKey) {
    // While developing without a key, pretend it worked so you can test the animation.
    if (import.meta.env.DEV) {
      await new Promise((resolve) => setTimeout(resolve, 700));
      return { demo: true };
    }
    throw new Error("The message form is not configured yet.");
  }

  const response = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      subject: "New message from your portfolio ticket",
      from_name: "Portfolio visitor",
      email,
      message,
      rating: rating > 0 ? `${rating} / 5` : "not rated"
    })
  });

  let data = {};
  try {
    data = await response.json();
  } catch (error) {
    data = {};
  }
  if (!response.ok || !data.success) {
    throw new Error(data.message || "The message could not be sent.");
  }
  return { demo: false };
}
