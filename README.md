# Tobi : ) - Video Platform

A flexible video hosting platform with access control and monetization features. Users can upload videos, share them privately with specific individuals, create paid playlists, and manage their public content - all in one place.

## Features (MVP)

- **Authentication**
  - Email/Password registration with email verification
  - Google **OAuth** integration
  - Session-based auth with Redis
  - Password reset flow

- **Video Management**
  - Direct **S3 upload** via pre-signed URLs
  - Multiple access levels: Public, Private, Paid
  - Private video sharing with specific users
  - Automatic thumbnail generation
  - Video search with **Elasticsearch** 

- **Playlists**
  - Create and manage playlists
  - One-time playlist purchases
  - Add videos to multiple playlists
  - React with recommended or not recommended 

- **Social Features**
  - Comments with nested replies (YouTube-style)
  - Reactions (recommend/not recommended)
  - Real-time notifications via **WebSockets**

- **Payments**
  - Playlist purchases via Paymob
  - Webhook handling for payment verification
  - Purchase history and entitlements

## Future Phases
- Multi-quality video transcoding (360p, 720p, 1080p)
- HLS adaptive streaming
- Creator subscriptions (monthly access to all content)
- Video analytics and view tracking
- ads integration with a subscription to us as Tobi : )

---

## Tech Stack
### Backend
- **Framework:** NestJS (TypeScript)
- **Database:** MySQL
- **ORM:** Prisma
- **Cache/Sessions:** Redis
- **Message Queue:** RabbitMQ
- **Storage:** AWS S3
- **Payment:** Paymob

### Infrastructure
- **Reverse Proxy:** Nginx
- **Containerization:** Docker
- **CI/CD:** GitHub Actions
- **Deployment:** Docker Compose on VPS

### Video Processing
- **Thumbnail Generation:** ffmpeg
- **Upload Strategy:** Pre-signed S3 URLs

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Ahmedali64/Tobi.git
cd Tobi
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
```bash
# Edit `.env` with your configuration:
cp .env.example .env
```

### 4. Start infrastructure with Docker
```bash
# if you have these on your local host do not use this
# or if you are on windows like me you can stop them using the following steps
- windows r 
- services.msc
- look for MYSQL stop it 
- start dockercompose
docker-compose up -d 
```

This starts:
- MySQL (port 3306)
- Redis (port 6379)
- RabbitMQ (port 5672, management UI on 15672)

### 5. Run database migrations
```bash
npx prisma migrate dev
npx prisma generate
```

### 6. (Optional) Seed database
```bash
npm run seed
```

### 7. Start the development server
```bash
npm run start:dev
```

API will be available at `http://localhost:3000`

---
## API Documentation

Once running, visit:
- **Swagger UI:** `http://localhost:3000/api/docs`
- **Health Check:** `http://localhost:3000/health`

## Testing
```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```
---

## Database Schema

I did design the database schema to be flexible by adding enums and **normalized tables** into smaller and more focused tables, focused on the performance by adding **indexes** (single and composed) with unique constraints, I added a specific **dataType size** that suits every column to reduce storage and **improve efficiency**

Key tables:
- `users` - User accounts (email + OAuth)
- `videos` - Video metadata & storage keys
- `video_shares` - Private video sharing
- `playlists` - Playlist metadata
- `playlist_videos` - Many-to-many: playlists ↔ videos
- `comments` - Nested comments
- `reactions` - Video/playlist reactions
- `orders` → `payments` → `payment_transactions` - Payment flow
- `entitlements` - Access control (who owns what)
- `sessions` - Session management

## ERD

## Security

- Input validation with class-validator
- CORS configured
- Helmet for security headers
- Rate limiting via Nginx
- HMAC verification for payment webhooks
- Pre-signed URLs with expiration
- Password hashing with bcrypt
- Session tokens in Redis

## Monitoring & Logging
- Structured logging with Winston
- Error tracking with Sentry
- Performance monitoring
- Global error handling

## Contributing

This is a portfolio project, but if you want to ontribute, please follow this structure : )

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat(scope): Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Author

**Your Name**
- GitHub: [@ahmedali64](https://github.com/Ahmedali64/Tobi.git)
- LinkedIn: [Ahmed Ali](https://github.com/Ahmedali64)
- Email: ahmedaliesmail01@gmail.com

---


# <p align="center" >Thank you so much for making it this far : ) </p>

