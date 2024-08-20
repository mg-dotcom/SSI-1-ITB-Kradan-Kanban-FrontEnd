const fetchUser = async (url, userLogin) => {
    const res = await fetch(`${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: userLogin.username,
        password: userLogin.password,
      }),
    });
  
    if (!res.ok || res.status === 401) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }
  
    const data = await res.json();
    return data;
  };
  
  export { fetchUser };
  