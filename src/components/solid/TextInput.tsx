import { type JSX, splitProps, type Component } from "solid-js";

interface TextInputProps {
  name: string;
  type: "text" | "email" | "tel" | "password" | "url" | "date";
  label?: string;
  placeholder?: string;
  value: string | undefined;
  autocomplete?: string;
  error?: string | null | undefined;
  required?: boolean;
  pattern?: string;
  onChange?: JSX.EventHandler<HTMLInputElement, Event>;
  onBlur?: JSX.EventHandler<HTMLInputElement, Event>;
  onFocus?: JSX.EventHandler<HTMLInputElement, Event>;
  onInput?: JSX.EventHandler<HTMLInputElement, Event>;
}

export const TextInput: Component<TextInputProps> = (props) => {
  const [, inputProps] = splitProps(props, ["value", "label", "error"]);

  return (
    <div class="mb-6">
      {props.label && (
        <label
          for={props.name}
          class="block text-base font-medium text-gray-700 mb-1"
        >
          {props.label}
        </label>
      )}
      <input
        {...inputProps}
        id={props.name}
        name={props.name}
        value={props.value ?? ""}
        class={`mb-1 text-base py-3 px-4 block w-full border rounded shadow-md focus:ring-0 focus:outline-none ${
          props.error
            ? "border-rose-500"
            : "border-zinc-400 focus:border-zinc-800"
        }`}
        aria-invalid={!!props.error}
        aria-describedby={`${props.name}-error ${props.name}-description`}
        {...(props.pattern ? { pattern: props.pattern } : {})}
      />
      {props.error && (
        <span id={`${props.name}-error`} class="text-sm text-rose-500">
          {props.error}
        </span>
      )}
      <span id={`${props.name}-description`} class="sr-only">
        Please enter your {props.label?.toLowerCase()}.
      </span>
    </div>
  );
};
