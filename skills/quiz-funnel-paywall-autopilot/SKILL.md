---
name: "quiz-funnel-paywall-autopilot"
description: "Audit a web-to-app quiz funnel to its paywall in a mobile-size browser: optimized JS autopilot or full screen-by-screen audit. Fake data, a disclosed email per session, never purchases."
---

# Quiz funnel audit (to the paywall)

Goal: reach the paywall of a public quiz funnel, then record its structure, plans, prices and renewal terms. Use for competitive research on funnels you are allowed to view.

## What it does and how to use it
**What you get:** per funnel URL, the outcome (paywall, account wall, gate, dead), plans with list and charged prices, trial and renewal terms, guarantee, timers, email-gate position, merchant entity and quiz structure. Every run ends with one overview page (one row per funnel, first screen to paywall) built from a template, plus a Markdown report.

**How it works:** it drives a browser at mobile size (375x812) with an injected autopilot (`autopilot.js`) that answers with fake data and a disclosed email address. It never presses buy, pay, checkout or start-trial buttons, and it stops at card forms, payment iframes, camera gates and CAPTCHAs.

**Example prompts:**
- "Walk these 5 funnels to the paywall and give me a price table."
- "Full audit of <url>."
- "Optimized run on these URLs, one row per funnel."

**You need:** a browser the agent can drive (Claude desktop in-app browser, or the claude.ai browser tool). A shell is optional and only used to build the overview page and keep a local copy.

## Responsible use
Only audit funnels you are entitled to view. Respect each site's terms, run one funnel at a time at human pace, and never bypass blocks, CAPTCHAs or bot detection. Walking a funnel enters fake data into a live product, which adds noise to the owner's analytics and triggers emails to the address used. Many funnels say on the first screen that continuing means accepting their terms; the walk does continue, so record that line in the report. The Full audit report structure is adapted from the community skill `analyze-quiz`; the rest is original.

## Files
- `autopilot.js`: the injected script. Read it once per session.
- `gotchas.md`: generic fixes for screens the script cannot pass. Read it only when a walk stalls or gates.
- `known-funnels.md`: optional, private notes on specific funnels. Read it if it exists; it is not published.
- `templates/overview.html` + `build.py`: build the overview page and report from one `data.json`.

## Step 0: one question round
Ask once, with one question tool call holding both questions; skip any the user already answered:
1. **Depth:** Optimized (default) or Full audit.
   - Optimized: autopilot only, screenshots at first screen, email gate and paywall.
   - Full audit: same walk, plus screenshots at every new screen type (landing, question, loader, results, email, discount, paywall top, plan cards, paywall footer) and the full screen log from `__rec`, then the report sections in `data.json`.
2. **Email:** a plus-alias of the user's own address (`name+qf<yyMMddHHmm>@domain`, recommended) or a random `<first>.<last><6 digits>@gmail.com`. Warn that a random Gmail address may belong to a real person, who will then receive the funnel's emails.

No answer or user away: Optimized and a random address, and say so. State the address in one visible line before walking (not only in your reasoning) and again in the final report. Use the same address for every funnel in the session.

## Rules
- Fake data only. The script refuses to start until `window.__email` is set.
- Never remove the buy, payment-form, camera or CAPTCHA guards. When `g` is set, stop and report it.
- Do not create accounts (Google, Apple or email sign-up walls): stop and report the wall and the screens reached.
- Cookie banners: the script rejects or opens cookie settings and rejects; it never accepts.
- Consent: `window.__consent=false` by default; set it to true only if the user approves for this run. Known limit: a label such as "I agree to the processing of my health data" can still be tapped as an answer option, so check the screen log for consent screens and report them.
- A refused or blocked navigation: report it, do not work around it.

## Tool map
| Action | Claude desktop in-app browser | claude.ai `browser_repl` |
|---|---|---|
| Open URL | `navigate` (opens the pane) | `tab.page.goto(url)` |
| Mobile size | `resize_window` 375x812, after navigate | `tab.page.setViewportSize({width:375,height:812})` |
| Inject / poll | `javascript_tool` (top-level `await` works) | `tab.page.evaluate(...)` |
| Screenshot | `computer` screenshot, `scale: 0.5` | `tab.screenshot()` |
| Fill a stubborn input | `find` + `form_input` | `locator.fill()` |
| Real drag (scratch card) | `computer` `left_click_drag` | `tab.page.mouse` down, move, up |
| Restore | `resize_window` preset `desktop` | `setViewportSize(null)` |

The claude.ai column comes from runs of an earlier version and is not retested with v38. There, `window` is not defined in the repl sandbox itself (it is inside `evaluate`), `const` cannot be redeclared across calls (use `var`), and `waitForFunction` gives up after about 3s, so poll with `await tab.page.evaluate('__poll(25000)')`.

`resize_window` fails until a tab is open, so navigate first. A hidden pane slows timers: keep it visible. Screenshot results print a source file path; keep those paths in screen order for the build step.

