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
  if ([401].includes(res.status)) {
    throw new Error("Username or Password is incorrect.");
  }
  if (res.status === 401 || res.status === 404) {
    handleAuthenticationClearAndRedirect();
  }
  const data = await res.json();

  return data;
};

const fetchToken=async (url)=>{
  console.log('fetchhhhhhhhhhhhhh');
  console.log(useUserStore().refreshToken);
  
  
  const res=await fetch(`${url}`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      Authorization: `Bearer ${useUserStore().refreshToken}`,
    },
  });
  console.log('res',res);
  

  if(res.status===401){
    console.log('401');
    console.log('reset authentication state and redirect to login page');
  }else if(res.status===200){
    console.log('200');
    const data = await res.json();
    return data;
  }else{
    console.log('show message "There is a problem. Please try again later."');
    
  }

}

export { fetchUser,fetchToken };
