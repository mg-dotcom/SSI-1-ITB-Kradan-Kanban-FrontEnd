import { handleResponseStatus } from "./libsUtil.js";


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
  if ([401].includes(res.status)) {
    throw new Error("Username or Password is incorrect.");
  }
 handleResponseStatus(res)
  const data = await res.json();  
  return data;
};

export { fetchUser };
