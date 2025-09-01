# 目安箱 (Suggestion Box)

**目安箱** is an anonymous employee feedback forum.  
It allows team members to freely suggest improvements, discuss ideas, and react to each other’s thoughts — all while staying anonymous.

## ✨ Features

- 📝 **Anonymous threads** — any user can create a post without revealing identity.
- 👍👎 **Likes & dislikes** — posts and comments can be rated by the community.
- 💬 **Infinite threading** — users can comment on posts or reply to other comments, creating nested discussions.
- 🤖 **Optional AI moderation** — when enabled, OpenAI moderates content to keep discussions safe.
- 🔒 **Optional authentication** — can be secured with OIDC if desired.

## 🛠️ Configuration

The app behavior is controlled with environment variables:

| Variable                  | Description                                                                                 |
| ------------------------- | ------------------------------------------------------------------------------------------- |
| `DATABASE_URL`            | PostgreSQL connection string for app storage.                                               |
| `OPENAI_API_KEY`          | (Optional) If provided, AI moderation is enabled. Uses the model defined in `OPENAI_MODEL`. |
| `OPENAI_MODEL`            | (Optional) Which OpenAI model to use for moderation (e.g. `omni-moderation-latest`).        |
| `MODERATION_INSTRUCTIONS` | (Optional) Custom moderation instructions when AI moderation is active.                     |
| `PROXY_URL`               | (Optional) Proxy URL for outgoing requests (e.g. when behind a corporate proxy).            |
| `OIDC_AUTHORITY`          | (Optional) OIDC authority URL for enabling authentication.                                  |
| `OIDC_IDENTIFIER`         | (Optional) OIDC client identifier for authentication.                                       |

## 🧩 Moderation (Optional)

- If `OPENAI_API_KEY` is set, content is automatically sent to OpenAI’s moderation API.
- Custom rules can be added via `MODERATION_INSTRUCTIONS`.
- If no API key is set, moderation is disabled and all content is accepted.

## 🔐 Authentication (Optional)

If you want to require login via OIDC:

```env
OIDC_AUTHORITY=https://your-oidc-provider.com
OIDC_IDENTIFIER=your-client-id
```

This will enforce authenticated access.
