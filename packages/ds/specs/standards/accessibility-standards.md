---
title: 'Accessibility Standards'
---

# Accessibility Standards

Best practices for universal access, ensuring our content, tools, and services are inclusive and understandable for all.

## No User Left Behind

## Every User Deserves Our Best

## Accessibility Is Usability

## Accessibility Acceptance Criteria

Component-specific accessibility acceptance criteria live on that component's own spec page. This component library is built to comply with these standards.

## Key Aspects Of Accessibility

A key aspect is incorporating real people in design:

- Ensure that everyone involved in web projects understands the basics of how people with disabilities use the Web.
- Involve users with disabilities early and throughout the design process.
- Involve users in evaluating web accessibility.

"Disability" is one of the few demographics that we are all likely to join at some point in our lives, whether it is permanent or temporary. Not only can our status change throughout our lives, but the impact of our disabilities can also vary widely throughout the course of a single day. Someone with chronic pain may struggle more in the morning, where someone else with eye strain may find their condition worsens as the day goes on. It is important to remember that every disability experience, just like every person, is different.

Simply making our content usable for someone with a disability also makes it usable in a wider variety of circumstances for all users, so making it accessible makes it better for more users, period.

## Four Main Categories Of Disability (+1)

Disabilities have historically tended to be grouped into four main categories: visual, auditory, motor, cognitive. Recently, vestibular has emerged as a fifth category, though it is often still lumped in with the other four. This list is far from exhaustive, and it should be noted that some disabilities or conditions can impact multiple categories. Someone with an auditory processing disorder, for example, might have a functional limitation with their hearing, but the condition itself might be included in the cognitive and neurological group.

### Motor Disabilities Can Include

- Parkinson's Disease
- Multiple Sclerosis
- Tremors
- Paralysis
- Carpal Tunnel

### Visual Disabilities Can Include

- Total blindness
- Color deficiency
- Low vision

### Auditory Disabilities Can Include

- Total deafness
- Partial deafness
- Tinnitus

### Cognitive & Neurological Disabilities Can Include

- ADHD
- Dyslexia
- Depression and anxiety
- Alzheimer's Disease
- Conditions triggered by certain visual elements, like brightness or movement onscreen (migraine, epilepsy)

### Vestibular/Motion Disorders Can Include

- Motion sickness
- Meniere's disease
- Vertigo

## A Matter Of Convenience Vs. A Matter Of Independence

While accessible digital content might be a matter of convenience for some, it is a matter of independence for many people with disabilities. When designed and implemented properly, a disabled person using Assistive Technology (AT) or adaptive techniques can access and use digital content without needing to rely on someone else.

Here are a few examples of how assistive technology can be coupled with accessibly designed and implemented digital content to enhance usability for people with disabilities:

- Blind people can use screen reader software (JAWS is one example) to read digital content aloud.
- Those with motor disabilities do not need a mouse to navigate; they might use a keyboard, voice recognition, or eye-tracking software among other options.
- Those who are deaf can use captions and/or transcripts when interacting with multimedia.

As creators of digital content, we can do our part to learn to recognize the barriers, to remove them where we can, and to create flexible content that can be adapted to the needs of those using it.

## Accessibility Guidelines

### Web Content Accessibility Guidelines (WCAG) 2.1

This design system follows the most recently published version of the Web Content Accessibility Guidelines (also known as WCAG, currently version 2.1). It adheres to Levels A and AA, and occasionally AAA where practical. When there's evidence to support it, a component may even go above and beyond WCAG guidelines.

Here are some examples of the types of tests an Accessibility Specialist might perform to ensure compliance with WCAG:

- A code check (manual and/or automated): Automated code checkers can catch about 30% of WCAG violations, with the percentage skewing higher with more manual guidance. This is great for quick wins.
- Keyboard-only testing: This does not require any special software, just a keyboard and some knowledge of the basic keystrokes.
- JAWS (screen reader software) and Chromium-based browsers (such as Chrome and Edge): Testing with an actual screen reader helps us ensure that everything is announced correctly as users navigate and interact with the content and that users can achieve the same results as a sighted mouse user with roughly the same amount of effort.
- Dragon (speech recognition software): Like screen reader testing, testing with Dragon helps ensure our content meets all users' needs.
- Color contrast check: A visual review and a color contrast checking tool will be used to verify that the color of the content (text and interactive controls) passes a contrast check against background colors. For example, certain color combinations like light gray on white are hard to read and should be avoided. WCAG provides a formula for determining minimum color contrast ratios based on the colors used and the size and weight of the text.
- Color alone: A visual review of the design will find if information is conveyed through color alone.
- Browser zoom/screen magnification: Using the built-in zoom features of the browser, zoom in to see if there is any loss of content or functionality, or if horizontal scrollbars appear.

## Considerations For Motor Disabilities

### Considerations For Keyboard-Only Users

- A user should be able to access all interactive content using just a keyboard.
- A user must always have a way to exit any content (avoid keyboard traps).
- If visual focus is moved, move keyboard focus as well.
- A user should have a clear, visible indicator of where their keyboard focus is at all times. This means clearly visible focus states with sufficient contrast.
- If you have created a custom component, you may need to provide onscreen instructions for how to interact with it using the keyboard, particularly when you are not using an easily recognizable, native component like a button.

### Keyboard Commands

These are the default keyboard commands for many of the common elements users will encounter in digital content.

- Tab: You should be able to Tab to any item that you can use a mouse on.
- Enter: Activate buttons or links that have focus.
- Spacebar: Activate buttons, radio buttons and checkboxes that have focus. Otherwise, pressing Spacebar scrolls the page down one screen.
- Arrow keys: Move through radio buttons or a set of tabs that are currently in focus. Otherwise, they scroll the page in their respective direction.
- Escape: Closes open tooltips, modals, and menus.
- Shift + Tab or Shift + Arrow: Performs the same action as Tab or Arrow, but in reverse.

### Other Things To Consider

- Consider how someone using speech recognition software is going to interact with a control. If there is no visible label onscreen, how are they likely to refer to it? Does it match the accessible name in the code? Could you just make that name visible for all users?
- Provide a single point of control as an alternative to gestures or dragging movements. For example, provide previous and next buttons to progress through a slideshow in addition to the ability to swipe through. For a file upload component, enable the user to browse to a file in addition to any drag-and-drop functionality.
- Do not restrict device orientation. A user may have a mobile device mounted to their wheelchair, for example, and be unable to change the device's orientation.
- Provide adequate target size and space between items. Do not assume your user will be using a mouse or have the fine motor control to hit a precision target.
- At the same time, take care with the amount of scrolling, clicks, or keystrokes needed. Repetitive motions can be tiring or even painful for some users. Two-dimensional scrolling (the need to scroll horizontally as well as vertically) should also generally be avoided for the same reasons.
- The default browser focus styles act as the standard for focus states for all elements. Custom focus solutions make it more difficult to maintain consistent, accessible experiences. The browser default for the focus state in Chromium Edge provides a meaningful advantage over a custom styling solution. It provides a single outline with an outer band of white and an interior band of black (or a system-defined color in macOS).

## Considerations For Visual Disabilities

### Considerations For Screen Reader Users

- Do not assume all screen reader users are blind. Some may have limited vision, or they may use a screen reader to support a different disability, such as dyslexia.
- A user should be able to access all visible content, which means providing a descriptive alt attribute for images used. There are very rare exceptions to this rule; for instance, images that are purely decorative do not need an alt attribute.
- A desktop screen reader user will use most of the same keystrokes as a keyboard-only user, plus a whole host of others. Touchscreen users have a series of gestures at their disposal. They are not limited to consuming the content top-to-bottom, word-for-word.
- For nearly all elements a user encounters, they should be able to determine its name, role, and value. What is this element? Is it a checkbox? What information is the checkbox asking about? Is the checkbox currently checked?
- Use good heading structure and semantic code to help users get an overview of the page layout and content.

