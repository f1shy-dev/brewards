document.querySelector("#msg").innerHTML = "Made with <3 by <u>f1shy-dev</u>";
const loader = `<svg class="animate-spin h-5 w-5 text-gray-800 dark:text-zinc-100" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.text-zinc-200 7.text-zinc-200 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

const checklist = document.querySelector("#checklist");
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const openWindow = (...args) =>
  new Promise((s) => {
    const win = window.open(...args);
    if (!win || win.closed) return s();
    setTimeout(() => (win.innerHeight > 0 && !win.closed ? s(win) : s()), 200);
  });
import { words } from "./words";
const ck = async (emoji, text, msg = null) => {
  const item = document.createElement("div");
  item.className =
    "transform transition-all ease-in duration-200 space-x-4 opacity-0 translate-y-2 items-center";
  item.innerHTML = `<span>${
    emoji == "load" ? loader : emoji
  }</span><span class="${msg != null ? "flex flex-col" : ""}">${
    msg == null
      ? text
      : ` <span>${text}</span><span class="text-zinc-600 dark:text-zinc-400 text-xs font-mono">${msg}</span>`
  }</span>`;

  checklist.appendChild(item);
  // newItem.classList.add("opacity-0");
  // newItem.classList.add("translate-y-6");
  // newItem.classList.add("hidden");
  console.log("waiting");
  await new Promise((r) => setTimeout(r, 100));
  console.log("done");
  item.classList.remove("opacity-0");
  item.classList.remove("translate-y-2");
  item.classList.add("opacity-100");
  item.classList.add("translate-y-0");

  // item.classList.remove("hidden");
  item.classList.add("flex");
  //   await new Promise((r) => setTimeout(r, 150));
  return item;
};

const updateCk = async (item, emoji, text, msg = null) => {
  item.innerHTML = `<span>${
    emoji == "load" ? loader : emoji
  }</span><span class="${msg != null ? "flex flex-col" : ""}">${
    msg == null
      ? text
      : ` <span>${text}</span><span class="text-zinc-600 dark:text-zinc-400 text-xs font-mono">${msg}</span>`
  }</span>`;
};

(async () => {
  // check for ms edge

  let hasOpened = false;
  let loader = await ck("load", "Checking for pop-ups...");
  let check = await openWindow("check.html", "_blank");
  if (check) {
    hasOpened = true;
    check.blur();
    check.close();
  }
  if (!hasOpened) {
    updateCk(
      loader,
      "load",
      "Please allow pop-ups to continue...",
      "😦 They're required to open Bing..."
    );
    while (!hasOpened) {
      await sleep(2000);
      check = await openWindow("check.html", "_blank");
      if (check && check.innerHeight) {
        hasOpened = true;
        check.close();
        await updateCk(loader, "✅", "Pop-ups allowed!");
      }
    }
    check.close();
  }
  check.close();
  await updateCk(loader, "✅", "Pop-ups allowed!");

  const edge = navigator.userAgent.indexOf("Edg/") != -1;
  if (!edge) {
    await ck(
      "😬",
      "Edge browser not detected...",
      "You won't get the 12 Edge bonus points!"
    );
  } else {
    await ck("👍", "Edge browser detected!");
  }

  const mobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) && window.innerWidth < 768;

  const searches = (mobile ? 20 : 30) + (edge ? 4 : 0);
  const skS = `Will do ${searches} searches for ${mobile ? 60 : 90}${
    edge ? "+12" : ""
  } points...`;
  if (mobile) await ck("📱", "Mobile device detcted!", skS);
  else await ck("🖥", "Desktop device detected!", skS);

  shuffle(words);
  await ck("📄", `Loaded list of english words...`);

  let done = 0;
  let tabs = await ck("3️⃣", `Starting ${searches} searches...`);
  //   count down 3 seconds with emoji
  await sleep(1000);
  await updateCk(tabs, "2️⃣", `Starting ${searches} searches...`);
  await sleep(1000);
  await updateCk(tabs, "1️⃣", `Starting ${searches} searches...`);
  await sleep(1000);
  await updateCk(tabs, "🚦", `Starting ${searches} searches...`);
  await sleep(250);
  const pageTitle = document.querySelector("title");
  const updateTitle = (msg = null) => {
    pageTitle.innerHTML =
      msg != null ? msg : `(${done}/${searches}) - Bing Rewards Auto-Search`;
  };
  await updateCk(tabs, "load", `Running searches (${done}/${searches})...`);
  updateTitle();
  await sleep(250);
  while (done < searches) {
    done++;
    await updateCk(tabs, "load", `Running searches (${done}/${searches})...`);
    updateTitle();

    const tab = window.open(
      "https://bing.com/search?q=" + words[done],
      "_blank"
    );
    await sleep(1200);
    if (!tab) {
      await updateCk(
        tabs,
        "❌",
        `Failed to open tab!`,
        "Please allow pop-ups and try again, and if it persists, please report an issue on GitHub."
      );
      await sleep(5000);
      window.location.reload();
    }
    tab.close();
    await sleep(700);
  }
  updateTitle("Bing Rewards Auto-Search");
  await updateCk(tabs, "🎊", `Ran ${searches} searches successfully!`);
})();
