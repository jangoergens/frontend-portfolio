export interface IngredientProps {
  name: string;
}

export const Ingredient = ({ name }: IngredientProps) => {
  return (
    <div>
      <h3>{name}</h3>
    </div>
  );
};
