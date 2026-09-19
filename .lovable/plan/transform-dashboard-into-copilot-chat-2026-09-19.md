# Transform Dashboard into Copilot Chat

## Summary
Replace the current authenticated Dashboard content with a focused Copilot conversation screen while preserving the existing sidebar and top bar. The Dashboard route remains the signed-in home/default destination.

## Changes
- Rename the Dashboard page identity and metadata to **Copilot**.
- Keep the existing desktop sidebar, mobile navigation, credits, profile controls, and top bar styling.
- Replace the current promotional heading, generation prompt, tool grid, and gallery with:
  - a clean empty-chat welcome state,
  - a scrollable conversation area,
  - a bottom-anchored composer.
- Build the composer with:
  - an auto-growing text box that expands as text is entered and shrinks as text is removed,
  - **Models** and **Tasks** selectors,
  - attachment control,
  - a clear **Run** send button,
  - Enter to send and Shift+Enter for a new line.
- Make sent prompts appear in the conversation with a lightweight local Copilot response so the screen is immediately interactive without reconnecting a backend.
- Update Home navigation labels to **Copilot** while retaining `/dashboard` as the route to avoid breaking existing links.

## Responsive behavior
- Desktop: composer centered at the bottom of the content area with room for conversation history.
- Mobile: composer remains fully usable above the viewport edge, controls wrap cleanly, and no content overlaps the existing top bar.

## Verification
- Check TypeScript diagnostics.
- Exercise text growth/shrink, selector menus, Enter/Shift+Enter, Run, and mobile/desktop layouts in the live preview.

## Technical details
- Add one focused chat component under the existing Hyper component set.
- Keep interaction state in the page component; no database, authentication, or generation API changes.
- Continue using the existing design tokens and shared button/menu components.
