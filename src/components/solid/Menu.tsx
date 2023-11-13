import { Motion, Presence } from '@motionone/solid';

import { Show } from 'solid-js';
import { isMenuOpen } from '../../store.js';
import logo from '../../assets/logo.png';
import { useStore } from '@nanostores/solid';

export default function Menu() {
  const $isMenuOpen = useStore(isMenuOpen);
  return (
    <Presence exitBeforeEnter>
      <Show when={$isMenuOpen()}>
        <Motion.aside
          class='fixed top-20 bottom-0 left-0 bg-gray-100 w-4/5 overflow-y-auto'
          animate={{
            x: 0,
          }}
          initial={{
            x: -512,
          }}
          exit={{
            x: -512,
          }}
          transition={{
            duration: 0.5,
            easing: 'ease-in-out',
          }}
        >
          {/* Content of the sidebar */}
          <div class='p-4'>
            {/* Logo */}
            <a href='/'>
              <img src={logo.src} alt='Goodpluck' class='h-8 w-auto my-4' />
            </a>

            {/* Menu Items */}
            <div class='space-y-4'>
              <div>About</div>
              <div>Recipes</div>
              <div>Kitchen & Bar</div>
              <div>Buy a Gift Card</div>
            </div>

            <div class='space-y-12'>
              <div>Scrolling Test</div>
              <div>Scrolling Test</div>
              <div>Scrolling Test & Bar</div>
              <div>BScrolling TestCard</div>
              <div>Scrolling Test</div>
              <div>Scrolling Test</div>
              <div>Scrolling Test & Bar</div>
              <div>BScrolling TestCard</div>
            </div>

            {/* Social Links */}
            <div class='absolute bottom-0 left-4 flex space-x-4'>
              {/* ... social icons */}
            </div>
          </div>
        </Motion.aside>
      </Show>
    </Presence>
  );
}
