# Pomodoro Chrome Extension

## Functionality for final product

- Contains a pomodoro timer, where the user can control the duration of the timer or default to 25 minutes.
- At the end of the duration, the timer will stop and an sound will be made to notify the user.
- The user can enter various websites into a 'productivity blacklist'.
- While the pomodoro timer is active, the 'productivity blacklist' will disallow the user to access those websites.
- At the end of the duration OR when the user says that they are done with the pomodoro extension, the timer will end and the blacklisted websites will be accessibile again.

## TODO LIST

- [X] Get Extension Functionality working with a simple hello world
- [X] Create default styling
- [X] Get a persistent timer to work
- [X] Get audio to play from extension
- [X] Have audio play at the end of a timer
- [X] Have all this run from the background
- [X] Allow user to input custom timer
- [X] Allow user to input website url to blacklist
- [ ] Enable blacklist
- [ ] Disable blacklist
- [ ] Have blacklist work for a list of urls
- [ ] Be able to remove items from blacklist
- [ ] Have blacklist start on pomodoro start
- [ ] Have blacklist end on pomodoro timer end
- [ ] Have blacklist end when user prematurely ends it
- [X] Have blacklist persist through sessions

## CURRENT REASON FOR PAUSE

The google API is bad, and after spending 2 days trying to figure out first how to block websites with declarativeNetRequest, and then trying to redirect to google.com instead of the website, and with no answers in sight I am just going to go onto other stuff instead.