## Steps
1. Navigate to the funnel URL, keeping UTM and click-id params. Resize to 375x812. A cross-domain redirect wipes the script: re-inject after it. If a homepage button opens the quiz in a new tab, the in-app browser blocks it: read the URL by overriding `window.open` (`window.open=u=>{window.__u=String(u)}`), click the button, then navigate to `window.__u`.
2. Clear stored state, one call, on every funnel (an earlier visit can leave expired discount timers or resume straight at the paywall):
   `(async()=>{localStorage.clear();sessionStorage.clear();document.cookie.split(';').forEach(c=>{const n=c.split('=')[0].trim();if(n)['',location.hostname,'.'+location.hostname.split('.').slice(-2).join('.')].forEach(d=>document.cookie=n+'=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/'+(d?';domain='+d:''))});try{(await indexedDB.databases()).forEach(d=>indexedDB.deleteDatabase(d.name))}catch(e){}return 'cleared'})()`
   Then navigate to the original URL again.
3. Screenshot the first screen. Note A/B hints in the URL or storage (variant, ab, flow, split, experiment).
4. Inject in one call: `window.__email='<address>';window.__consent=false;` followed by the contents of `autopilot.js`. It returns `ap v38`.
5. Poll with one call: `await __poll(25000)`. It returns early when the walk finishes or gates, with `d` done, `g` gate, `s` stall ticks, `t` taps, `u` path and `new` (new screens, 90 characters each). Screenshot the email gate when it appears in `new`; in Full audit also each new screen type. Loaders take 10s to 8 min.
6. If `g` is set, or `s` reaches 6, read `gotchas.md` (and `known-funnels.md` if present), act by hand, then re-inject (the screen log and tap count survive re-injection).
7. When `d` is true: wait about 8s, read the page text once, click each plan card (selection only, never the CTA) to read its renewal line, and take three screenshots: paywall top, plan cards, footer (merchant, guarantee, payment marks). Record exit-intent popups, scratch cards and discounts.
8. Restore the desktop viewport.

## Record per funnel
- Outcome: paywall, partial (order page or app download), account wall, UI gate, dead, refused.
- Pattern: A (web, then in-app paywall), B (web quiz, web payment, app install), C (web capture, SMS or link, in-app activation).
- Quiz length, real questions versus informational screens, input types, progress style, time.
- Data collected and where personalization is reused on results and offer pages.
- Email-gate position; plan reveal before paywall; loader length and content.
- Plans: names, durations, list and charged price, per-day price, default plan. Check per-day prices against the stated period and the renewal wording.
- Anchoring, urgency (timers and whether they are real), trial or intro price and renewal price, guarantee text.
- Social proof near the CTA, CTA copy, payment marks, checkout type if seen, upsells, merchant entity, terms-by-continuing line.
- Discounts vary per run: always give list price, charged price and the run date.
Treat published benchmarks (for example 6 to 12 questions) as a rubric, not facts.

## Paywall detection
Needs 3+ taps, then either 3+ prices with a paywall-like path (pay, checkout, paywall, subscri, purchase, /plan, offer) or plan terms (per day/week/month, billed, trial, cancel anytime, money-back, auto-renew); or 1+ price on a pay/checkout path with plan terms. Prices count with the currency before or after the number (USD, EUR, GBP, AED, د.إ, ر.س, PLN, zł, CHF, R$, ₹ and others). "Get my plan" style buttons are blocked once the page shows 2+ prices, a pay path or plan terms. A currency the pattern does not know disarms both checks: if `new` shows plan cards and `d` stays false, stop the script (`clearInterval(__ap)`) and add the symbol to `CS`. It can fire one step early; confirm with a text read.

## Deliverable (every run)
1. Copy the screenshots in screen order to `<out>/<funnel>/screens/NN.jpg`, first screen first, paywall last. `<out>` is the scratchpad if there is one, otherwise a temp folder.
2. Write `<out>/data.json` following the schema at the top of `build.py`. Fill the `report` block only in Full audit.
3. Run `python3 <skill dir>/build.py <out>`. It writes `overview.html` (screenshots embedded, page contract already applied) and `report.md`. Publish `overview.html` as a private artifact and give the link.
4. If a shell is available, copy `<out>` to `~/Downloads/<funnel>-funnel-audit/`. Without a shell, write the page by hand from the template and say the local copy was skipped.
In the final message: the address used, the link, the folder, and real prices (struck list price versus charged price). Report results in a table; do not narrate each screen.

## Known limits
- Button words cover English, Spanish and Portuguese, plus some back and buy words in other languages. Other languages stall: act by hand.
- Not handled: sliders and rulers, `<select>` dropdowns, quizzes inside iframes (Typeform-style embeds), shadow DOM options, canvas or slide-stack options, timed video gates, account walls.
- Countdown text at the top of a screen hides stalls (`s` stays 0). Two-field screens (current and target weight) fill only the first field. Both need a hand fill.
- It always picks the first option, so it walks one branch per funnel and the persona can be inconsistent.
- Prices follow your IP's country.

## Cost
v36, one Full audit of one funnel: 94 tool calls, about 65k output tokens, about 120k tokens of added context. v37, Full audit of two funnels (2026-11-22): about 36 browser calls in total; tokens not measured.
