---
name: engagement-gift-experience
description: Build and refine this project's personalized engagement gift website. Use when creating a simple, cute, playful, photo-led engagement surprise for Shivam's fiancee.
---

# Engagement Gift Experience

Create a digital gift that feels personal, cute, light, and playful. Treat the site as a private scrapbook, not a public landing page.

## Core Story

Use these fixed story dates unless the user changes them:

- Fiancee name: Sneha
- Home name: Gudiya
- Shivam's help number: 9473903051
- First meeting: 23 October 2025
- She said yes: 14 June 2026
- First chocolate gift: 8 July 2026
- Engagement: 17 July 2026

Use the KitKat photo as the first chocolate gift memory. Use the couple image as the main emotional anchor.

## Experience Rules

- Never use questions, quizzes, date inputs, answer gates, or failure states.
- Start with one simple tap-to-open moment.
- Keep every memory available through normal scrolling after the gift opens.
- Use playful photo interactions that never block progress.
- Present the dates as sweet scrapbook memories.
- Make the final section feel like a private note rather than a marketing CTA.

## UI Direction

- Act like a senior product engineer and UI designer.
- Use purposeful interaction over decorative complexity.
- Keep the page fast and static-host friendly; avoid backend requirements.
- Use accessible HTML, keyboard-friendly controls, and visible focus states.
- Avoid generic hero-card layouts, stock copy, and feature descriptions.
- Use the existing image assets and add new ones under `assets/`.
- Keep mobile layout first-class because the QR code will be scanned on a phone.

## Implementation Pattern

For this repository:

1. Keep it static: `index.html`, `styles.css`, `script.js`, and `assets/`.
2. Use JavaScript only for lightweight delight such as opening, confetti, and photo notes.
3. Use local UI state only; do not require sign-in, forms, or analytics.
4. Keep the main journey linear and easy to scroll.
5. After edits, check for broken image references and conflict markers.
6. Commit and push to GitHub Pages when the user asks for live updates.

## Copy Tone

Write as Shivam speaking to his fiancee:

- intimate
- respectful
- emotionally specific
- simple enough to read on a phone
- never cheesy or generic
- use "Sneha" for direct personal moments
- use "Gudiya" sparingly for warmer private moments

Prefer short lines like:

- "You unlocked the day my future changed."
- "This one was not expensive. It was sweet because it was from you."
- "I am not showing everything at once. Some memories deserve to be opened slowly."

## Validation Checklist

Before finishing:

- The first screen has one obvious open action.
- There are no questions or blocking interactions.
- The fixed dates are used exactly and consistently.
- The KitKat memory is tied to 8 July 2026.
- The engagement date remains 17 July 2026.
- The live page still returns HTTP 200 after deployment.
