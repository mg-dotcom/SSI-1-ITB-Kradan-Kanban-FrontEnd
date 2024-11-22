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
  console.log(accessTokenMicrosoft);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessTokenMicrosoft}`,
    },
  });

  return res;
};

export { fetchUser, fetchToken, fetchLoginWithMicrosoft };
