# AutoCare Garage — Auto Repair Website Concept

A responsive custom website concept inspired by the information architecture and interactions of the reference automotive shop page. It uses its own AutoCare identity, rewritten content, a different navy/orange palette, and separate stock photography rather than copying the reference company's branding or text.

## Files
- `index.html` — complete landing page and shop information sections
- `styles.css` — responsive site styling, mega menu, dropdowns, hover states, transitions, and service-page styling
- `script.js` — interactive navigation, mobile menu, reveal transitions, two-step appointment form, FAQ/review interactions
- `service.html` — reusable service detail and full service catalog page
- `service.js` — service-specific content for the menu's service links

## Interactions
- Desktop hover and keyboard-focus mega menu under **Services**, with popular services and a multi-column directory
- Responsive touch/click dropdown menu on phones and tablets
- About menu dropdown
- Service detail pages driven by `?service=...` query parameters
- Two-step appointment request form with browser-side validation
- Expand/collapse FAQ items
- Testimonial carousel controls
- Scroll reveal transitions with reduced-motion support

## Before publishing
1. Replace the sample AutoCare Garage name/logo with the real shop's approved name and brand.
2. Add the actual address, phone number, hours, service area, transportation/amenities offered, certifications, warranty terms, and business-owner/team information.
3. Add real, verified customer reviews only with permission. Current testimonial content is marked as placeholder copy.
4. Connect the appointment form to a real scheduling system or form endpoint. **The current form is a visual/interaction demo and does not send or store submissions.**
5. Confirm every advertised service is actually available at the shop.
6. Check image use, accessibility, SEO metadata, and the final deployment before launch. Photography currently loads from Unsplash URLs.

The concept re-creates familiar auto-shop website structure and behavior while avoiding use of the reference brand's name, logo, text, customer reviews, or proprietary imagery.