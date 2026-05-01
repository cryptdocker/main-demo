Privacy in crypto isn't optional — it's essential. Whether you're accessing geo-restricted exchanges, protecting your IP from tracking, or routing traffic through specific jurisdictions for compliance, proxies are a critical tool.

CryptDocker makes this easy with **per-site proxy configuration**.

## Why Per-Site Proxies?

Most proxy solutions are all-or-nothing: either all your traffic goes through the proxy, or none of it does. This creates problems:

- You don't want to route low-latency trading through a slow proxy
- Some sites block known proxy IPs
- Different exchanges may need different geographic endpoints
- You might need direct connections for some apps and proxied connections for others

CryptDocker lets you configure proxies **per app**, giving you granular control over every connection.

## Supported Proxy Types

### HTTP/HTTPS Proxy

The most common type. Works with virtually all web applications.

```
Protocol: HTTP
Host: proxy.example.com
Port: 8080
Username: (optional)
Password: (optional)
```

### SOCKS5 Proxy

Better for privacy and supports all traffic types, not just HTTP.

```
Protocol: SOCKS5
Host: proxy.example.com
Port: 1080
Username: (optional)
Password: (optional)
```

SOCKS5 proxies also support UDP traffic, which is useful for WebRTC and other real-time protocols.

## Setting Up a Proxy

### Per-App Configuration

1. Right-click any app in your sidebar
2. Select **App Settings**
3. Go to the **Proxy** tab
4. Enter your proxy details
5. Click **Save**

The proxy takes effect immediately — no restart needed. The app will reload with the new proxy configuration.

### Per-Workspace Configuration

You can also set a default proxy for an entire workspace:

1. Right-click the workspace folder
2. Select **Workspace Settings**
3. Configure the proxy under the **Network** section

All apps in the workspace will use this proxy unless they have their own per-app override.

## Proxy Priority

CryptDocker resolves proxy configuration in this order:

1. **App-level proxy** — Highest priority, overrides everything
2. **Workspace-level proxy** — Applies to all apps in the workspace
3. **No proxy (direct)** — Default if nothing is configured

## Testing Your Proxy

After configuring a proxy, you can verify it's working:

1. Open the proxied app
2. Visit a site like `whatismyip.com` within the webview
3. Confirm the IP matches your proxy's exit node

## Use Cases

### Geographic Access

Some exchanges restrict access by country. Route traffic through a proxy in an allowed jurisdiction:

- **Binance** via Singapore proxy
- **Coinbase** via US proxy
- **Regional DEXs** via local proxies

### IP Privacy

Prevent exchanges from correlating your accounts by IP. Each workspace can use a different proxy, making cross-account linking much harder.

### Compliance

If you operate in a regulated environment, you may need to route traffic through specific networks for audit and compliance purposes.

## Performance Tips

- Use proxies geographically close to the target server for lowest latency
- SOCKS5 is generally faster than HTTP proxies for streaming data
- Avoid free proxies — they're slow, unreliable, and potentially log your traffic
- Test proxy speed before using it for time-sensitive trading

## Availability

Per-site proxies are a **CryptDocker Pro** feature. Configure them in any app or workspace settings panel.

Your traffic, your rules. Route it however you need.
