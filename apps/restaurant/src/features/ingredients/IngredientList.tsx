import { Ingredient } from "./Ingredient";
import styles from "./IngredientList.module.css";

export const IngredientList = () => {
  return (
    <div className={styles.container}>
      <Ingredient name="Carrot" />
      <Ingredient name="Cheese" />
      <Ingredient name="Sausage" />
    </div>
  );
};
