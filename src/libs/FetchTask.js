// import { useRoute } from "vue-router";
// import { useRouter } from "vue-router";

// const router = useRoute();
async function fetchAllTasks(url) {
  try {
    const data = await fetch(url);
    const res = await data.json();
    return res;
  } catch (error) {
    console.log(`error: ${error}`);
  }
}
const router = useRouter();


async function fetchTaskDetails(url, id) {
  try {
    const data = await fetch(`${url}/${id}`);
    if (data.status === 404) {
      router.push({ name: "task" });
      throw new Error('Failed to fetch task details');
    }
    const res = await data.json();
    return res;
  } catch (error) {
    console.log(`error: ${error}`);
  }
}

export { fetchAllTasks, fetchTaskDetails };
