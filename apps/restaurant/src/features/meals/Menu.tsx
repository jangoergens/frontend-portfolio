import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import styles from "./Menu.module.css";
import { nanoid } from "@reduxjs/toolkit";
import { addMeal, removeMeal, selectMeals } from "./mealSlice";
import { Meal } from "./Meal";
import { selectIngredients } from "../ingredients/ingredientsSlice";

export const Menu = () => {
  const dispatch = useAppDispatch();
  const meals = useAppSelector(selectMeals);
  const ingredients = useAppSelector(selectIngredients);
  const [newMealName, setNewMealName] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  const handleAddMeal = () => {
    if (newMealName.trim() !== "") {
      dispatch(
        addMeal({ name: newMealName.trim(), id: nanoid(), ingredients: selectedIngredients }),
      );
      setNewMealName("");
      setSelectedIngredients([]);
    }
  };

  return (
    <div className={styles.container}>
      {meals.map((meal) => (
        <div className={styles.ingredient}>
          <Meal key={meal.id} name={meal.name} ingredients={meal.ingredients} />
          <button onClick={() => dispatch(removeMeal(meal.id))}>Remove</button>
        </div>
      ))}
      <div className={styles.form}>
        <input type="text" value={newMealName} onChange={(e) => setNewMealName(e.target.value)} />
        {ingredients.map((ingredient) => (
          <div key={ingredient.id}>
            <input
              type="checkbox"
              id={ingredient.id}
              checked={selectedIngredients.includes(ingredient.name)}
              onChange={(e) => {
                if (e.target.checked) {
                  setSelectedIngredients([...selectedIngredients, ingredient.name]);
                } else {
                  setSelectedIngredients(
                    selectedIngredients.filter((name) => name !== ingredient.name),
                  );
                }
              }}
            />
            <label htmlFor={ingredient.id}>{ingredient.name}</label>
          </div>
        ))}
        <button onClick={handleAddMeal}>Add</button>
      </div>
    </div>
  );
};
