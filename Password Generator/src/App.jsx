import { useState, useCallback, useEffect, useRef } from "react";

function App() {
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [charAllowed, setCharAllowed] = useState(false);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);

  const passwordGenerator = useCallback(() => {
    let pass = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXZabcdefghijklmnopqrstuvwxz";

    if (numberAllowed) str += "123456789";
    if (charAllowed) str += "!@#$%^&*+-_`~";

    for (let i = 1; i <= length; i++) {
      let char = Math.floor(Math.random() * str.length + 1);
      pass += str.charAt(char);
    }

    setPassword(pass);
  }, [length, numberAllowed, charAllowed, setPassword]);

  // useRef hook
  const passwordRef = useRef(null);

  const copyPasswordToClipboard = useCallback(() => {
    if (passwordRef.current) {
      // Try new Clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard
          .writeText(password)
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          })
          .catch(() => {
            fallbackCopy();
          });
      } else {
        fallbackCopy();
      }
    }

    function fallbackCopy() {
      passwordRef.current.select();
      document.execCommand("copy");
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [password]);

  useEffect(() => {
    passwordGenerator();
  }, [passwordGenerator, length, numberAllowed, charAllowed]);

  return (
    <>
      <div className="h-screen w-full bg-gradient-to-br from-gray-900 to-black">
        <h1 className="font-pixelfont py-4 text-center text-6xl text-stone-200">
          Password Generator
        </h1>

        <div className="mt-4 flex flex-col items-center justify-center">
          <div className="flex w-full max-w-md">
            <input
              type="text"
              value={password}
              className="font-pixelfont flex-1 rounded-l-lg rounded-r-none bg-white/15 px-4 py-3 text-white placeholder-white/50 shadow-lg ring-1 ring-white/10 backdrop-blur-lg outline-none"
              placeholder="password"
              ref={passwordRef}
              readOnly
            />
            <button
              className="font-pixelfont rounded-l-none rounded-r-lg bg-gray-500 px-4 py-3 text-white transition-colors duration-300 ease-in-out hover:bg-gray-400/60"
              onClick={copyPasswordToClipboard}
            >
              Copy
            </button>
          </div>
        </div>

        <div className="flex flex-col items-center gap-2 py-5">
          <input
            type="range"
            min={8}
            max={20}
            value={length}
            onChange={(e) => setLength(e.target.value)}
            className="custom-slider w-64 cursor-pointer"
          />

          <label className="font-pixelfont text-lg text-white">
            Length: {length}
          </label>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center justify-center gap-7">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                defaultChecked={numberAllowed}
                id="numberInput"
                onChange={() => setNumberAllowed((prev) => !prev)}
                className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border-2 border-white/30 transition duration-200 ease-in checked:border-transparent checked:bg-teal-500"
              />
              <label
                htmlFor="numberInput"
                className="font-pixelfont font-medium text-white transition-colors duration-200 ease-in select-none peer-checked:text-teal-400"
              >
                Numbers
              </label>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                defaultChecked={charAllowed}
                id="charInput"
                onChange={() => setCharAllowed((prev) => !prev)}
                className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border-2 border-white/30 transition duration-200 ease-in checked:border-transparent checked:bg-teal-500"
              />
              <label
                htmlFor="charInput"
                className="font-pixelfont font-medium text-white transition-colors duration-200 ease-in select-none peer-checked:text-teal-400"
              >
                Characters
              </label>
            </div>
          </div>

          <p
            className={`font-pixelfont mt-2 text-green-400 transition-opacity duration-500 ${
              copied ? "opacity-100" : "opacity-0"
            }`}
          >
            Password copied!
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
