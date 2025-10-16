🪶 Design tip

Keep it conversational.
Instead of dumping all 14 at once, use a stepper (like Typeform style):

“Hey {name}, let’s get to know your trading style — this takes under a minute.”

Show one or two questions per step. Add a progress bar (e.g., 20%, 40%, etc.)
🖼️ 2️⃣ The look and feel

Here’s what a Typeform-style onboarding typically looks like:

🧭 Full-screen view (not a tiny modal or box)

🎤 One question at a time
Each question fades in or slides in smoothly. The previous one fades out.

💬 Conversational tone
Example:

“Hey Elkanah 👋
What kind of trader are you?”
→ [Scalper] [Day Trader] [Swing Trader] [Investor]

📊 Progress indicator at the bottom or top
A smooth progress bar — “3 of 10” or a glowing gradient line moving right.

⌨️ Smart auto-advance
When you choose or type an answer, it automatically moves to the next question — no “Next” button spam.

✨ Subtle animations
Fade, slide, or scale transitions for smooth flow.

🎨 Modern gradients / minimal backgrounds
Something like:
linear-gradient(to right, #0ea5e9, #22d3ee, #06b6d4)
Or blurred glass effects behind text.

## Questionaire

SECTION 1: Trading Identity

How would you describe your trading experience?
→ Beginner, Intermediate, Advanced, Professional

What markets do you trade most often?
→ Forex, Stocks, Crypto, Indices, Commodities

Which platform(s) do you currently use to trade?
→ Free text or checkboxes like MetaTrader, TradingView, Binance, etc.

How long have you been trading?
→ Less than 6 months, 1–2 years, 3–5 years, 5+ years

🎯 SECTION 2: Goals and Motivation

What’s your main goal with this trading journal?
→ Track my performance, Improve discipline, Find my best setups, Stay consistent, Record ideas

How often do you plan to journal your trades?
→ Every trade, Daily, Weekly, Only on review days

Do you currently follow a trading strategy or system?
→ Yes, structured strategy, Still testing ideas, No, I trade intuitively

🧠 SECTION 3: Trading Mindset

Helps later with psychology insights or emotional tracking.

What’s your biggest struggle as a trader right now?
→ Patience, Overtrading, Risk management, Consistency, Fear of loss, Lack of clarity

How confident do you feel in your trading process? (1–10)
→ Slider input (number)

How do you usually feel after a losing trade?
→ Motivated to learn, Frustrated, Indifferent, I stop trading for a while

⚙️ SECTION 4: Personalization

Which currency pairs or assets do you trade most?
→ Free input (comma separated)

What kind of trader are you?
→ Scalper, Day trader, Swing trader, Position trader, Investor

Would you like to receive weekly performance summaries?
→ Yes / No

After the questions add a thank you message and a brief intro message of some sort leading them to enjoy the app.
This sould not just be raw text, some parts can be boldened, coloured, italised, placedholder images depending on what the message is to keep the user reading to the end
With this message:
"Welcome to ForexPencil — the journal built for traders who mean business.
Around here, we believe focus and precision beat hype and noise.
That’s why we’ve stripped everything down to what truly matters — tracking your trades, seeing your progress clearly, and helping you stay locked in on the goal: consistency and profit.

You won’t find flashy dashboards or distracting metrics here. Just clean data, honest insights, and tools that grow with you.

Our team’s already working on a few powerful additions — personalized chat support, direct connections to your trading platform, and our AI analyst, Graphite, built to help you sharpen your edge without losing focus.

Every click, every feature, every update — all built around one idea:
make trading simpler, smarter, and distraction-free.

Thanks for joining us early.
Now let’s build your edge — one focused trade at a time."

Continue to Dashboard

## THe idea

Each person who signs up already has an auth.uid.
That UID should be the key under which all user data lives in the Realtime DB.

When they answer the onboarding questions, you just write those answers to a child node such as /users/{uid}/onboarding.
This keeps the answers isolated, tidy, and linked to the right user.
Set this so that users will only answer this once after signup. If data already exists they dont answer this again.
