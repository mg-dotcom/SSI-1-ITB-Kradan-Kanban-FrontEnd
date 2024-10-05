
import { handleResponseStatus } from "./libsUtil.js";
import { useUserStore } from "@/stores/UserStore";
import { useToast } from "primevue/usetoast";


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

const fetchToken=async (url)=>{

  const res=await fetch(`${url}`,{
    method:"POST",
    headers:{
      "Content-Type":"application/json",
      Authorization: `Bearer ${useUserStore().refreshToken}`,
    },
  });
  

  if(res.status===401){
  }else if(res.status===200){
    const data = await res.json();
    return data;
  }else{
    useToast().add({
      severity: "error",
      summary: "Error",
      detail: `show message "There is a problem. Please try again later.`,
      life: 3000,
    });
  }

}

export { fetchUser,fetchToken };
