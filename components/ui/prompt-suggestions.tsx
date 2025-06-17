interface PromptSuggestionsProps {
  label: string;
  append: (message: { role: "user"; content: string }) => void;
  suggestions: string[];
}

export function PromptSuggestions({
  label,
  append,
  suggestions,
}: PromptSuggestionsProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-center text-white text-xl font-bold bg-darkPurple rounded-lg py-4 border-white border-x-2 border-t-2 shadow-md shadow-black">
        {label}
      </h2>
      <div className="flex gap-6 text-base font-semibold">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => append({ role: "user", content: suggestion })}
            className="h-max flex-1 rounded-xl border bg-background p-4 hover:bg-darkPurple hover:text-white shadow-md shadow-black"
          >
            <p>{suggestion}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
