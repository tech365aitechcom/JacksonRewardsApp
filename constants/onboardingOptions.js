export const AGE_OPTIONS = [
  { label: 'Under 18', value: 'Under 18' },
  { label: '18-24', value: '18-24' },
  { label: '25-34', value: '25-34' },
  { label: '35-44', value: '35-44' },
  { label: '45+', value: '45+' },
]

export const GENDER_OPTIONS = [
  { label: 'Male', value: 'male' },
  { label: 'Female', value: 'female' },
  { label: 'Non-binary', value: 'non-binary' },
  { label: 'Other', value: 'other' },
]

export const GAME_OPTIONS = [
  { label: 'Puzzle & Brain', value: 'puzzle_brain' },
  { label: 'Strategy', value: 'strategy' },
  { label: 'Arcade', value: 'arcade' },
  { label: 'Simulation', value: 'simulation' },
  { label: 'Card & Casino', value: 'card_casino' },
  { label: 'Sports & Racing', value: 'sports_racing' },
  { label: 'Word & Trivia', value: 'word_trivia' },
  { label: 'Role Playing / Adventure', value: 'role_playing_adventure' },
]

export const GAME_STYLE_OPTIONS = [
  {
    label: 'Quick & casual',
    description: 'fast games with smaller rewards',
    value: 'quick_casual',
  },
  {
    label: 'Medium sessions',
    description: 'a bit of challenge, balanced rewards',
    value: 'medium_sessions',
  },
  {
    label: 'Deeper & strategic',
    description: 'longer games with higher rewards',
    value: 'deeper_strategic',
  },
]

export const GAME_HABIT_OPTIONS = [
  {
    label:
      'I’ve played reward-based games before and usually play in the evenings',
    value: 'evening_reward_gamer',
  },
  {
    label: 'I’m new to reward games, but I play casually during breaks',
    value: 'casual_break_gamer',
  },
  {
    label: 'I’ve tried reward apps but never got paid — I play at night mostly',
    value: 'night_reward_fail_gamer',
  },
  {
    label: 'I just play for fun, no rewards — anytime I’m bored',
    value: 'fun_anytime_gamer',
  },
  {
    label: 'I’m a daily gamer looking for high rewards',
    value: 'daily_high_reward_gamer',
  },
]
