<img src="./img/logo1.png" width="100" height="100">

> Open Book

**A web platform for book clubs to organise, read, and grow together.**

> Built with Django REST Framework (Back-End) and React (Front-End)

---

## Table of Contents

- [Mission Statement](#mission-statement)
- [Target Users](#target-users)
- [Features](#features)
  - [User Roles](#user-roles)
  - [Book Clubs](#book-clubs)
  - [Books](#books)
  - [Meetings](#meetings)
  - [Announcements Board](#announcements-board)
  - [Pages](#pages)
  - [Nice To Haves](#nice-to-haves)
- [Technical Implementation](#technical-implementation)
  - [Front-End Stack](#front-end-stack)
  - [External Integrations](#external-integrations)
  - [Development Setup](#development-setup)
  - [Routing](#routing)
- [Frontend Architecture](#frontend-architecture)
- [Branding](#branding)
  - [Fonts](#fonts)
  - [Colours](#colours)
- [Wireframes](#wireframes)

---

## Mission Statement

Open Book is an all-in-one platform designed to simplify and enrich the book club experience. It replaces the scattered mix of group chats, spreadsheets, and calendar invites with a single, purpose-built space where readers can organise clubs, discover new communities, track their reading, schedule meetings, and stay connected.

Whether it is a small group of friends or a larger reading community, Open Book gives both organisers and members the tools to keep their club active, structured, and engaging without the usual coordination headaches.


## Target Users

Open Book serves two primary user groups:

**Book Club Owners** are the people who take the initiative to bring readers together. They need tools to create and manage clubs, schedule meetings, manage membership requests, choose books, and post updates. Open Book gives them a centralised dashboard to handle all of this in one place.

**Book Club Members** are readers who want to participate easily. They want to join clubs, follow the current read, RSVP to meetings, and keep up with announcements. Open Book makes the reading experience social and organised so members stay engaged throughout the reading journey.

## Features

Open Book allows users to create or join book clubs, search books through Google Books, track club reading progress, manage meetings, and stay updated through a shared announcement space. The platform supports both public and private clubs with role-based access for organisers and members.

### User Roles

| Role | Access | Description |
|------|--------|-------------|
| **Owner** | Can create clubs, edit club settings, approve members, add books, manage reading status, post announcements, and schedule meetings. | The organiser of a specific book club. |
| **Member** | Can join clubs, view club content, leave clubs, and RSVP to meetings. | A regular participant in one or more book clubs. |
| **Guest** | Can browse public-facing pages and discover clubs. | A visitor who has not logged in yet. |

### Book Clubs

| Feature | Access | Notes / Conditions |
|---------|--------|--------------------|
| Create club | Authenticated user | User becomes the owner of the club they create. |
| Edit club details | Owner | Includes title, description, visibility, meeting mode, image, and member capacity. |
| View clubs | All users | Public clubs are visible to guests; logged-in users see more context. |
| Join club | Authenticated user | Public clubs allow instant join; private clubs require approval. |
| Leave club | Member | Members can leave a club at any time. |
| Approve / reject members | Owner | Private club membership requests only. |

### Books

| Feature | Access | Notes / Conditions |
|---------|--------|--------------------|
| Search books | Owner | Search powered by Google Books API. |
| Add club books | Owner | Selected books are saved to the club’s reading list. |
| Manage reading status | Owner | Books can move between `to read`, `reading`, and `read`. |
| View current and historic reads | Members, Owner | Visible inside the club page. |

### Meetings

| Feature | Access | Notes / Conditions |
|---------|--------|--------------------|
| Schedule meeting | Owner | Includes title, description, date, time, meeting type, and location/link. |
| Edit meeting | Owner | Owners can update meeting details. |
| Delete meeting | Owner | Allowed unless blocked by booking rules in backend. |
| Book a meeting | Members, Owner | Members can RSVP/book into meetings. |
| View meetings | Members, Owner | Meetings are visible inside the club dashboard. |

### Announcements Board

| Feature | Access | Notes / Conditions |
|---------|--------|--------------------|
| View announcements | Members, Owner | Club-only content. |
| Post announcement | Owner | Used for updates, reminders, and links. |

### Pages

| Page | Functionality | Access |
|------|--------------|--------|
| Home | Marketing page with hero section, stats, platform explanation, and featured clubs. | Public |
| Register | Create an account. | Public |
| Login | Log into the platform. | Public |
| Club List | Discover clubs, search by keyword, and filter by visibility. | Public / Authenticated |
| Club Page | Club dashboard with books, meetings, members, and announcements. | Depends on membership and role |
| Create Club | Create a new club with details and settings. | Authenticated |
| Profile | View profile info, joined clubs, owned clubs, pending approvals, and booked meetings. | Authenticated |
| Not Found | Handles invalid routes. | Public |

### Nice To Haves

- Book voting and polls
- Ratings and reviews
- Calendar integration
- Notifications system
- Co-organisers / multiple organisers
- Richer discussion threads
- Better analytics and reading insights
- More advanced filtering and search

## Technical Implementation

### Front-End Stack

- React 19
- React Router
- Vite
- Tailwind CSS v4
- Motion
- Fetch API
- Custom React hooks for shared logic
- Context API for authentication state

### External Integrations

- Google Books API for searching and importing book metadata

### Routing

The current frontend routes include:

/ — Home page
/login — Login page
/register — Register page
/clubs — Club discovery page
/clubs/:clubId — Individual club page
/clubs/create — Create club page
/profile — User profile page

### Front End Architecture

src/
  api/                API helper files for backend and external requests
  components/         Shared and feature-specific UI components
    clubs/            Club page components
    forms/            Form components
    modals/           Modal components
    motion/           Scroll and animation helpers
  hooks/              Custom hooks such as auth and club-book loaders
  pages/              Route-level page components
  utils/              Helper functions
  main.jsx            App entry point and router setup

**Key Frontend Patterns**
AuthProvider stores auth state globally across the app
Route-level pages live in src/pages
Feature UI is split into reusable components
API logic is separated into src/api
Conditional rendering is used heavily for owner/member/guest permissions
Club pages combine backend data with Google Books search for owner workflows


