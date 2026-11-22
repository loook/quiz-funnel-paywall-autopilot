# Gotchas (generic)

Read when the autopilot stalls (`s` 6+) or gates. Act by hand, then re-inject `autopilot.js`.

## Options and clicks
- Real `<button>` or `<label>` options: the script works as is.
- Hidden-input React funnels: options are hidden `input[type=checkbox]` overlays or React `onClick` handlers, and tile clicks do nothing. Click the visible overlay inputs (not inside cookie banners), first option per screen, then Continue.
- Option divs with no pointer cursor and no role: only React `onClick` detection (`hasRC`) finds them.
- Custom option divs and slide-stack layouts: click by hand or log a UI gate. Sites that ignore synthetic clicks need real coordinate clicks from a fresh screenshot.
- Multi-select screens: Continue does nothing until an option is picked; the script picks the first option every 4th stall tick. A custom "Next Step" button may need a native `button.click()`.
- "Get my plan" or "Unlock" buttons before the paywall are navigation while the page shows fewer than 2 prices; the script clicks them then and blocks them once 2+ prices show.
- A fast tick can trigger a flow error on some engines: keep the 2000ms tick. On a questionnaire error, clear site storage and reload the original ad URL.

## Inputs
- Number and email fields need the native value setter plus `input`/`change` events; keystrokes get swallowed.
- React email gates may keep Continue disabled after a synthetic set: refill with `form_input` (or `locator.fill`), then press Tab.
- Two-field screens (current and target weight): only the first field is filled. Fill the second by hand.
- Unit toggles (ft/in vs cm, lb vs kg) are excluded from options and set to cm/kg once.
- Masked date-of-birth fields need digits only (03151990). `input[type=date]` gets 1990-03-15 for birth dates, otherwise today + 90 days. Custom date pickers may ignore the value; the site's default is then used.
- Name screens ("What should we call you?") get `Alex`.
- Validation text ("too low", "must be") triggers retries with other values for that field type.
- Footer or header text can come first in the page text. The script reads headings plus the first 130 characters and never types the email into a numeric field.

## Screens
- Health Yes/No screens: the script answers No once per screen.
- Marketing opt-in screens: the script picks the decline option. If none is found, pick it by hand.
- Cookie banners where the first layer has only OK and Cookie settings: the script opens settings and clicks Reject All. If that fails, do the same by hand; never accept.
- Scratch cards: may be canvas or plain elements. Three real drags across the card (top, middle, lower strip) usually reveal it; synthetic drags often do not.
- Loader text can read 0% while the visual is at 100%: check one screenshot before declaring a hang.
- Screenshots can show a stale frame while the page has moved on; trust page text and script state.
- A paywall URL can show while a loader still runs behind it: wait for the loader before reading prices.
- Timed video gates ("keep watching to unlock your plan") can run 7+ minutes: wait or log a gate; do not skip or seek the video.
- Countdown text at the top of a screen hides stalls: check `new` in the poll output for a repeating screen.
- A site can resume an earlier session straight at the paywall, or show an expired discount timer from an earlier visit: Step 2 clears stored state on every funnel.
- Consent checkboxes next to ordinary questions ("I consent to processing my health data") are skipped while `window.__consent` is false. If Continue stays disabled, ask the user before ticking it.
- Section labels ("Weight Goals") can sit above a current-weight question; the script treats a heading with "current" as current, not target. Check the entered values in the screen log.
- Old quiz URLs can redirect to the marketing site; start from the site's own quiz button instead.

## Prices and families
- Discounts change per run (scratch card, flash-sale timer, promo code): always record list price, charged price and the run date.
- Funnel engines repeat across brands (same toggles, paywall path, plan set and renewal). Expect identical structure across variants, but read the plan cards, not a remembered template.
- Old quiz URLs are often dead (404, redirect to a marketing site, Cloudflare errors): expect about a third unusable.
- Non-English funnels: add the language's words to `CONT`, `NEG` and `BUY` before running. A back button in an unknown language gets tapped as an option.
