# Contributing to grammY Tools

First of all, thanks for your interest in helping out!
We appreciate any kind of support, be it small bug fixes, large feature contributions, or even just if you drop us a message with some constructive criticism on how grammY tools can be improved for your use case.
The grammY ecosystem would not be possible without you.

We believe it is a strength of grammY to provide an integrated experience to its users.
If you have a good idea, don't hesitate to tell us in the group chat!

## What Can I Do?

In short: anything you find useful!

If you’re unsure whether your changes are welcome, open an issue on GitHub or preferably ask in the [Telegram chat](https://t.me/grammyjs).

In case you’d like to get some inspiration what we're working on, check out the [issues list](https://github.com/grammyjs/tools/issues).
They are labeled according to the type of issue, the tool they relate to, and how good of a first issue they are.

## A Few Words on Astro, Vue, React and Other Frameworks

**TL;DR** we use Astro because it supports multiple frameworks, and that makes it easier for anyone to contribute, since they can use whatever they're familiar with

grammY Tools started as a single React website, which featured the Filter Query Browser.
After a while, some people built up an interest to participate on its development, which led to a [discussion](https://t.me/grammyjs/118131) about how we should proceed with it, what frameworks we should use, and what was the future of the website.

After debating on different approaches and technologies, we decided it was best if we could use multiple UI frameworks, since that's what allow the biggest amount of people to contribute.

That's the main reason why we chose [Astro](https://astro.build/): for its out-of-the-box support for using multiple UI frameworks.
But also, it's fast, has the amazing concept of Isles, supports SSR by default and is, in general, a great tool.

## How to Contribute

- **Tools.**
  You can create new tools, or improve existing ones.
  All of them are located under `src/components/[framework]/[tool]`, so it's easy for you to find the ones which you're familiar with and start contributing right away.
- **Issues, bugs, and everything else.**
  We're happy to hear from you if you want to report a bug, request a feature, or contribute anything else—also if it is not code.
  There are no technical steps to this.

### Coding

If you want to read or modify grammY Tools' code, you can do the following.

1. Install Node from <https://nodejs.org/>
2. Install pnpm with `npm i -g pnpm`
2. Use the following extensions for VSCode or similiar ones if you're using a different editor
  - [Astro](https://marketplace.visualstudio.com/items?itemName=astro-build.astro-vscode)
  - [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
  - [Tailwind CSS IntelliSense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)\
3. Use the extension for the UI framework you want to develop in. (Eg. [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur) or [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) for VSCode)
4. Clone this repo.
5. Run `pnpm i` in the root directory of the repo.
   This will download all dependencies and make your setup ready for development.

You are now ready to work on grammY Tools.
To see your changes in real time, run `pnpm dev` and open the indicated URL on your browser.
Before you open a PR, make sure to run `pnpm fmt` on the root directory to format your code with prettier.
