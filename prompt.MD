# HOMESTYLER - Project Prompts & Instructions Log

This document collates all project specifications, functional instructions, and integration requirements executed for the **HOMESTYLER** application (Repository: `suparpapa/Home-styler-Project`).

---

## 1. Project Overview & Initial Migration

- **Repository**: `suparpapa/Home-styler-Project`
- **Application**: HOMESTYLER - Home Improvement & Contractor Marketplace for Singapore Homeowners.
- **Goal**: Connect homeowners with verified HDB-licensed renovation contractors directly, facilitate competitive bidding, integrate Singapore Land Authority (SLA) OneMap location intelligence, and foster community discussions.
- **Runtime Constraints**:
  - Node.js 22 + React 19 SPA (Vite) + Express (`server.ts` & Vite middleware).
  - Dev server bound to `0.0.0.0:3000`.
  - Cleaned package manager lockfiles to standardize on npm.
  - Environment variables documented in `.env.example`.

---

## 2. OneMap Singapore Geospatial Intelligence

- **API Endpoint**: `/api/onemap` proxying Singapore Land Authority (SLA) OneMap search API without requiring client-side API keys.
- **Health Check**: `/api/health` monitoring service uptime.
- **Location Verification**:
  - Live geocoding of 6-digit Singapore postal codes to SVY21 and WGS84 coordinate systems.
  - Identification of official building names, road names, and postal sector areas.
  - Built-in fallback to 2-digit Singapore Postal Sector coordinate centroid mappings (`src/utils/geo.ts`) for resilient offline or rate-limited operation.

---

## 3. "Nearest 10 Contractors" Recommendation System

### User Prompt:
> *"Please insert a tab where homeowners can key in their residential postal code and the system will recommend 10 contractors nearest to the postal code."*

### Key Requirements & Implementation:
1. **Dedicated Tab**:
   - Tab named **"Nearest 10 Contractors"** (or **"Nearest 10 by Postal Code"**) integrated into top navigation (`Header.tsx`) and mobile bottom navigation (`MobileBottomNav.tsx`).
   - Accessible via direct Service Path 2 card from the landing page.
2. **Postal Code Input**:
   - Homeowners key in any 6-digit Singapore residential postal code (e.g., `560410` Ang Mo Kio, `520261` Tampines, `609601` Jurong East, `178903` Central).
   - Real-time resolution via OneMap API upon completing 6 digits, pressing Enter, or clicking "Recommend 10 Nearest".
   - Browser GPS detection button (`Use GPS`) mapping geolocation to the closest Singapore sector.
   - 10 Quick-select preset buttons for major residential estates.
3. **Proximity Calculation & Ranking**:
   - Uses the Haversine spherical formula (`calculateDistanceKm`) to compute geodesic distances between homeowner coordinates and all 2,708 licensed contractors (`contractors.json`).
   - Sorts ascending and extracts strictly the top 10 closest contractors.
   - Ranks with medals (#1 Nearest, #2, #3, up to #10) and exact distance badges (e.g., `350 m away`, `1.2 km away`).
4. **Interactive Leaflet Map**:
   - Leaflet map dynamically centers and animates (`flyTo`) to the homeowner's postal location upon entry.
   - Pulsing home marker with SLA-verified address details.
   - Proximity boundary circles (3 km inner, 5 km mid, 10 km outer).
   - Numbered contractor workshop pins with click-to-view popups.
5. **Contractor Profile & Direct Action**:
   - Displays Company Name, Address, Postal Code, Area, UEN, and Active HDB License status.
   - Direct phone call links (`tel:`) and email links (`mailto:`).
   - "Engage Directly & Request Free Quote" button opening the quote modal with contractor pre-filled.

---

## 4. Codebase Rollback Reference

### User Prompt:
> *"Rollback my codebase using 5c4d5343af727b91c35edf98ac763c801cb86f63 from my repository Home-styler-Project."*

- **Target Commit**: `5c4d5343af727b91c35edf98ac763c801cb86f63` ("Add Nearest 10 Contractors recommendation tab with postal code input and map").
- Rolled back and aligned working tree to preserve verified base code before subsequent feature additions.

---

## 5. "Talk to Us" Disqus Forum Integration

### User Prompt:
> *"Create a tab "Talk to Us" and embed a disqus forum using the following:*
> 
> *1. DiscussionEmbed:*
> ```jsx
> import { DiscussionEmbed } from 'disqus-react';
> 
> <DiscussionEmbed
>     shortname='home-styler'
>     config={{
>         url: this.props.article.url,
>         identifier: this.props.article.id,
>         title: this.props.article.title,
>         language: 'en' 
>     }}
> />
> ```
> 
> *2. Comment Count:*
> ```jsx
> import { CommentCount } from 'disqus-react';
> 
> <CommentCount
>     shortname='home-styler'
>     config={{
>         url: this.props.article.url,
>         identifier: this.props.article.id,
>         title: this.props.article.title,
>     }}
> >
>     Comments
> </CommentCount>
> ```
> 
> *3. SSO Sign In:*
> ```jsx
> import { DiscussionEmbed } from 'disqus-react';
> 
> <DiscussionEmbed
>     shortname='home-styler'
>     config={{
>         url: this.props.article.url,
>         identifier: this.props.article.id,
>         title: this.props.article.title,
>         language: 'en',
>         remoteAuthS3: '',
>         apiKey: '',
>         sso: {
>             name: 'SampleNews',
>             button: 'http://example.com/images/samplenews.gif',
>             icon: 'http://example.com/favicon.png',
>             url: 'http://example.com/login/',
>             logout: 'http://example.com/logout/',
>             profile_url: 'http://example.com/profileUrlTemplate/{username}',
>             width: '800',
>             height: '400',
>         }
>     }}
> />
> ```

### Key Requirements & Implementation:
1. **Package Setup**:
   - Installed `disqus-react` and peer dependency `prop-types`.
   - Created TypeScript declaration file `src/disqus-react.d.ts` for clean compilation.
2. **Tab Integration**:
   - Created `src/components/TalkToUsTab.tsx`.
   - Added **"Talk to Us"** tab to desktop header navigation and mobile bottom navigation.
   - Connected `activeTab === 'talk-to-us'` in `src/App.tsx`.
3. **Features in "Talk to Us"**:
   - Embedded `<DiscussionEmbed />` configured with `shortname='home-styler'`.
   - Dynamic thread switching across multiple community topics (General Community, Contractor Experiences, Bidding Advice, Platform Support).
   - Embedded `<CommentCount />` displaying live comment badges per topic.
   - Interactive Single Sign-On (SSO) documentation drawer with `remoteAuthS3`, `apiKey`, and `sso` configuration schema.
   - Customer support contact hotlines and email direct channels.

---

## 6. Repository Synchronization Commands

- **Commit Changes**:
  ```bash
  git add .
  git commit -m "<descriptive message>"
  ```
- **Push to Remote**:
  ```bash
  git push origin main
  ```
