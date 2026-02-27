# TOOLS.md - Local Notes

Skills define _how_ tools work. This file is for _your_ specifics — the stuff that's unique to your setup.

## What Goes Here

Things like:

- Camera names and locations
- SSH hosts and aliases
- Preferred voices for TTS
- Speaker/room names
- Device nicknames
- Anything environment-specific

## Examples

```markdown
### Cameras

- living-room → Main area, 180° wide angle
- front-door → Entrance, motion-triggered

### SSH

- home-server → 192.168.1.100, user: admin

### TTS

- Preferred voice: "Nova" (warm, slightly British)
- Default speaker: Kitchen HomePod
```

## Why Separate?

Skills are shared. Your setup is yours. Keeping them apart means you can update skills without losing your notes, and share skills without leaking your infrastructure.

---

### Voice System

Location: `/root/.openclaw/voice/`

**Speech-to-Text:** OpenAI Whisper (local, free)
- Models: tiny, base, small, medium, large
- Default: base

**Text-to-Speech:** edge-tts (free, Microsoft Edge)
- Default voice: en-US-AriaNeural (Female, warm)
- Other options: en-US-GuyNeural, en-GB-SoniaNeural, en-GB-RyanNeural

**Usage:**
```bash
# Transcribe
/root/.openclaw/voice/voice_handler.py transcribe --input audio.mp3

# Speak
/root/.openclaw/voice/voice_handler.py speak --text "Hello" --output out.mp3
```

Add whatever helps you do your job. This is your cheat sheet.
