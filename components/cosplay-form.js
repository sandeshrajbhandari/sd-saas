import { useState } from "react";

const samplePrompts = [
  "a gentleman otter in a 19th century portrait",
  "bowl of ramen in the style of a comic book",
  "flower field drawn by Jean-Jacques Sempé",
  "illustration of a taxi cab in the style of r crumb",
  "multicolor hyperspace",
  "painting of fruit on a table in the style of Raimonds Staprans",
  "pencil sketch of robots playing poker",
  "photo of an astronaut riding a horse",
];

import sample from "lodash/sample";

export default function CosplayForm(props) {
  const [prompt] = useState(sample(samplePrompts));
  const [image, setImage] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState(null);
  const styles = [
    { id: 1, name: "Style 1", image: "style1.jpg" },
    { id: 2, name: "Style 2", image: "style2.jpg" },
    { id: 3, name: "Style 3", image: "style3.jpg" },
    { id: 4, name: "Custom Style", image: null },
  ];
  const handleStyleSelect = (style) => {
    setSelectedStyle(style);
  };

  return (
    <form
      onSubmit={props.onSubmit}
      className="py-5 animate-in fade-in duration-700"
    >
      <div className="flex flex-col max-w-[512px]">
        <input
          type="text"
          defaultValue={prompt}
          name="prompt"
          placeholder="Enter a prompt..."
          className="block w-full flex-grow rounded-l-md"
        />

        <div className="grid grid-cols-2 gap-4 mt-4">
          {styles.map((style) => (
            <div
              key={style.id}
              className="cursor-pointer border border-gray-200 rounded-md p-2 flex flex-col items-center justify-center"
              onClick={() => handleStyleSelect(style)}
            >
              <img
                src={style.image || ""}
                alt={style.name}
                className="rounded"
              />
              <p className="text-center mt-2">{style.name}</p>
            </div>
          ))}
        </div>

        <button
          className="bg-black text-white rounded-r-md text-small inline-block px-3 flex-none"
          type="submit"
        >
          Generate
        </button>
      </div>
    </form>
  );
}
