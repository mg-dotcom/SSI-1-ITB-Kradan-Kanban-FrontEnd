async function fetchAllTasks(url) {
  try {
    const data = await fetch(url);
    const res = await data.json();
    return res;
  } catch (error) {
    console.log(`error: ${error}`);
  }
}
async function fetchTaskDetails(url, id) {
  try {
    const data = await fetch(`${url}/${id}`);
    const res = await data.json();

    console.log(res);
    return res;
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

export { fetchAllTasks, fetchTaskDetails };
