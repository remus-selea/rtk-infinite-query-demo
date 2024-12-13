import { Link, Route, Routes } from "react-router";
import "./App.css";
import About from "./features/About";
import Projects from "./features/projects/Projects";

function App() {
  return (
    <div className="App">
      <div style={{ display: "flex", gap: "16px", padding: "8px" }}>
        <Link to="/">Posts</Link>

        {/* <Link to="/pokemon">Pokemon</Link> */}
        {/* <Link to="/">Pokemon Infinite Query</Link> */}
        {/* <Link to="/pokemons">Pokemons</Link> */}
      </div>

      <Routes>
        <Route index element={<Projects />} />
        <Route path="/about" element={<About />} />
        {/* <Route index element={<PokemonInfiniteList />} /> */}
        {/* <Route path="/pokemon" element={<PokemonDetails />} /> */}
        {/* <Route path="/pokemons" element={<Pokemons />} /> */}
      </Routes>
    </div>
  );
}

export default App;
