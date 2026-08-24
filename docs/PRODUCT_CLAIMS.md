# Product Claims Policy

ZWEAQ ONE does not exist as validated hardware. This document defines how the
website is allowed to talk about it, and how that rule is enforced in code
rather than in review.

---

## 1. The claim ladder

Defined in `src/content/claims.ts`.

| Level | Means | Numeric values render as |
|---|---|---|
| `concept` | Defined on paper and in CAD. No hardware built to this spec. | `Target: …` |
| `prototype` | Built and demonstrated on bench hardware. Not in ring form. | `Target: …` |
| `engineering` | Working in a ring-form build, measured under test. | `Measured on EVT: …` |
| `production` | Validated on production tooling against the released spec. | bare value |
| `available` | Shipping today in a product you can buy. | bare value |

**Everything on the site today is `concept` or `prototype`.**

---

## 2. How it is enforced

A specification value is never a string in a component. It is a `Claim`:

```ts
storage: target('32 GB', 'Encrypted user-accessible capacity'),
```

and it is rendered through `<Spec>`, which calls `formatClaim()`. There is no
code path that prints a bare `32 GB` for an unvalidated level.

Three tests guard this, and they fail the build:

- `tests/unit/claims.test.ts` — asserts **every** entry in `productConfig.specs`
  is at an unvalidated level and formats with a qualifying prefix. If someone
  promotes a spec to `production` without hardware, this fails.
- `tests/unit/schema.test.ts` — asserts the qualifier survives into structured
  data, and that the Product schema publishes **no** `offers` block.
- `tests/e2e/site.spec.ts` — reads the rendered page text and asserts every
  occurrence of a headline figure is preceded by its qualifier.

---

## 3. Phrases this site does not use

| Never | Instead |
|---|---|
| "32 GB of storage" | "Target: 32 GB" |
| "7-day battery" | "Target: up to 7 days" |
| "5 ATM waterproof" | "Target: 5 ATM. Not yet certified." |
| "Payments supported" | "Designed for future payment integrations." |
| "Works with your laptop" | "Designed to work with compatible devices." |
| "Military-grade encryption" | Describe the actual design. |
| "Unhackable" / "Uncrackable" | "Nothing is unhackable." |
| "Certified secure" | "We hold no third-party security certification." |
| "Runs AI on your finger" | "The ring handles interaction; computation happens on a connected device." |
| "Ships 2028" | "Targets first customer shipments in 2028." |

---

## 4. Rules for competitors

The comparison table (`src/content/comparison.ts`) compares **device categories,
never named products**, and:

1. Describes each category by what defines it, not by its weakest example.
2. States what health rings are good at, because they are good at it.
3. Marks every ZWEAQ row "designed for", because nothing is validated.
4. Uses "varies by product" honestly — it means exactly that.

---

## 5. Things we do not have, and do not imply

No customer logos. No partnership logos. No investor logos. No awards. No
testimonials. No user counts. No "trusted by". No press logos. No fabricated
statistics.

An empty space is more credible than a fake one, and every one of these is
trivially checkable by the sort of person we most need to convince.

---

## 6. Product imagery

Every product visual is a **procedural concept render**, generated from vector
geometry in `src/components/product/` and `scripts/ring-svg.mjs`. None of it is
a photograph.

- The hero, the demo and the product page all carry a visible "Concept render"
  label, and the SVG's accessible name says so too.
- `/press` states it in the asset list and asks for it to be captioned that way.
- Renders depict intended industrial design. They are **not** validated
  dimensions and must never be used as such.

---

## 7. Roadmap

`src/content/roadmap.ts` has a `MilestoneStatus` of `complete | in-progress |
planned`. **Nothing is currently `complete`**, and nothing should be marked
complete until it has actually happened. Dates are planned targets, and the UI
says so directly beneath the timeline.

---

## 8. When something does get validated

1. Measure it. Write down how it was measured.
2. Raise the claim's `level` in the content file — only there.
3. Run `npm test`. The claims test will now expect the new level.
4. The prefix disappears from the page, the schema and the tests together.

Do not edit a component to change how a number reads. That is the one path this
system exists to close.
