"use client";
import Link from 'next/link';
import styles from '../Styles/RecipeCard.module.css';

export default function RecipeCard({ recipe }) {
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <img 
          src={recipe.image || '/placeholder-food.jpg'} 
          alt={recipe.title}
          className={styles.image}
        />
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>{recipe.title}</h3>
        <span className={styles.calories}>
          {Math.round(recipe.calories)} calories
        </span>
        <Link href={`/recipe/${recipe.id}`} className={styles.viewButton}>
          View Recipe
        </Link>
      </div>
    </div>
  );
}