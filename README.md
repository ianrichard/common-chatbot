# Overview

The goal of this module is to find common patterns between chat platforms and create an abstraction layer on top of them so you only have to write your chat UI code once and have it automagically propagate to the various distributed platforms.

Right now, Facebook Messenger and Google Assistant are supported, but others are planned in the future.

This is meant to be used in conjunction with with the [common-chatbot-starter-project](https://github.com/ianrichard/common-chatbot-starter-project).

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

This is what you would create in your application and return it to the `getDialogflowResponseObject` method from these utils.  The keys in this object map back to the response handler.  See the related [common-chatbot-starter-project](https://github.com/ianrichard/common-chatbot-starter-project) for more detailed usage and [sample JSON](https://github.com/ianrichard/common-chatbot-starter-project/blob/master/src/responses/index.js).

```javascript
export default {
    welcome: () => {
        return [
            { type: 'text', message: 'How can I help?' },
            { type: 'simple-responses', values: ['Bonus', 'Raise', 'High Five'] }
        ];
    },
    ...
});
```

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