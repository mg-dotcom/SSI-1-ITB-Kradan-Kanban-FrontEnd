import { useRouter } from "vue-router";

const fetchUser = async (url, userLogin) => {
  const router = useRouter();
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
  if (res.status === 401) {
    router.push("/login");
  }
  const data = await res.json();

  return data;
};

export { fetchUser };
