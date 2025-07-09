import "./app.css";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import { createResource, createSignal, Suspense } from "solid-js";
import { clientOnly } from "@solidjs/start";
import { MetaProvider, Title } from "@solidjs/meta";
import LocaleSelector from "./components/LocaleSelector";

const ThemeButton = clientOnly(() => import("./components/ThemeButton"));

export default function App() {
  return (
    <>
      <MetaProvider>
        <Title>目安箱</Title>
      </MetaProvider>
      <Router
        root={(props) => (
          <>
            <header class="navbar bg-black text-white text-xl flex items-center gap-2">
              <img
                class="h-8 border-r-white border-r"
                src="/JTEKT_negative.jpg"
                alt="JTEKT logo"
              />
              <span>目安箱</span>
              <div class="ml-auto">
                <LocaleSelector />

                {/*  <Show when={VITE_LOGIN_URL && authData.jwt}>
                <a href="/logout" class="btn btn-ghost btn-circle">
                  <IoLogOut size={24} />
                </a>
              </Show>*/}

                <ThemeButton />
              </div>
            </header>
            <main class="max-w-7xl mx-auto min-h-screen px-4">
              <Suspense>{props.children}</Suspense>
            </main>
            <footer class="footer footer-center p-2 bg-neutral text-neutral-content">
              目安箱 - Maxime MOREILLON - JTEKT Corporation
            </footer>
          </>
        )}
      >
        <FileRoutes />
      </Router>
    </>
  );
}
