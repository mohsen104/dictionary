import Lottie from "lottie-react";
import React, { useEffect, useRef, useState } from "react";
import loadingAnimation from "../public/loadingAnimation.json";

export default function App() {
  const audioRef = useRef();
  const [search, setSearch] = useState("");
  const [dictionary, setDictionary] = useState({
    loading: false,
    error: "",
    word: "",
    phonetic: "",
    audio: "",
    partOfSpeech: "",
    definition: "",
    example: "",
    synonyms: [],
    antonyms: [],
  });
  const [history, setHistory] = useState({
    value: localStorage.getItem("history"),
    show: localStorage.getItem("history") ? true : false,
  });

  const fetchHandler = async () => {
    localStorage.setItem("history", search.trim());
    setHistory(() => ({
      value: search.trim(),
      show: false,
    }));
    setDictionary(() => ({
      loading: true,
    }));
    if (!search.trim()) {
      setDictionary(() => ({
        loading: false,
        error: "Your input is empty .",
      }));
      return false;
    }
    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${search.trim()}`
      );
      const data = await res.json();
      const { word, phonetics, meanings } = data[0];
      setDictionary(() => ({
        loading: false,
        error: "",
        word,
        phonetic: phonetics[1]?.text ? phonetics[1].text : phonetics[0].text,
        audio: phonetics[1]?.audio ? phonetics[1].audio : phonetics[0].audio,
        partOfSpeech: meanings[0]?.partOfSpeech,
        definition: meanings[0]?.definitions[0]?.definition,
        example: meanings[0]?.definitions[0]?.example,
        synonyms: meanings[0]?.synonyms,
        antonyms: meanings[0]?.antonyms,
      }));
      console.log();
    } catch (error) {
      setDictionary(() => ({
        loading: false,
        error: "This word is not available .",
      }));
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-gradient-to-r from-violet-500 to-fuchsia-500">
      <section className="bg-white shadow-md px-4 py-5 w-96 rounded-md">
        <div className="flex items-center justify-center pb-5 space-x-1 text-slate-700 text-2xl">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418"
            />
          </svg>
          <h1 className="font-bold">Dictionary</h1>
        </div>

        <div className="space-x-6 flex items-center justify-between">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            id="input"
            type="text"
            placeholder="Enter your word ..."
            className="w-full bg-[#ffffffef] border-b-2 border-b-blue-600 focus:outline-none px-2 py-1 text-lg"
          />
          <button
            onClick={fetchHandler}
            id="btn"
            className="bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition-all"
          >
            Search
          </button>
        </div>

        {history.show && (
          <div className="px-1 py-3 text-md">
            <span className="text-sky-800 font-semibold">
              last word search :
            </span>
            <span
              onClick={() => setSearch(() => history.value.trim())}
              className="border-b-2 border-b-blue-600 mx-2 text-blue-600 cursor-pointer"
            >
              {history.value.trim()}
            </span>
          </div>
        )}

        {dictionary.loading && (
          <Lottie animationData={loadingAnimation} loop={true} />
        )}

        {!!dictionary.error && (
          <p className="text-center font-semibold text-rose-400 pt-4">
            {dictionary.error}
          </p>
        )}

        {dictionary.word && (
          <section id="modal" className="">
            <div className="flex items-center justify-between px-1 pt-8">
              <div className="flex space-x-2 items-center">
                <p id="word" className="font-bold text-3xl text-emerald-600">
                  {dictionary.word}
                </p>
                <p id="partOfSpeech" className="text-2xl text-slate-500">
                  {dictionary.partOfSpeech}
                </p>
              </div>
              <audio src={dictionary.audio} ref={audioRef}></audio>
              <button
                id="btnPlay"
                onClick={() => audioRef.current.play()}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-6 h-6 stroke-amber-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
                  />
                </svg>
              </button>
            </div>

            <div className="px-1">
              <p id="phonetics" className="text-md text-gray-400">
                {dictionary.phonetic}
              </p>
            </div>

            {dictionary.definition && (
              <div className="px-1 py-3 text-md">
                <p className="text-pink-600 font-bold">Definition : </p>
                <p id="definition">{dictionary.definition}</p>
              </div>
            )}

            {dictionary.example && (
              <div className="px-1 py-3 text-md">
                <p className="text-purple-600 font-bold">Example : </p>
                <p id="example">{dictionary.example}</p>
              </div>
            )}

            {!!dictionary.synonyms.length && (
              <div className="px-1 py-3 text-md">
                <p className="text-blue-600 font-bold">synonyms : </p>
                {dictionary.synonyms.map((i, index) => (
                  <span key={index} id="synonyms" className="pr-2">
                    [{i}]
                  </span>
                ))}
              </div>
            )}

            {!!dictionary.antonyms.length && (
              <div className="px-1 py-3 text-md">
                <p className="text-orange-600 font-bold">antonyms : </p>
                {dictionary.antonyms.map((i, index) => (
                  <span key={index} id="antonyms" className="pr-2">
                    [{i}]
                  </span>
                ))}
              </div>
            )}
          </section>
        )}
      </section>
    </div>
  );
}
