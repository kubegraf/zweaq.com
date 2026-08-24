# Content Guide

Where the words live, and how to write more of them.

---

## 1. Where everything is

| File | Owns |
|---|---|
| `src/content/site.ts` | Name, tagline, promise, URLs, contacts, commerce flags |
| `src/content/product.ts` | Specs, interaction modes, sensors, layers, variants |
| `src/content/claims.ts` | The claim ladder and its formatting rules |
| `src/content/pricing.ts` | Hardware bands, service tiers, disclaimer |
| `src/content/roadmap.ts` | Phases, milestones, statuses, disclaimer |
| `src/content/faq.ts` | Questions, answers, claim level, group |
| `src/content/comparison.ts` | Category comparison rows and support levels |
| `src/content/technology.ts` | Architecture blocks and open problems |
| `src/content/nav.ts` | Primary and footer navigation |
| `src/content/countries.ts` | Waitlist country list |

**Rule: if a marketer would want to change it, it is in `src/content/`.** No copy
edit should ever require touching a layout file.

---

## 2. Voice

Plain, specific, and unhurried. The product is unusual enough that it does not
need help sounding impressive; overselling it is what would make it sound
ordinary.

**Do**

- Say what a thing does, then what it costs you. "Bluetooth LE is the right
  radio for documents, and the wrong one for gigabytes."
- Name the constraint before the reader finds it. "There is no power budget for
  a language model in an object this size."
- Use the second person for what the user does, the third for what the ring
  does.
- Keep sentences short enough to read on a phone in one pass.

**Don't**

- Superlatives: revolutionary, seamless, effortless, game-changing, unrivalled.
- Empty intensifiers: incredibly, truly, simply, literally.
- Verbing nouns: "unlock a new paradigm".
- Rhetorical questions as headings: "But what if your ring could think?"
- Em-dash-stacked breathless sentences.
- "Introducing" as an opener.

---

## 3. Headlines

Six words or fewer where possible. A statement, not a tease.

| Good | Why |
|---|---|
| Not another health ring. | Names the objection and answers it |
| A screen that knows when to stay quiet. | Describes a real behaviour |
| Your ring. Your keys. | Two nouns, one argument |
| Still useful when the cloud isn't. | Concrete failure mode |
| A key you wear. | The whole product in four words |

| Bad | Why |
|---|---|
| Redefining wearable computing | Says nothing |
| The future is on your finger | Tease, not statement |
| Unleash your potential | Not about the product |

---

## 4. Writing a specification

Never write a bare figure. Write a `Claim`:

```ts
storage: target('32 GB', 'Encrypted user-accessible capacity'),
```

The `note` is where nuance goes — what is included, what conditions apply. The
qualifier is applied automatically. See [PRODUCT_CLAIMS.md](./PRODUCT_CLAIMS.md).

---

## 5. Writing an FAQ answer

Every answer must let the reader place the capability on the ladder: planned,
prototype, validated, available. An answer that leaves that ambiguous is a bug.

Structure:

1. Answer the question in the first sentence. If it is "no", the first word is
   "No".
2. Explain the reason, including the constraint.
3. Say what would have to be true for the answer to change.

```
Q: Does the ring run AI locally?
A: No, and we will not claim otherwise. A device this size does not have the
   power or thermal budget to run a large language model. Small on-device
   models handle things like gesture and wake detection. Anything larger runs
   on your phone or a connected device…
```

Set `level` to where the capability actually sits, and `group` to one of
`product`, `capability`, `commercial`, `data`.

---

## 6. Writing about competitors

Categories, never named products. Describe a category by what defines it, and
credit what it is good at. A health ring is an excellent instrument; ZWEAQ is
not an instrument. That comparison is more persuasive than a dismissal, and it
does not expose anyone to a defamation claim.

---

## 7. Microcopy

- **Buttons** — verb first, sentence case, no trailing punctuation. "Join early
  access", not "Sign up now!".
- **Form errors** — say what to do, not what went wrong. "Enter your email
  address", not "Email is required".
- **Empty and success states** — one short sentence, then what happens next.
- **Ring display strings** — six characters or fewer where possible. It is a
  0.28in screen and the copy should respect that.

---

## 8. Section eyebrows

One or two words, naming the topic rather than selling it: *Category*,
*Storage*, *Identity*, *Engineering*. They are paired with a section number and
read as a technical document's contents, which is the organising idea of the
whole page.

---

## 9. Adding a homepage section

1. Add the copy to a content file.
2. Create `src/components/sections/<Name>.tsx` using `<Section>`.
3. Give it the next `index` and insert it in `src/app/page.tsx`.
4. **Renumber the sections after it** — the numbering is the navigational spine.
5. Add its `id` to the section list in `tests/e2e/site.spec.ts`.
