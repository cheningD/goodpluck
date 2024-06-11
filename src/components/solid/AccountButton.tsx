import { useStore } from "@nanostores/solid";
import { $isLoggedInStytch } from "src/lib/store";
import { Show, type Component } from "solid-js";
import user from "src/assets/img/user.svg";
import Spinner from "./Spinner";

const AccountButton: Component = () => {
  const isLoggedInStytch = useStore($isLoggedInStytch);
  return (
    <Show when={isLoggedInStytch() !== null} fallback={<Spinner />}>
      <Show
        when={!isLoggedInStytch()}
        fallback={
          <a
            style={{ "background-image": `url(${user.src})` }}
            class="hidden lg:flex w-7 h-7 shrink-0  bg-cover bg-no-repeat relative overflow-hidden"
            href="/account"
          />
        }
      >
        <a href="/login">Sign in</a>
        <a
          href="/join"
          class="px-4 py-1 bg-brand-yellow border-2 border-black text-center font-bold rounded shadow-md hover:bg-yellow-400 focus:shadow-md focus:top-[1px] focus:left-[1px] transition ease-in duration-50"
        >
          Join
        </a>
      </Show>
    </Show>
  );
};
export default AccountButton;
