type Props = {
  selected: string;
  setSelected: (value: string) => void;
};

const types = ["All", "Breakfast", "Lunch", "Dinner", "Snack", "Dessert", "Side Dish"];

export default function FilterButtons({ selected, setSelected }: Props) {
  return (
    <div className="buttons-container">
      {types.map((type) => (
        <button
          key={type}
          className={selected === type ? "active" : ""}
          onClick={() => setSelected(type)}
        >
          {type}
        </button>
      ))}
    </div>
  );
}