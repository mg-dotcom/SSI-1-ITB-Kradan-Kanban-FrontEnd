import { useRouter } from "vue-router";

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
    const router = useRouter();
    const data = await fetch(`${url}/${id}`);
    if (!data.ok) {
      alert("The requested task does not exist");
      router.push("/");
      return;
    }
    const res = await data.json();
    return res;
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

export { fetchAllTasks, fetchTaskDetails };
