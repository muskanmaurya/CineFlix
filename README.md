# CineFlix

CineFlix is a full-stack movie discovery application built with React, Node.js, Express, MongoDB, and the TMDB API.

The application allows users to discover movies through curated sections, search, filtering, sorting, pagination, movie details, trailers, and a persistent anonymous wishlist.

The frontend communicates only with the CineFlix backend. The backend acts as an abstraction layer over TMDB, handles data normalization, caching, validation, error handling, and persists wishlist data in MongoDB.

---

## Live Demo

- Frontend: [https://cineflix-frontend-1dth.onrender.com](https://cineflix-frontend-1dth.onrender.com)
- Backend API: [https://cineflix-xcv2.onrender.com](https://cineflix-xcv2.onrender.com)
- Repository: [https://github.com/muskanmaurya/CineFlix](https://github.com/muskanmaurya/CineFlix)

---

## Features

- Curated home page with featured, trending, popular, top-rated, and upcoming movies
- Movie search with debounced input
- Genre filtering
- Sorting by popularity and other supported attributes
- Paginated discovery with "Load More"
- Movie detail pages
- Movie posters and backdrop images
- Movie ratings, vote counts, runtime, genres, status, and release information
- YouTube trailers when available
- Persistent anonymous wishlist
- Wishlist synchronization across pages
- Wishlist persistence across browser sessions
- Responsive design for desktop, tablet, and mobile
- Loading states
- Empty states
- Error states with retry/recovery actions
- Accessible interactive controls
- Backend caching for repeated TMDB requests
- Request cancellation for obsolete searches
- Input validation and centralized backend error handling
- Rate limiting and security middleware
- Server-side protection of TMDB credentials

---

## Product Approach

The goal was to build CineFlix as a small but production-shaped movie discovery product rather than simply displaying raw TMDB API responses.

The application separates responsibilities between the frontend, backend, external movie service, and persistence layer.

The browser never communicates directly with TMDB.

Instead, all movie-related requests follow this flow:

```text
User
  |
  v
React Client
  |
  | HTTPS / REST
  v
Node.js + Express API
  |
  +----------------------+
  |                      |
  v                      v
TMDB Integration      MongoDB
  |                   Wishlist
  v
TMDB API
```

This approach keeps external API credentials server-side and gives the application control over validation, caching, normalization, error handling, and future changes to the external provider.

---

## Architecture

```text
                    +----------------------+
                    |       Browser        |
                    | React + TypeScript   |
                    +----------+-----------+
                               |
                               | REST API
                               v
                    +----------------------+
                    |   Node.js Backend    |
                    | Express + TypeScript  |
                    +----------+-----------+
                               |
                +--------------+--------------+
                |                             |
                v                             v
      +-------------------+          +-------------------+
      |    TMDB Service   |          |   Wishlist        |
      | API Integration   |          |   Service         |
      +---------+---------+          +---------+---------+
                |                              |
                v                              v
         +-------------+               +-------------+
         |  TMDB API   |               |  MongoDB    |
         +-------------+               +-------------+
```

### Frontend responsibilities

- Rendering the product interface
- Routing
- Movie discovery UI
- Search and filtering
- Pagination
- Wishlist interactions
- Client-side caching
- Loading, error, and empty states
- Responsive and accessible UI

### Backend responsibilities

- API abstraction
- TMDB communication
- External data normalization
- Validation
- Caching
- Error handling
- Rate limiting
- Security middleware
- Wishlist persistence
- Anonymous visitor isolation

### Database responsibilities

MongoDB stores wishlist snapshots associated with an anonymous browser visitor.

The database does not store the complete TMDB movie catalogue.

---

## Project Structure

```text
CineFlix/
│
├── client/
│   ├── src/
│   │   ├── app/
│   │   ├── pages/
│   │   │   ├── Home/
│   │   │   ├── Discover/
│   │   │   ├── MovieDetails/
│   │   │   └── Wishlist/
│   │   │
│   │   ├── features/
│   │   │   ├── movies/
│   │   │   ├── search/
│   │   │   └── wishlist/
│   │   │
│   │   ├── components/
│   │   │   ├── movie/
│   │   │   ├── navigation/
│   │   │   ├── discovery/
│   │   │   └── feedback/
│   │   │
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── lib/
│   │   ├── types/
│   │   ├── constants/
│   │   ├── App.tsx
│   │   └── main.tsx
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── movies/
│   │   │   │   ├── movie.controller.ts
│   │   │   │   ├── movie.service.ts
│   │   │   │   ├── movie.routes.ts
│   │   │   │   ├── movie.mapper.ts
│   │   │   │   ├── movie.types.ts
│   │   │   │   └── movie.validation.ts
│   │   │   │
│   │   │   └── wishlist/
│   │   │       ├── wishlist.controller.ts
│   │   │       ├── wishlist.service.ts
│   │   │       ├── wishlist.routes.ts
│   │   │       ├── wishlist.model.ts
│   │   │       ├── wishlist.types.ts
│   │   │       └── wishlist.validation.ts
│   │   │
│   │   ├── integrations/
│   │   │   └── tmdb/
│   │   │       ├── tmdb.client.ts
│   │   │       ├── tmdb.mapper.ts
│   │   │       ├── tmdb.types.ts
│   │   │       ├── tmdb.constants.ts
│   │   │       └── tmdb.errors.ts
│   │   │
│   │   ├── middleware/
│   │   ├── config/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   │
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

---

## Technology Stack

### Frontend

- React
- TypeScript
- Vite
- React Router
- TanStack Query
- Tailwind CSS

### Backend

- Node.js
- TypeScript
- Express
- Mongoose
- MongoDB
- Zod
- Pino
- Helmet
- CORS
- express-rate-limit
- Native Node.js fetch

### External Services

- TMDB API for movie metadata
- MongoDB for wishlist persistence
- YouTube trailers through TMDB video metadata when available

---

## Data Flow

### Movie discovery

```text
React Component
      |
      v
TanStack Query Hook
      |
      v
Frontend API Client
      |
      v
GET /api/v1/movies/...
      |
      v
Express Controller
      |
      v
Movie Service
      |
      +----> Cache lookup
      |
      +----> TMDB Client
                    |
                    v
                 TMDB API
                    |
                    v
              Raw TMDB data
                    |
                    v
              Data Mapper
                    |
                    v
          Normalized movie object
                    |
                    v
               API Response
                    |
                    v
              React UI
```

### Wishlist

```text
React UI
   |
   v
Wishlist Hook
   |
   v
Frontend API Client
   |
   | X-Visitor-Id
   v
Node.js Wishlist API
   |
   v
Wishlist Service
   |
   v
MongoDB
```

---

## Backend API

Base API path:

```text
/api/v1
```

### Health

```text
GET /api/v1/health
```

Used to verify backend availability.

### Home

```text
GET /api/v1/movies/home
```

Returns curated movie sections used by the home page.

### Search

```text
GET /api/v1/movies/search?q=<query>&page=<page>
```

Searches movies through the backend TMDB integration.

### Discovery

```text
GET /api/v1/movies/discover?genre=<genre>&sort=<sort>&page=<page>
```

Supports genre filtering, sorting, and pagination.

### Movie details

```text
GET /api/v1/movies/:id
```

Returns normalized movie details including metadata and available videos.

### Wishlist

```text
GET /api/v1/wishlist
```

Requires:

```text
X-Visitor-Id: <anonymous-browser-id>
```

### Add to wishlist

```text
POST /api/v1/wishlist
```

Requires:

```text
X-Visitor-Id: <anonymous-browser-id>
```

### Remove from wishlist

```text
DELETE /api/v1/wishlist/:movieId
```

Requires:

```text
X-Visitor-Id: <anonymous-browser-id>
```

---

## Important Technical Decisions

### 1. Backend abstraction over TMDB

The frontend does not call TMDB directly.

This provides:

- Server-side credential protection
- A stable internal API
- Centralized validation
- Centralized error handling
- Data normalization
- Caching
- Easier future provider replacement

The frontend depends on CineFlix domain types rather than raw TMDB response structures.

---

### 2. Normalized movie data

TMDB responses are mapped into a stable internal structure.

Example:

```json
{
  "id": 123,
  "title": "Example Movie",
  "overview": "Movie description",
  "posterUrl": "...",
  "backdropUrl": "...",
  "releaseDate": "2025-01-01",
  "rating": 8.4,
  "voteCount": 12000,
  "genreIds": [28, 12]
}
```

This prevents TMDB-specific response structures from leaking throughout the frontend.

---

### 3. Anonymous wishlist identity

Authentication was intentionally not implemented because it was outside the assignment requirements.

Instead, the client generates a UUID:

```text
crypto.randomUUID()
```

The identifier is stored in browser localStorage using:

```text
cineflix_visitor_id
```

Wishlist API requests send this identifier using:

```text
X-Visitor-Id
```

This provides persistent wishlist behavior for the same browser without introducing an unnecessary authentication system.

---

### 4. Wishlist database model

Each wishlist record contains a small movie snapshot:

```text
visitorId
movieId
title
posterPath
releaseDate
rating
createdAt
updatedAt
```

A compound unique index is used:

```text
(visitorId, movieId)
```

This prevents duplicate wishlist entries for the same anonymous visitor.

---

### 5. Snapshot instead of repeated detail requests

The wishlist stores enough movie information to render the wishlist page without requesting movie details for every saved item.

This avoids:

```text
Wishlist
  |
  +--> Movie API request
  +--> Movie API request
  +--> Movie API request
  +--> Movie API request
  ...
```

Instead:

```text
Wishlist
   |
   v
MongoDB snapshot data
   |
   v
Render immediately
```

This reduces unnecessary external API traffic and improves page performance.

---

### 6. In-memory caching

The backend uses a bounded process-local TTL cache for repeated TMDB requests.

The cache:

- Reduces repeated external requests
- Improves response times
- Helps handle repeated searches/details requests
- Automatically expires stale entries
- Has a bounded maximum size

The cache is intentionally process-local because Redis would be unnecessary complexity for the scope of this assignment.

For horizontally scaled production infrastructure, a shared cache such as Redis could replace this implementation.

---

### 7. Search debouncing and request cancellation

Search input is debounced before requests are sent.

This prevents an API request from being generated for every keystroke.

Example:

```text
c
ca
cat
cati
catio
cation
```

Instead of making six immediate requests, the client waits briefly for the user to stop typing.

Obsolete requests are also cancelled where possible to reduce race conditions and unnecessary network work.

---

### 8. Pagination instead of loading everything

The application does not attempt to load an unlimited movie catalogue at once.

Discovery uses pagination and a "Load More" interaction.

This keeps:

- Network payloads manageable
- Rendering performant
- Memory usage controlled
- The user experience scalable as the result set grows

---

## Error Handling and Resilience

The application handles several real-world failure scenarios.

### Invalid requests

Backend input is validated using Zod.

Invalid movie IDs, missing search parameters, and invalid query parameters return controlled `400` responses.

---

### TMDB failures

The TMDB integration handles:

- Timeout
- Network failure
- Non-2xx responses
- Invalid upstream responses
- Missing data
- Rate limiting
- Temporary external service failures

The frontend displays controlled error states instead of raw server errors.

---

### Missing movie data

The UI safely handles missing:

- Posters
- Backdrops
- Overview text
- Release dates
- Ratings
- Trailers
- Optional metadata

This prevents incomplete external data from breaking the interface.

---

### Empty results

Search and discovery provide dedicated empty states instead of rendering broken or blank layouts.

---

### Rapid user interaction

The frontend uses:

- Debounced search
- Request cancellation
- Stable TanStack Query keys
- Shared wishlist query state
- Controlled mutation states

This reduces stale responses and race-condition issues.

---

## Security

Security considerations implemented in the application include:

- TMDB credentials are server-side only
- MongoDB credentials are server-side only
- Environment files are excluded from Git
- No TMDB credentials are stored in Vite client environment variables
- Helmet security headers
- CORS configuration
- API rate limiting
- Zod request validation
- Centralized error handling
- Sanitized external API errors
- No stack traces returned to production clients
- No sensitive request headers logged
- Cookies and authorization values are not logged
- TMDB credentials are not logged
- MongoDB credentials are not logged

The browser only communicates with the CineFlix backend.

---

## Performance

Performance considerations include:

- TanStack Query client-side caching
- Backend TMDB caching
- Debounced search
- Request cancellation
- Paginated discovery
- Lazy loading through user-driven pagination
- Avoiding per-item wishlist detail requests
- Reusable movie card components
- Bounded backend cache
- Stable query keys
- Responsive image sizing and poster layouts

The application is designed to remain usable as the amount of movie content increases.

---

## Accessibility

The UI includes accessibility considerations such as:

- Semantic navigation
- Accessible buttons
- Meaningful labels
- Keyboard-accessible controls
- Visible focus states
- `aria-label` where appropriate
- `aria-pressed` for wishlist state
- Clear loading and error feedback
- Avoidance of nested interactive elements
- Responsive layouts

---

## Responsive Design

The interface is designed for:

- Desktop
- Laptop
- Tablet
- Mobile

The movie grid and horizontal movie rows adapt to available screen width.

The UI also accounts for:

- Long movie titles
- Different poster dimensions
- Missing images
- Smaller screens
- Mobile navigation
- Touch-friendly controls
- Large result sets

---

## Wishlist Persistence

The wishlist uses a two-layer approach.

### Browser identity

The browser stores:

```text
cineflix_visitor_id
```

This value identifies the anonymous visitor.

### Server persistence

The wishlist itself is stored in MongoDB.

Therefore:

```text
Browser localStorage
        |
        | stores visitor identity
        v
X-Visitor-Id
        |
        v
Node.js API
        |
        v
MongoDB wishlist
```

Closing and reopening the browser does not remove the wishlist.

Clearing browser storage creates a new anonymous visitor identity.

---

## Why No Authentication?

Authentication was intentionally excluded from the current implementation.

The assignment requires persistent wishlist functionality but does not require:

- User registration
- Login
- Password management
- OAuth
- Multi-device accounts

Adding authentication would increase implementation complexity without directly improving the core assignment requirements.

For a larger production application, authentication could be introduced later to support cross-device synchronization and account-based personalization.

---

## Assumptions

The following assumptions were made during implementation:

1. TMDB is used as the external movie metadata provider.
2. The application is a movie discovery product rather than a movie streaming service.
3. Full-length copyrighted movie hosting or streaming is outside the project scope.
4. TMDB provides metadata, posters, backdrops, and associated video information.
5. Authentication is not required for the assignment.
6. Anonymous browser-based wishlist identity is acceptable.
7. MongoDB is used as the persistence layer.
8. Search and discovery results are expected to be paginated.
9. External API failures are expected and should not crash the application.
10. The process-local cache is sufficient for the assignment's deployment scale.

---

## Limitations

### Anonymous wishlist

Wishlist data is associated with a browser-generated visitor ID.

If browser storage is cleared, the previous anonymous wishlist cannot automatically be recovered.

### No cross-device synchronization

Because there is no authentication system, a wishlist created on one browser/device does not automatically appear on another device.

### Process-local cache

The backend cache is stored in application memory.

It resets when the server restarts and is not shared across multiple backend instances.

A shared cache such as Redis would be more appropriate for horizontally scaled deployments.

### External API dependency

Movie discovery depends on TMDB availability, response quality, and rate limits.

Temporary TMDB failures can therefore affect movie-related functionality.

---

## Future Improvements

If the application were developed further, the following improvements would be prioritized.

### High priority

- User authentication
- Cross-device wishlist synchronization
- Automated integration tests
- Automated end-to-end browser tests
- Better production monitoring
- Structured application metrics

### Medium priority

- Shared Redis cache
- Infinite scrolling
- Advanced filtering
- More movie categories
- Actor and director pages
- Similar movie recommendations
- Watch-provider information

### Longer-term

- Personalized recommendations
- User profiles
- Social features
- Watchlists beyond movies
- Notification system
- Advanced analytics
- Multi-region infrastructure if required

---

## Local Development

### Prerequisites

Install:

- Node.js 18+
- npm
- MongoDB
- TMDB API credentials

---

## Environment Variables

### Server

Create:

```text
server/.env
```

Example:

```text
PORT=5000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:5173

TMDB_READ_ACCESS_TOKEN=your_tmdb_read_access_token
TMDB_BASE_URL=https://api.themoviedb.org/3

MONGODB_URI=your_mongodb_connection_string
```

Alternatively, a TMDB API key can be configured according to the backend environment configuration.

### Client

Create:

```text
client/.env
```

Example:

```text
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

Never place TMDB or MongoDB credentials in `VITE_` environment variables.

---

## Run the Backend

```bash
cd server
npm install
npm run dev
```

The backend runs on:

```text
http://localhost:5000
```

---

## Run the Frontend

Open another terminal:

```bash
cd client
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

---

## Verification

### Frontend

```bash
cd client

npm run type-check
npm run build
```

### Backend

```bash
cd server

npm run type-check
npm run build
```

The application was also verified through focused runtime checks covering:

- Health endpoint
- Movie home endpoint
- Search
- Discovery
- Movie details
- Wishlist creation
- Wishlist retrieval
- Wishlist deletion
- Visitor isolation
- Responsive UI behavior
- Loading states
- Error states
- Empty states

---

## Deployment

The deployed architecture follows a simple monorepo model:

```text
GitHub Repository
       |
       +-------------------+
       |                   |
       v                   v
Frontend Deployment    Backend Deployment
       |                   |
       v                   v
React / Vite          Node / Express
                           |
              +------------+------------+
              |                         |
              v                         v
          TMDB API                  MongoDB
```

The frontend and backend are deployed independently while remaining in the same Git repository.

The backend receives production environment variables for:

```text
MONGODB_URI
TMDB_READ_ACCESS_TOKEN
TMDB_BASE_URL
CLIENT_ORIGIN
NODE_ENV
PORT
```

The frontend receives:

```text
VITE_API_BASE_URL
```

The frontend must point to the deployed backend rather than directly to TMDB.

---

## Git and Repository Structure

The project is maintained as a monorepo:

```text
CineFlix/
├── client/
├── server/
├── .gitignore
├── package.json
└── README.md
```

This keeps frontend and backend development in one repository while maintaining clear separation of responsibilities.

---

## TMDB Attribution

This product uses the TMDB API but is not endorsed or certified by TMDB.

Movie data and images are provided by The Movie Database (TMDB).

---

## AI Usage

AI tools were used during development for:

- Architecture planning
- Code exploration
- Implementation assistance
- Debugging
- Error analysis
- Documentation drafting
- Test and verification planning
- Code quality review
- Identifying edge cases
- Improving resilience and security

AI-generated suggestions were reviewed against the existing application architecture rather than being accepted blindly.

The resulting implementation was validated through:

- TypeScript type checking
- Production builds
- Backend runtime checks
- API endpoint verification
- Wishlist persistence checks
- Visitor-isolation checks
- Browser verification
- Error-state verification
- Responsive UI verification

The developer remains responsible for understanding the implementation and its technical decisions.

---

## Engineering Summary

CineFlix was designed around a few core engineering principles:

```text
Separation of concerns
        +
Backend abstraction
        +
Stable internal data models
        +
Persistent data where required
        +
Controlled external API usage
        +
Caching
        +
Request cancellation
        +
Validation
        +
Resilient error handling
        +
Security by default
        +
Responsive accessible UI
```

The result is a maintainable full-stack application that satisfies the movie discovery requirements while leaving a clear path for future improvements such as authentication, shared caching, automated testing, personalization, and production observability.

---

