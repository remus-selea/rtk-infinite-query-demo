import { useState } from "react";
import Pokemon from "./Pokemon";

const names = ["pichu", "bulbasaur", "zubat"];

function PokemonDetails() {
  const [name, setName] = useState("pichu");

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const name = event.target.value;
    setName(name);
  };

  return (
    <section>
      <header>
        <h2>Pokémon Details</h2>

        <select id="name-selector" value={name} onChange={handleChange}>
          <option value="" disabled>
            Choose a Pokémon...
          </option>
          {names.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
      </header>
      <Pokemon name={name} />
    </section>
  );
}

export default PokemonDetails;
