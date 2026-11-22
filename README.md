# Quiz funnel paywall autopilot

A Claude skill that walks a web-to-app quiz funnel to its paywall in a mobile-size browser, using fake answers, and records what the paywall offers: plans, list and charged prices, per-day prices, trial and renewal terms, guarantee, timers, email-gate position and merchant entity. It never buys anything.

Use it for competitive research on funnels you are allowed to view.

## What you get

For each funnel URL:
- The outcome: paywall, account wall, UI gate, dead link or refused.
- A price table with struck list price, charged price, per-day price and the renewal line for every plan.
- Quiz structure: number of screens, question types, loaders, email gate, discounts and exit-intent offers.
- One overview page (screenshots from first screen to paywall) and a Markdown report.
- Full audit mode adds a screen-by-screen log, tactics, strengths, weaknesses and takeaways.

## Safety guards

The injected script (`autopilot.js`):
- Never clicks buy, pay, checkout, subscribe or start-trial buttons. "Get my plan" style buttons are blocked as soon as a page shows prices, a payment path or plan terms.
- Stops at card forms, payment iframes, camera gates and CAPTCHAs.
- Never accepts cookies; it rejects them or opens cookie settings and rejects there.
- Declines marketing opt-ins and leaves consent checkboxes unticked unless you approve them for the run.
- Refuses to start until you set the email address the funnels will receive.

## Requirements

- A browser Claude can drive. Tested with the in-app browser of the Claude desktop app (Code tab). The claude.ai browser tool is described in `SKILL.md` but not retested with the current version.
- Python 3, optional, to build the overview page with `build.py`.

## Install

**Claude app (claude.ai or desktop):** zip the skill folder so the zip contains `quiz-funnel-paywall-autopilot/SKILL.md`, then upload it under Customize → Skills.

```bash
cd skills && zip -r ../quiz-funnel-paywall-autopilot.zip quiz-funnel-paywall-autopilot
```

**Claude Code:** load the repo as a plugin, or copy the skill folder into your skills directory.

```bash
claude --plugin-dir /path/to/quiz-funnel-paywall-autopilot
```

```bash
cp -R skills/quiz-funnel-paywall-autopilot ~/.claude/skills/
```

## Usage

Ask Claude in plain words, for example:
- "Walk these 5 funnels to the paywall and give me a price table."
- "Full audit of https://example.com/quiz."

Before walking, the skill asks two questions: depth (Optimized or Full audit) and which email to use. A plus-alias of your own address (`you+qf2611221200@yourdomain.com`) is recommended; a random Gmail address may belong to a real person, who would then receive the funnel's emails.

## Files

| File | Purpose |
|---|---|
| `skills/quiz-funnel-paywall-autopilot/SKILL.md` | The skill: steps, rules, what to record, known limits |
| `autopilot.js` | Script injected into the page; answers screens and reports progress through `__poll()` |
| `gotchas.md` | Fixes for screens the script cannot pass on its own |
| `build.py` + `templates/overview.html` | Build the overview page and report from `data.json` |
| `known-funnels.md` | Optional, private notes on specific funnels. Not included; listed in `.gitignore` |

## Known limits

- It picks the first option on every screen, so it walks one branch per funnel.
- Button words cover English, Spanish and Portuguese plus some other languages; other languages stall.
- Not handled: sliders and rulers, `<select>` dropdowns, quizzes in iframes, shadow DOM, canvas options, timed video gates, account walls.
- Prices follow your IP's country, and discounts change between runs.

## Responsible use

Only audit funnels you are entitled to view and respect each site's terms. Run one funnel at a time at human pace and never bypass blocks, CAPTCHAs or bot detection. Walking a funnel enters fake data into a live product and triggers emails to the address used.

The Full audit report structure is adapted from the community skill `analyze-quiz`.

## License

MIT. See [LICENSE](LICENSE).
