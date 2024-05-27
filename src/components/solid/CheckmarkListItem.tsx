import type { Component } from "solid-js";
import checkmark from "src/assets/img/checkmark.svg";

const CheckmarkListItem: Component<{ text: string }> = (props) => {
  return (
    <li class="flex items-center">
      <img src={checkmark.src} width="16px" class="ml-4" alt="Checkmark" />
      <span class="ml-2">{props.text}</span>
    </li>
  );
};

export default CheckmarkListItem;
