import "./styles/global.css";
import { useState } from "react";
import { colors } from "./assets/colors";
import { Footer } from "./components/Footer";
import { Spinner } from "./components/Spinner";
import { InputComponent } from "./components/InputComponent";
import { SearchButton } from "./components/SearchButton";
import axios from "axios";
import custom from "./data/customLyrics.json";

export default function App() {
  const [artist, setArtist] = useState("");
  const [song, setSong] = useState("");
  const [lyrics, setLyrics] = useState("");
  const [loading, setLoading] = useState(false);

  const changeBGColor = () => {
    let index = Math.floor(Math.random() * 10);
    document.body.style.backgroundImage = colors[index];
  };

  const searchLyrics = (artist, song) => {
    if (
      (artist === "thay" && song === "") ||
      (artist === "Thay" && song === "")
    ) {
      setLyrics(custom.lyric);

    } else if (artist && song) {
      changeBGColor();
      setLoading(true);

      axios
        .get(`https://api.lyrics.ovh/v1/${artist}/${song}`)
        .then((data) => {
          if (data.lyrics) {
            setLyrics(data.lyrics);
          } else {
            setLyrics("Letra não encontrada!");

            setTimeout(() => {
              setLyrics("");
            }, 3000);
          }

          setLoading(false);
        })
        .catch((err) => {
          console.log(err);

          if (err.message) {
            setLoading(false);
            setLyrics("Serviço indisponível!");
          }
        });
    } else {
      setLyrics("Digite nome do artista e música!");

      setTimeout(() => {
        setLyrics("");
      }, 3000);
    }
  };

  return (
    <div className="App">
      <h1>Letras de Músicas </h1>

      <div className="nav">
        <InputComponent
          placeholder="Artista"
          onChange={(e) => setArtist(e.target.value)}
        />

        <InputComponent
          placeholder="Música"
          onChange={(e) => setSong(e.target.value)}
        />

        <SearchButton
          text="Buscar"
          onClick={() => {
            searchLyrics(artist, song);
          }}
        />
      </div>

      <hr />
      <pre>{loading ? <Spinner /> : lyrics}</pre>

      <Footer position={lyrics.length} />
    </div>
  );
}
