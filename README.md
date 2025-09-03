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

| Variable                  | Description                                                                      | Default            |
| ------------------------- | -------------------------------------------------------------------------------- | ------------------ |
| `DATABASE_URL`            | PostgreSQL connection string for app storage.                                    |                    |
| `OPENAI_API_KEY`          | (Optional) If provided, AI moderation is enabled.                                |                    |
| `OPENAI_MODEL`            | (Optional) Which OpenAI model to use for moderation (e.g. `gpt-4o-mini`).        | gpt-4o-mini        |
| `MODERATION_INSTRUCTIONS` | (Optional) Custom moderation instructions when AI moderation is active.          | None               |
| `HTTPS_PROXY`             | (Optional) Proxy URL for outgoing requests (e.g. when behind a corporate proxy). |                    |
| `OIDC_AUTHORITY`          | (Optional) OIDC authority URL for enabling authentication.                       |                    |
| `OIDC_IDENTIFIER`         | (Optional) Name of the field in the OIDC user object to use as identifier.       | preferred_username |
| `INPUT_EXPLANATION`       | (Optional) Explanation to be displayed above the new item input field            |                    |

## 🧩 Moderation (Optional)

If you want to moderate the contents of the messages:

```env
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-4o-mini
MODERATION_INSTRUCTIONS=...
```

## 🔐 Authentication (Optional)

If you want to require login via OIDC:

```env
OIDC_AUTHORITY=https://your-oidc-provider.com
```

This will enforce authenticated access.
