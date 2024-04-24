async function getTasks(url){
    try{
        const data=await fetch(url)
        const res=await data.json()
        return res
    }catch(error){
        console.log(`error: ${error}`);
    }
}

export {getTasks}