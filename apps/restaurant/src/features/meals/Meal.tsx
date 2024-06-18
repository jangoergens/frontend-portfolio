import { useAppSelector } from "../../app/hooks";
import { selectIngredientsByName } from "../ingredients/ingredientsSlice";

export interface MealProps {
  name: string;
  ingredients: string[];
}

export const Meal = ({ name, ingredients }: MealProps) => {
  return (
    <div>
      <h2>{name}</h2>
      <ul>
        {ingredients.map((ingredient) => {
          const selectedIngredient = useAppSelector(
            (state) => selectIngredientsByName(state, ingredient)[0],
          );
          if (selectedIngredient) {
            return <li key={selectedIngredient?.id}>{selectedIngredient?.name}</li>;
          }
        })}
      </ul>
    </div>
  );
};
