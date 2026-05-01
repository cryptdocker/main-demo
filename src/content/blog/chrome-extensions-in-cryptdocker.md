Chrome extensions are essential to the crypto workflow. Whether it's MetaMask for wallet interactions, a password manager for secure logins, or an ad blocker for cleaner browsing — extensions make the web usable.

Starting today, **CryptDocker fully supports Chrome extensions**.

## Installing Extensions

Adding extensions to CryptDocker is straightforward:

1. Open the **Extension Manager** from the top bar
2. Click **Add Extension**
3. Paste the Chrome Web Store URL or load an unpacked extension from your local filesystem
4. The extension installs and appears in your extension bar

That's it. No workarounds, no side-loading hacks — just paste the URL and go.

## Pinning and Managing

Once installed, extensions appear in the extension management panel. From here you can:

- **Pin extensions** to the top bar for quick access
- **Enable/disable** extensions per workspace
- **Remove extensions** you no longer need
- **View extension details** including permissions and version

Pinned extensions show their icons in the extension bar at the top of the window, just like they would in Chrome.

## How Extensions Work with Workspaces

Here's where CryptDocker adds real value over a regular browser. Extensions in CryptDocker are **workspace-aware**:

- Extension state is isolated per workspace, matching our session isolation model
- You can have MetaMask connected to different wallets in different workspaces
- Extension popups open as overlays within CryptDocker — no separate windows

This means if you're managing multiple wallets or identities, each workspace maintains its own extension context.

## Supported Extensions

We use `electron-chrome-extensions` under the hood, which supports the vast majority of Chrome extensions. We've tested extensively with:

- **MetaMask** — Full support including transaction signing and network switching
- **Rabby Wallet** — Works seamlessly with DApp detection
- **uBlock Origin** — Ad blocking works across all webviews
- **1Password / Bitwarden** — Auto-fill works in embedded sites
- **Dark Reader** — Theme extensions apply per-site

Some extensions that rely on Chrome-specific APIs (like Chrome sync) may have limited functionality. We maintain a compatibility list in our documentation.

## Performance

Extensions run in the same process model as Chrome, so performance is comparable. CryptDocker's hibernation system also hibernates extension background pages for inactive workspaces, saving memory.

## Getting Started

Extensions are available to all **CryptDocker Pro** users. Free tier users can install up to 2 extensions.

If you're already a Pro user, open the Extension Manager and start adding your favorite tools. Your crypto workspace just got a lot more powerful.
