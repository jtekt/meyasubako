# Feedback gathering system
A simple web app to gather feedback on certain topics.

## API

| Route | Method | Query / Body | Description |
| --- | --- | --- | --- |
| /items | GET | - | Get root items, a.k.a. topic |
| /items | POST | content | Create an item |
| /items/{ITEM ID} | GET | - | Get a specific item using its ID |
| /items/{ITEM ID} | DELETE | - | Delete an item |
| /items/{ITEM ID}/vote | POST | vote (-1 or 1) | Upvote or downvote an item |
| /items/{ITEM ID}/items | GET | - | Get items related to an item, a.k.a. comment  |

## Environment variables

| Variable | Description |
| --- | --- |
| MONGODB_URL | The URL of the MongoDB database to be used by the service, defaults to mongodb://mongo |
| MONGODB_DB | DB to be used by the service, defaults to feedback_gathering_system |
| APP_PORT | The port used by Express to listen to, defaults to 80 |

## Model

```javascript
{
  title: String,
  description: String,
}
```
