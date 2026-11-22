"""Build overview.html and report.md from <out>/data.json.

Usage: python3 build.py <out>

data.json schema (all strings unless noted; optional keys may be omitted):
{
  "date": "YYYY-MM-DD", "mode": "optimized" | "full", "email": "address used",
  "funnels": [{
    "name": "", "url": "", "outcome": "paywall|partial|account wall|UI gate|dead|refused",
    "pattern": "A|B|C", "geo": "country / currency",
    "summary": "one paragraph",
    "plans": [{"name": "", "list": "", "charged": "", "per_day": "", "badge": "", "renews": "", "default": false}],
    "facts": [["label", "value"]],
    "findings": [""], "not_passed": [""],
    "screens": [{"file": "screens/01.jpg", "caption": ""}],   # paths relative to <out>/<funnel name>/ or <out>
    "steps": [{"n": "", "type": "", "content": "", "input": ""}],          # full audit
    "report": {"summary": [""], "personalization": [""], "tactics": [["tactic", "what the page does"]],
               "strengths": [""], "weaknesses": [""], "takeaways": [""]}  # full audit
  }]
}
"""
import base64, html, json, pathlib, sys

E = lambda s: html.escape(str(s or ""))
MAX = 15 * 1024 * 1024


def img(base, f, name):
    for p in (base / name / f, base / f):
        if p.is_file():
            mime = "image/png" if p.suffix.lower() == ".png" else "image/jpeg"
            return f"data:{mime};base64," + base64.b64encode(p.read_bytes()).decode()
    print(f"warning: screenshot not found: {f}", file=sys.stderr)
    return ""


def ul(items):
    return "<ul>" + "".join(f"<li>{E(i)}</li>" for i in items) + "</ul>" if items else ""


def funnel_html(base, f):
    out = [f'<section class="funnel"><h2>{E(f.get("name"))}</h2>']
    pills = [f'Outcome: {f.get("outcome", "")}', f'Pattern {f.get("pattern", "?")}', f.get("geo", "")]
    out.append('<div class="pills">' + "".join(f'<span class="pill">{E(p)}</span>' for p in pills if p.strip())
               + '<span class="pill warn">Nothing purchased</span></div>')
    if f.get("url"):
        out.append(f'<p class="sub" style="overflow-wrap:anywhere">{E(f["url"])}</p>')
    if f.get("summary"):
        out.append(f"<p>{E(f['summary'])}</p>")
    if f.get("plans"):
        rows = "".join(
            f'<tr><td>{E(p.get("name"))}{" (default)" if p.get("default") else ""}</td>'
            f'<td class="n"><s>{E(p.get("list"))}</s></td><td class="n">{E(p.get("charged"))}</td>'
            f'<td class="n">{E(p.get("per_day"))}</td><td>{E(p.get("badge"))}</td><td>{E(p.get("renews"))}</td></tr>'
            for p in f["plans"])
        out.append('<div class="scroll"><table><thead><tr><th>Plan</th><th>List</th><th>Charged</th>'
                   f'<th>Per day</th><th>Badge</th><th>Renews at</th></tr></thead><tbody>{rows}</tbody></table></div>')
    if f.get("screens"):
        figs = "".join(
            f'<figure><img src="{img(base, s["file"], f.get("name", ""))}" alt="{E(s.get("caption"))}" width="200" height="433">'
            f'<figcaption><b>{i:02d}</b> {E(s.get("caption"))}</figcaption></figure>'
            for i, s in enumerate(f["screens"], 1))
        out.append(f'<div class="strip" tabindex="0" aria-label="Screens, scroll sideways">{figs}</div>')
    if f.get("facts"):
        out.append("<dl>" + "".join(f"<div><dt>{E(k)}</dt><dd>{E(v)}</dd></div>" for k, v in f["facts"]) + "</dl>")
    if f.get("findings"):
        out.append("<h3>Findings</h3>" + ul(f["findings"]))
    if f.get("steps"):
        rows = "".join(f'<tr><td class="n">{E(s.get("n"))}</td><td>{E(s.get("type"))}</td><td>{E(s.get("content"))}</td>'
                       f'<td>{E(s.get("input"))}</td></tr>' for s in f["steps"])
        out.append('<h3>Screen by screen</h3><div class="scroll"><table><thead><tr><th>#</th><th>Type</th>'
                   f'<th>Content</th><th>Options or input</th></tr></thead><tbody>{rows}</tbody></table></div>')
    r = f.get("report") or {}
    if r:
        for key, title in (("summary", "Executive summary"), ("personalization", "Personalization")):
            if r.get(key):
                out.append(f"<h3>{title}</h3>" + "".join(f"<p>{E(p)}</p>" for p in r[key]))
        if r.get("tactics"):
            rows = "".join(f"<tr><td>{E(a)}</td><td>{E(b)}</td></tr>" for a, b in r["tactics"])
            out.append('<h3>Psychological tactics</h3><div class="scroll"><table><thead><tr><th>Tactic</th>'
                       f"<th>What the page does</th></tr></thead><tbody>{rows}</tbody></table></div>")
        out.append('<div class="two"><div><h3>Strengths</h3>' + ul(r.get("strengths", []))
                   + '</div><div><h3>Weaknesses and opportunities</h3>' + ul(r.get("weaknesses", [])) + "</div></div>")
        if r.get("takeaways"):
            out.append("<h3>Key takeaways</h3>" + ul(r["takeaways"]))
    if f.get("not_passed"):
        out.append("<h3>What the script could not pass</h3>" + ul(f["not_passed"]))
    out.append("</section>")
    return "\n".join(out)


