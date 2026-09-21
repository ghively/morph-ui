import { SearchMorphInput } from "./SearchMorphInput";

export const Default = () => (
  <div style={{ padding: "3rem", display: "flex", justifyContent: "center" }}>
    <SearchMorphInput
      prompts={[
        "Search components…",
        "Try “heatmap”",
        "Try “composer”",
        "Try “orbital carousel”",
      ]}
      onSearch={() => {}}
    />
  </div>
);

export const SinglePrompt = () => (
  <div style={{ padding: "3rem", display: "flex", justifyContent: "center" }}>
    <SearchMorphInput prompts={["Find an agent by name"]} onSearch={() => {}} />
  </div>
);
