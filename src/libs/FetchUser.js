const fetchUser = async (url, userLogin) => {
    const res = await fetch(`${url}/auth/login`, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify({
            username: userLogin.username,
            password: userLogin.password
        })
    })
    return res;
}

export{
    fetchUser
}
