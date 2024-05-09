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

export { fetchAllStatus };
