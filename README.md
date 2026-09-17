# PassReveal

A lightweight Chrome Manifest V3 extension that reveals password fields when they receive focus and hides them again when focus leaves.

## Core behavior
- No eye icon or injected button.
- Click/focus a password field -> it becomes visible.
- Leave the field -> it hides again (default).
- Switching tabs hides revealed passwords (default).
- Works with dynamically created fields through delegated focus handling.
- Does not store, transmit, or log password values.

## Install
1. Extract this ZIP.
2. Open `chrome://extensions`.
3. Turn on Developer mode.
4. Click "Load unpacked".
5. Select the extracted `passreveal` folder.

## Privacy
PassReveal does not need an account or server. Password values are never intentionally read, stored, transmitted, or logged. The extension only changes the password input's HTML `type` between `password` and `text`.
