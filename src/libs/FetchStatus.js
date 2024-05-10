async function fetchAllStatus(url) {
  try {
    const data = await fetch(`${url}`)
    const res = await data.json()
    return res
  } catch (error) {
    console.log(`error: ${error}`)
  }
}


const deleteStatus = async (url) => {
  try {
    const res = await fetch(`${url}`,{
      method: "DELETE",
    })
    return res.status
  } catch (error) {
    console.log(`error: ${error}`)
  }
}

async function addStatus(url, newStatus) {
  try {
    const res = await fetch(`${url}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        name: newStatus.name,
        description: newStatus.description,
        statusColor: newStatus.color,
      }),
    });
    return res;
  } catch (error) {
    console.log(`error: ${error}`);
  }
}
export { fetchAllStatus, addStatus,deleteStatus };
