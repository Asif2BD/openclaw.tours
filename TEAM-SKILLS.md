# Superhero Team - Skill Assignments

## Team Structure

### Kimi Claw (Leader)
- **Role:** Lead Agent / Team Coordinator
- **Skills:** Orchestration, Voice, Planning, Review
- **Sub-agents:** The Bard, Flash, Ironclad, Vision

---

## Superhero Agents & Skills

### The Bard (Writer)
**Assigned Skills:**
- `seo-geo` - SEO & GEO optimization for AI search engines
- `reddit` - Research from Reddit communities
- `twitter` - Social listening on X/Twitter
- `producthunt` - Product research and trends
- `requesthunt` - User demand research

**Capabilities:** Writing, copywriting, storytelling, editing, content strategy

---

### Flash (Social Media Expert)
**Assigned Skills:**
- `twitter` - Twitter/X content and engagement
- `reddit` - Reddit community management
- `producthunt` - Product Hunt launches
- `requesthunt` - Trend research
- `banner-creator` - Social media banners

**Capabilities:** Social media, engagement, viral content, community management, analytics

---

### Ironclad (Programmer)
**Assigned Skills:**
- `domain-hunter` - Domain research and registration
- `seo-geo` - Technical SEO implementation

**Capabilities:** Programming, debugging, architecture, testing, devops

---

### Vision (Graphic Designer)
**Assigned Skills:**
- `logo-creator` - AI logo generation
- `banner-creator` - Banner design
- `nanobanana` - AI image generation

**Capabilities:** Graphic design, branding, UI design, illustration, motion graphics

---

## Skill Locations

All skills are installed at:
```
/root/.openclaw/workspace/
├── banner-creator/
├── domain-hunter/
├── logo-creator/
├── nanobanana/
├── producthunt/
├── reddit/
├── requesthunt/
├── seo-geo/
└── twitter/
```

## How to Use

1. **Assign a task to me (Kimi)** via Telegram
2. **I'll delegate** to the appropriate superhero based on required skills
3. **Track progress** in Mission Control dashboard
4. **Review deliverables** before completion

## Example Workflows

### Content Creation
```
You: "Write a blog post about AI tools"
Kimi → The Bard (writing + seo-geo + reddit research)
```

### Social Media Campaign
```
You: "Create Twitter campaign for product launch"
Kimi → Flash (twitter + banner-creator + producthunt)
```

### Brand Identity
```
You: "Design logo and branding"
Kimi → Vision (logo-creator + nanobanana + banner-creator)
```

### Technical Setup
```
You: "Find domain and set up SEO"
Kimi → Ironclad (domain-hunter + seo-geo)
```
