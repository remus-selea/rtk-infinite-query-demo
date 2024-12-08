import { api } from "../../app/api";
import { useAppDispatch } from "../../app/hooks";

const testData = [
  {
    name: "zubat",
    url: "https://pokeapi.co/api/v2/pokemon/41/",
  },
];

function Pokemons() {
  const { data } = api.useGetPokemonsQuery();

  const dispatch = useAppDispatch();
  const handleTestClick = () => {
    dispatch(api.util.upsertQueryData("getPokemons", undefined, testData));
  };

  return (
    <>
      {data?.map((pokemonInfo, index) => {
        return (
          <div key={index} className="row">
            {pokemonInfo.name}
          </div>
        );
      })}
      <button onClick={handleTestClick}>Test upserQueryData</button>
    </>
  );
}

export default Pokemons;
