document.querySelector("#msg").innerHTML = "Made with <3 by <u>f1shy-dev</u>";
const loader = `<svg class="animate-spin h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>`;
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

const ck = async (emoji, text, msg = null) => {
  const item = document.createElement("div");
  item.className =
    "transform transition-all ease-in duration-200 space-x-4 opacity-0 translate-y-2 items-center";
  item.innerHTML = `<span>${
    emoji == "load" ? loader : emoji
  }</span><span class="${msg != null ? "flex flex-col" : ""}">${
    msg == null
      ? text
      : ` <span>${text}</span><span class="text-gray-600 text-xs font-mono">${msg}</span>`
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

const updateCk = async (item, emoji, text) => {
  item.innerHTML = `<span>${
    emoji == "load" ? loader : emoji
  }</span><span>${text}</span>`;
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
    updateCk(loader, "load", "Please allow pop-ups to continue...");
    while (!hasOpened) {
      await sleep(5000);
      check = await openWindow("check.html", "_blank");
      if (check.innerHeight) {
        hasOpened = true;
        check.close();
        await updateCk(loader, "✅", "Pop-ups allowed!");
      }
    }
    check.close();
  }
  check.close();
  await updateCk(loader, "✅", "Pop-ups allowed!");

  if (navigator.userAgent.indexOf("Edg/") == -1) {
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
    );

  if (mobile) await ck("📱", "Mobile device detcted!");
  else await ck("🖥", "Desktop device detected!");

  let loading_words = await ck("load", "Downloading list of words...");
  let words = await fetch(
    "https://raw.githubusercontent.com/david47k/top-english-wordlists/master/top_english_nums_lower_500.txt"
  );

  if (!words.ok) {
    await updateCk(loading_words, "❌", "Failed to download words!");
    throw new Error("Failed to download words!");
  }

  words = await words.text();
  words = words.split("\n");
  words = words.map((w) => w.trim());
  words = words.filter((w) => w.length > 2);
  shuffle(words);
  await updateCk(loading_words, "📄", "Downloaded list of words!");
  const count = mobile ? 24 : 34;
  let done = 0;
  let tabs = await ck("3️⃣", `Starting ${count} searches...`);
  //   count down 3 seconds with emoji
  await sleep(1000);
  await updateCk(tabs, "2️⃣", `Starting ${count} searches...`);
  await sleep(1000);
  await updateCk(tabs, "1️⃣", `Starting ${count} searches...`);
  await sleep(1000);
  await updateCk(tabs, "🚦", `Starting ${count} searches...`);
  await sleep(250);
  await updateCk(tabs, "load", `Running searches (${done}/${count})...`);
  await sleep(250);
  while (done < count) {
    const tab = window.open("https://bing.com/search?q=" + words[done]);
    await sleep(1200);
    tab.close();
    done++;
    await updateCk(tabs, "load", `Running searches (${done}/${count})...`);
    await sleep(700);
  }

  await updateCk(tabs, "🎊", `Ran ${count} searches successfully!`);
})();