def md_list(items):
    return "".join(f"- {i}\n" for i in items)


def funnel_md(f):
    m = [f"## {f.get('name')}\n", f"Outcome: {f.get('outcome')} · Pattern {f.get('pattern', '?')} · {f.get('geo', '')}\n"]
    if f.get("url"):
        m.append(f"URL: `{f['url']}`\n")
    if f.get("summary"):
        m.append(f"{f['summary']}\n")
    if f.get("plans"):
        m.append("| Plan | List | Charged | Per day | Badge | Renews at |\n|---|---|---|---|---|---|")
        for p in f["plans"]:
            m.append(f"| {p.get('name')}{' (default)' if p.get('default') else ''} | ~~{p.get('list', '')}~~ | "
                     f"{p.get('charged', '')} | {p.get('per_day', '')} | {p.get('badge', '')} | {p.get('renews', '')} |")
        m.append("")
    for k, v in f.get("facts", []):
        m.append(f"- **{k}:** {v}")
    m.append("")
    if f.get("findings"):
        m.append("### Findings\n" + md_list(f["findings"]))
    if f.get("steps"):
        m.append("### Screen by screen\n| # | Type | Content | Options or input |\n|---|---|---|---|")
        m += [f"| {s.get('n')} | {s.get('type')} | {s.get('content')} | {s.get('input')} |" for s in f["steps"]]
        m.append("")
    r = f.get("report") or {}
    for key, title in (("summary", "Executive summary"), ("personalization", "Personalization")):
        if r.get(key):
            m.append(f"### {title}\n" + "\n\n".join(r[key]) + "\n")
    if r.get("tactics"):
        m.append("### Psychological tactics\n| Tactic | What the page does |\n|---|---|")
        m += [f"| {a} | {b} |" for a, b in r["tactics"]]
        m.append("")
    for key, title in (("strengths", "Strengths"), ("weaknesses", "Weaknesses and opportunities"), ("takeaways", "Key takeaways")):
        if r.get(key):
            m.append(f"### {title}\n" + md_list(r[key]))
    if f.get("not_passed"):
        m.append("### What the script could not pass\n" + md_list(f["not_passed"]))
    return "\n".join(m)


def main():
    base = pathlib.Path(sys.argv[1]).resolve()
    data = json.loads((base / "data.json").read_text(encoding="utf-8"))
    funnels = data.get("funnels", [])
    tpl = (pathlib.Path(__file__).parent / "templates" / "overview.html").read_text(encoding="utf-8")
    title = "Funnel Audit Overview" if len(funnels) != 1 else f"{funnels[0].get('name', 'Funnel')} Funnel Audit"
    eyebrow = f"{data.get('mode', 'optimized')} audit · {data.get('date', '')} · {len(funnels)} funnel(s)"
    sub = f"Mobile viewport 375x812. Fake data; email used: {data.get('email', 'not recorded')}. Never purchased."
    page = (tpl.replace("{{TITLE}}", E(title)).replace("{{EYEBROW}}", E(eyebrow)).replace("{{SUBTITLE}}", E(sub))
            .replace("{{CONTENT}}", "\n".join(funnel_html(base, f) for f in funnels)))
    (base / "overview.html").write_text(page, encoding="utf-8")
    md = f"# {title}\n\n{eyebrow}\n\n{sub}\n\n" + "\n\n".join(funnel_md(f) for f in funnels)
    (base / "report.md").write_text(md, encoding="utf-8")
    size = len(page.encode())
    print(f"overview.html {size:,} bytes, report.md {len(md.encode()):,} bytes")
    if size > MAX:
        print("warning: page over 15 MB; drop screenshots or lower their scale", file=sys.stderr)


if __name__ == "__main__":
    main()
