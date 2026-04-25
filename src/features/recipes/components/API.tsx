import api from "./Get-recipe";
export async function getProducts() {
  try {
    const res = await api.get("/recipes");
    return res.data;
  } catch (error) {
    console.log(error);
  }
}