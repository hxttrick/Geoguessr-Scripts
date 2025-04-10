# GeoGuessr Stats OBS Script

<img src="https://i.imgur.com/EQB4I6t.png" alt="Example picture">

### User ID
- Enter the user ID of the profile whose stats you want to fetch.
  <br>
  You can easily find this when searching for a user as your browser URL will look a little something like https://www.geoguessr.com/user/5d4d5d831d34a0315c277ad7. To get your own ID, scroll down to the bottom of your profile page.

### Data Path
- Enter the path of the data you want to retrieve separated by periods `.`.
  <br>
  Please refer to [the example below](#api-example) for examples.

### Update Interval
- Enter the interval, in seconds, between each update.
  <br>
  Keep in mind not to make unnecessary requests the GeoGuessr API by using higher intervals.
  I recommend using, at minimum, 30 second intervals.

### Text Source
- Enter the text source you want to update.
  <br>
  Keep in mind this will completely overwrite any current text content so I recommend creating a new separate source.

<br>

## API Example

The script fetches all stats from the Geoguessr stats API.
<br>
You can see how a typical API response looks like below.
<br>
<br>
Some example `Data Path` values include:
- Retrieve amount of games played: `gamesPlayed`
- Retrieve average guess distance in km: `averageDistance.meters.amount`
- Retrieve highest country streak: `streakRecords.0.value.maxStreak`

```json5
// API RESPONSE:
{
  "gamesPlayed": 64968,
  "roundsPlayed": 324736,
  "maxGameScore": {
    "amount": "25000",
    "unit": "points",
    "percentage": 100
  },
  "averageGameScore": {
    "amount": "18127",
    "unit": "points",
    "percentage": 72.508
  },
  "maxRoundScore": {
    "amount": "5000",
    "unit": "points",
    "percentage": 100
  },
  "streakGamesPlayed": 616,
  "closestDistance": {
    "meters": {
      "amount": "0.2",
      "unit": "m"
    },
    "miles": {
      "amount": "0.3",
      "unit": "yd"
    }
  },
  "averageDistance": {
    "meters": {
      "amount": "732.5",
      "unit": "km"
    },
    "miles": {
      "amount": "455.1",
      "unit": "miles"
    }
  },
  "averageTime": "52.54661 s",
  "timedOutGuesses": 381,
  "battleRoyaleStats": [
    {
      "key": "Countries",
      "value": {
        "gamesPlayed": 289,
        "wins": 103,
        "averagePosition": 3.3460207
      }
    },
    {
      "key": "Distance",
      "value": {
        "gamesPlayed": 49,
        "wins": 10,
        "averagePosition": 3.7755103
      }
    }
  ],
  "dailyChallengeStreak": 7,
  "dailyChallengeCurrentStreak": 0,
  "dailyChallengesRolling7Days": [],
  "dailyChallengeMedal": 0,
  "streakMedals": [
    {
      "key": "CountryStreak",
      "value": 15
    },
    {
      "key": "UsStateStreak",
      "value": 0
    },
    {
      "key": "5dbaf08ed0d2a478444d2e8e",
      "value": 0
    },
    {
      "key": "62a44b22040f04bd36e8a914",
      "value": 30
    }
  ],
  "streakRecords": [
    {
      "key": "CountryStreak",
      "value": {
        "maxStreak": 23,
        "maxStreakDate": "2021-03-09T02:19:41.5160000Z"
      }
    },
    {
      "key": "UsStateStreak",
      "value": {
        "maxStreak": 2,
        "maxStreakDate": "2021-03-14T03:37:10.3140000Z"
      }
    },
    {
      "key": "5dbaf08ed0d2a478444d2e8e",
      "value": {
        "maxStreak": 3,
        "maxStreakDate": "2023-02-01T14:21:15.1570000Z"
      }
    },
    {
      "key": "62a44b22040f04bd36e8a914",
      "value": {
        "maxStreak": 49,
        "maxStreakDate": "2023-11-28T11:56:32.5210000Z"
      }
    }
  ]
}
```