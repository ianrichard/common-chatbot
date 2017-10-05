# Usage

This is what you would create in your application and return it to the `getResponseObjectForApiAi` method from these utils.  The keys in this object map back to the action from api.ai.  See [the related api.ai webhook starter project](https://github.com/ianrichard/api-ai-webhook-starter) for more detailed usage and how to get the user profile.

```javascript
getResponseObjectForApiAi({
    welcome: () => {
        return [
            { text: `Hey ${userProfile.firstName} - How’s it going?` },
            { simpleResponses: ['Good', 'Bad'] }
        ];
    },
    sentiment: () => {
        let response = [
            { text: 'Woohoo!' },
            { image: 'party.gif', accessibilityText: 'People dancing.' }
        ];
        if (resolvedQueryContains('bad')) {
            response = [
                { text: 'Bummer :( Perhaps a fun GIF will make you feel better!' },
                { image: 'puppies.gif', accessibilityText: 'Cute puppies playing.' }
            ];
        }
        return response;
    }
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

## The Solution

Write simple JSON once and have this utility map it to each of the various system formats.  The following is a sample of what you'd write to acheive the code above.

```js
welcome: () => {
    return [
        { text: `Heyo ${firstName}- so I’ve been staring at your profile pic…` },
        { simpleResponses: ['And?', 'Uhh… Okay…'] }
    ];
}
```

# How to Run

See the [api.ai webhook starter project](https://github.com/ianrichard/api-ai-webhook-starter) for info.

# How to Contribute

Want to help?  Fantastic!

- Clone and `npm link` (or however you want to plumb it up) this repo to your project
- Do updates
- Pull request

# Roadmap

### Platforms

Checked platforms are "done" only for the capabilities listed below.

- API.AI Web Demo ✔
- Facebook Messenger ✔
- Google Assistant ✔
- Alexa
- Cortana
- Twitter

### Capabilities

These are for the checked platforms above. Fallbacks exist for the following if the behavior is not available.  Example - API.AI web demo doesn't have a user profile or voice appends simple responses because there's nothing to select.

- User profile ✔
- Plain text ✔
- Images ✔
- Suggestions / simple responses ✔
- Configurable fallbacks (such as saying or not saying available responses in voice)
- Card
- List
- Carousel
- Webview
- Video