// utils/api.js
const APP_ID = process.env.NEXT_PUBLIC_EDAMAM_APP_ID;
const APP_KEY = process.env.NEXT_PUBLIC_EDAMAM_APP_KEY;
const BASE_URL = 'https://api.edamam.com/api/recipes/v2';

export async function searchRecipes(query, filters = {}) {
  const { vegetarian = false, vegan = false, glutenFree = false } = filters;
  
  let url = `${BASE_URL}?type=public&q=${encodeURIComponent(query)}&app_id=${APP_ID}&app_key=${APP_KEY}`;
  
  // Add dietary filters
  if (vegetarian) url += '&health=vegetarian';
  if (vegan) url += '&health=vegan';
  if (glutenFree) url += '&health=gluten-free';
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.hits?.map(hit => ({
      id: hit.recipe.uri.split('#')[1],
      title: hit.recipe.label,
      calories: hit.recipe.calories,
      image: hit.recipe.image,
      ingredients: hit.recipe.ingredientLines,
      url: hit.recipe.url
    })) || [];
  } catch (error) {
    console.error('Error fetching recipes:', error);
    return [];
  }
}