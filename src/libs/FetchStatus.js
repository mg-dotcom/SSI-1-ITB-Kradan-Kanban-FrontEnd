import { useRouter } from "vue-router";

async function fetchAllStatus(url) {
  try {
    const data = await fetch(`${url}`);
    const res = await data.json();
    return res;
  } catch (error) {
    console.log(`error: ${error}`);
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

// if (!data.ok) {
//   alert("The requested task does not exist");
//   router.push("/");
//   return;
// }
export { fetchAllStatus, addStatus };
