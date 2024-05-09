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

export { fetchAllStatus, deleteStatus }
