If you manage multiple crypto accounts — whether for trading, testing, or team operations — you've probably dealt with the headache of session conflicts. Log into one exchange, and suddenly another tab loses its session. Or worse, browser fingerprinting links your accounts together.

CryptDocker solves this with **workspace-level session isolation**.

## What Is Session Isolation?

Every workspace in CryptDocker runs in its own completely independent browser session. This means:

- **Separate cookies** — Each workspace has its own cookie jar. Logging into Binance in Workspace A has zero effect on Workspace B.
- **Separate localStorage** — App data, preferences, and cached states are unique per workspace.
- **Separate sessions** — Authentication tokens, CSRF tokens, and session IDs are fully isolated.
- **Separate fingerprint** — Each workspace presents a distinct browser context, reducing cross-account fingerprinting.

## Why This Matters for Crypto

### Multi-Account Management

Many traders operate multiple accounts on the same exchange — whether for different strategies, different fund allocations, or managing client accounts. Session isolation lets you run them simultaneously without any conflicts.

### Airdrop Farming

If you're participating in multiple testnets or airdrop programs, each workspace can represent a different wallet and identity. No session leakage, no cookie contamination.

### Team Collaboration

Running a DAO or crypto project? Different team members can have their own workspaces with their own logins, all within the same CryptDocker instance on a shared machine.

### Privacy

Even if a malicious site tries to read cross-site data or fingerprint your browser, it can only see what's in its own workspace sandbox.

## How It Works Under the Hood

CryptDocker uses Electron's partition system to create isolated browser contexts. Each workspace is assigned a unique partition string, which means:

- Cookies are stored in separate databases
- Cache and storage are physically separated on disk
- Network requests go through independent session handlers

This is the same level of isolation you'd get from running entirely separate browser profiles — but managed seamlessly in a single app.

## Setting It Up

You don't have to configure anything. Session isolation is **on by default** for every workspace. When you create a new workspace, it automatically gets its own isolated session.

If you want to share a session between workspaces (for example, using the same login across a group of related DeFi apps), you can configure shared sessions in the workspace settings.

## The Bottom Line

Session isolation isn't just a convenience feature — it's a security fundamental. In an ecosystem where a single leaked session cookie can drain a wallet, CryptDocker gives you the separation you need without the complexity of managing multiple browsers or profiles.

Your workspaces. Your sessions. Fully isolated.
