# Overview

The goal of this module is to find common patterns between chat platforms and create an abstraction layer on top of them so you only have to write your chat UI code once and have it automagically propagate to the various distributed platforms.

Right now, Facebook Messenger and Google Assistant are supported, but others are planned in the future.

## Status

| Feature            | Facebook Messenger | Google Assistant | Text / Audio Fallback |
| ------------------ | ------------------ | ---------------- | --------------------- |
| Plain Text         | ✔                  | ✔                | ✔                     |
| Quick responses    | ✔                  | ✔                | ✔                     |
| Image              | ✔                  | ✔                |                       |
| Card               | ✔                  | ✔                |                       |
| List               | ✔                  | ✔                |                       |
| Carousel           | ✔                  | ✔                |                       |
| Webview / Video    | ✔                  | ✔                |                       |

# Usage

This is what you would create in your application and return it to the `getResponseObjectForApiAi` method from these utils.  The keys in this object map back to the action from api.ai.  See the related [common-chatbot-ui-starter-project](https://github.com/ianrichard/common-chatbot-ui-starter-project) for more detailed usage and sample JSON.

```javascript
getResponseObjectForApiAi({
    welcome: () => {
        return [
            { type: 'text', message: 'How can I help?' },
            { type: 'simple-responses', values: ['Bonus', 'Raise', 'High Five'] }
        ];
    },
    ...
});
```

## Impetus

When integrating with API.AI, you can create responses using their GUI.  But these require repeated content for each platform and there can't be anything conditional.

To make dynamic applications, it is much more powerful to utilize webhooks.  The problem is that you then have to format the responses for each of the respective frameworks.  Take the following example for supporting default text / voice, Facebook Messenger and Google Assistant.  A lot, huh?  Not a good idea to keep repeating. Note - This module only responds with data for the invoking framework, but this is to illustrate the various types of responses that can exist.  Note the various formats specific to the platform.

```json
{
    "speech": "Heyo - so I’ve been staring at your profile pic…",
    "displayText": "Heyo - so I’ve been staring at your profile pic…",
    "data": {
        "facebook": [
            {
                "text": "Heyo Ian - so I’ve been staring at your profile pic…",
                "quick_replies": [
                    { "content_type": "text", "title": "And?", "payload": "And?" },
                    { "content_type": "text", "title": "Uhh… Okay…", "payload": "Uhh… Okay…" }
                ]
            }
        ],
        "google": {
            "rich_response": {
                "items": [
                    {
                        "simpleResponse": {
                            "textToSpeech": "Heyo Ian - so I’ve been staring at your profile pic…"
                        }
                    }
                ],
                "suggestions": [
                    { "title": "And?" },
                    { "title": "Uhh… Okay…" }
                ]
            }
        }
    }
}
```

# How to Contribute

Want to help?  Fantastic!

- Clone and `npm link` (or however you want to plumb it up) this repo to your project
- Do updates
- Pull request