### Considerations For People With Low Vision/Color Deficiency

- Ensure sufficient color contrast between text or controls and their respective backgrounds. For a fantastic primer on the topic, visit WebAIM's contrast and color accessibility page. To check the contrast yourself, two suggested options are the Colour Contrast Analyzer (available via Software Center for PC or Self Service for Mac) or WebAIM's contrast checker.
- Avoid using color alone to convey information. This rule is especially important in the following cases:
  - Linked text: Using an underline in addition to color is the most widely recognized method of indicating text is a link.
  - The state of a component: For example, is a checkbox selected or unselected? Is the accordion menu expanded or collapsed?
  - The different series in a data visualization: You can use symbols, labels, line weights or patterns, just to name a few options.
- Be mindful of white space. Both too much and too little can have negative impacts for users. Too much white space can cause eye strain (due to the brightness of the page) and allow less data on the screen at the same time, which can be especially problematic for screen magnification or browser zoom users. Too little white space can cause reading or input errors due to unclear grouping and label associations and result in eye strain from the lack of spacing between lines.
- Use an adequate font size and appropriate line spacing, and do not restrict the user's ability to customize either.

## Considerations For Auditory Disabilities

- Captions: Provide captions for all audio and video.
- Transcripts: Provide transcripts for all prerecorded multimedia.
- If using sound to convey meaning, also provide an alternate method of receiving that information. For example, if a sound alerts a user of an incoming message, a message icon also appears to provide a visual cue.
- Avoid automatically playing sound (like music or videos). This can be disruptive to several types of disabilities, including those using screen reading software or who may have their devices synchronized to their hearing aids.

## Considerations For Cognitive & Neurological Disabilities

- Use good heading structure and scannable content. In general, the more clearly content is structured, the easier it is to understand.
- Use adequate white space. As with the above, white space helps group content to make it more readable.
- Avoid too many distractions (e.g., movement on the screen). If you do incorporate movement or animation, be sure to honor the user's settings if they prefer reduced motion.
- Use clear labels, instructions, and error messages. This will help the user avoid errors and easily correct them if they do happen.
- Do not automatically start animations or video. In the time it takes the user to find the stop/pause button, the damage may already be done. It can take mere seconds to trigger motion sickness, a vestibular episode, or worse. When leveraged properly, animation and video can successfully focus a user's attention.
- Provide information in multiple formats if possible. What works best for one user does not always work well for another user. One may prefer colorful, interactive visuals while another may prefer a data table. If you can provide the flexibility of both, do so.

## Using ARIA

WAI-ARIA (Accessible Rich Internet Applications or ARIA) is meant to plug the accessibility gaps of interactive controls left behind by plain HTML.

The ARIA specification defines the five rules for its use. In short, the first rule of ARIA is "don't use ARIA." What this means is that if you can achieve the same result using a native HTML element or attribute, then you should do so. For example, if you already include visible text next to your input that serves as its label, use that as the actual `<label>` rather than adding an `aria-label` into the mix.

If you do need to use ARIA, then you should also make sure it is supported by the browsers and Assistive Technologies your audience will be using. Some ARIA is not widely supported even though it may be valid.

### A Note On `aria-label`

When there is no visible on-screen text that serves as a label, `aria-label` is useful to label that content. However, if you use an `aria-label` when there is an on-screen label present, it will override that visible text, which can present accessibility issues for screen reader users and speech recognition software users.

For example, if the visible on-screen label for a button reads "Open an Account," but the `aria-label` differs, screen reader users will hear the `aria-label`. Speech recognition software users may try to interact with the button using the visible on-screen label, but will not be able to easily do so because the button has a different programmatic label than the on-screen text that they are speaking.

## Resources

- Web Content Accessibility Guidelines
- Using ARIA (w3.org)
- WebAIM
- Web Accessibility for Designers
