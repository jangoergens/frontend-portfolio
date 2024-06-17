export interface IngredientProps {
  name: string;
}

export const Ingredient = ({ name }: IngredientProps) => {
  return <span>{name}</span>;
};
