# Overview

The goal of this module is to find common patterns between chat platforms and create an abstraction layer on top of them so you only have to write your chat UI code once and have it automagically propagate to the various distributed platforms.

Right now, Facebook Messenger and Google Assistant are supported, but others are planned in the future.

This is meant to be used in conjunction with with the [common-chatbot-starter-project](https://github.com/ianrichard/common-chatbot-starter-project), which integrates with [Dialogflow](https://dialogflow.com/).

## Status

| Feature            | Facebook Messenger | Google Assistant | Text / Audio Fallback |
| ------------------ | ------------------ | ---------------- | --------------------- |
| Plain Text         | ✔                  | ✔                | ✔                     |
| Quick responses    | ✔                  | ✔                | ✔                     |
| Image              | ✔                  | ✔                | ✔                     |
| Card               | ✔                  | ✔                | ✔                     |
| List               | ✔                  | ✔                | ✔                     |
| Carousel           | ✔                  | ✔                | ✔                     |
| Webview / Video    | ✔                  | ✔                | Gets ignored          |

# Components

![Sample components](media/common-chatbot-components.jpg)

# Usage

This is what you would create in your application and return it to the `getResponseObjectForDialogflow` method from these utils.  The keys in this object map back to the action from Dialogflow.  See the related [common-chatbot-starter-project](https://github.com/ianrichard/common-chatbot-starter-project) for more detailed usage and [sample JSON](https://github.com/ianrichard/common-chatbot-starter-project/blob/master/src/responses/index.js).

```javascript
getResponseObjectForDialogflow({
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

Outside of some simple "Hello, world" or non-conditional flows, you'll need to use webhooks with a conversational intent handling platform such as Dialogflow.  

The problem is that you then have to format the response JSON for each of the respective distributed platforms (i.e. Facebook Messenger / Google Assistant).  Even in the Dialogflow Firebase editor view, you can see how they utilize Google's abstraction library for Assistant which magically creates JSON you don't see, then have manual formatting for other platforms.  So the usage is inconsistent.  It could be tweaked on there to do something like the goal of this project and I get why they left the boilerplate simple.  So not really a knock on Dialogflow, this is just an extension.

When integrating with Dialogflow, you can create responses using their GUI.  But these require repeated content for each platform and there can't be anything conditional unless you use their online Firebase editor, which can be more difficult for development than a fully-blown scalable local workspace with realtime service updates during development.  Admittedly, I haven't used their online Firebase integration (it wasn't available when I started making this), so take my comments with a grain of salt.

Take the following example for supporting default text / voice, Facebook Messenger and Google Assistant.  A lot, huh?  Not a good idea to keep repeating. Note - This module responds with data for the invoking framework on demand (i.e. won't send Google data when the request is from Facebook), but this is to illustrate the various types of responses that can exist.  Note the various formats specific to the platform.

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
This simple example may not seem like a big deal, but when you get into cards, lists, carousels, etc., it can become pretty hard to manage.

# Roadmap

If anyone wants to contribute, by all means :)

- User profile retrieval utilities (started, but not finished or documented)
- Unit tests
- Exception handling
- Warning logs
- Docs on optional stuff
- Separate platform-specific components.  "common" at that point would mean that the way of easily consuming components is common

# How to Contribute

Want to help?  Fantastic!

- See instructions on the [common-chatbot-starter-project](https://github.com/ianrichard/common-chatbot-starter-project)