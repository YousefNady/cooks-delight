import api from "../components/Get-recipe";
export async function getRecipes() {
  try {
    const res = await api.get("/recipes");
    return res.data;
  } catch (error) {
    console.log(error);
  }
}