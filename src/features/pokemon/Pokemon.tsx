import { api, useGetPokemonByNameQuery } from "../../app/api";

type Props = {
  name: string;
};

export default ({ name }: Props) => {
  const { data, isLoading, isError } = useGetPokemonByNameQuery(name);

  const [trigger, result] = api.useEvolvePokemonMutation();
  const handleEvolveClick = () => {
    trigger({ prevName: "pichu", newName: "pikachu" });
  };

  if (isLoading) {
    return <div>Loading</div>;
  }

  if (isError) {
    return <div>Error</div>;
  }

  return (
    <div>
      <img src={data.sprites.front_default} alt={data.name} />
      <div>
        <strong>Name:</strong> {data.name.toUpperCase()} (# {data.id})
      </div>
      <div>
        <strong>Height:</strong> {data.height / 10} meters
      </div>
      <div>
        <strong>Weight:</strong> {data.weight / 10} kg
      </div>
      <div>
        <strong>Types:</strong>
        {data.types.map(
          (typeDetails: { slot: number; type: { name: string } }) => (
            <div key={typeDetails.slot}>{typeDetails.type.name}</div>
          )
        )}
      </div>

      {name === "pichu" && <button onClick={handleEvolveClick}>Evolve</button>}
    </div>
  );
};
