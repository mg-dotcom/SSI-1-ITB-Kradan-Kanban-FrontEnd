import { useUserStore } from "@/stores/UserStore";

const fetchUser = async (url, userLogin) => {
  const res = await fetch(`${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      userName: userLogin.username,
      password: userLogin.password,
    }),
  });

  const data = await res.json();

  return data;
};

const fetchToken = async (url) => {
  const res = await fetch(`${url}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${useUserStore().refreshToken}`,
    },
  });

  const data = await res.json();
  return data;
};

const fetchLoginWithMicrosoft = async (url, accessTokenMicrosoft) => {
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessTokenMicrosoft}`,
    },
  });

  return res;
};

const fetchMicrosoftGraphUser = async (userEmail) => {
  const graphUrl = `https://graph.microsoft.com/v1.0/users/${userEmail}`;

  const res = await fetch(graphUrl, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${userStore.microsoftAccessToken}`,
      'Content-Type': 'application/json',
    },
  });
  console.log(res);
  
  if (!res.ok) {
    throw new Error(`Failed to fetch user: ${res.statusText}`);
  }

  const data = await res.json();
  return data;
};


export { fetchUser, fetchToken, fetchLoginWithMicrosoft,fetchMicrosoftGraphUser };
