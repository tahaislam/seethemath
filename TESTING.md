# Closed testing (Google Play requirement)

New **personal** Google Play developer accounts must run a **closed test with
at least 12 testers, opted in continuously for 14 days**, before applying for
Production access. Family/friends are perfect for this. This doc has the setup
steps and a ready-to-send invite.

## Part A — Set up the closed test in Play Console (one-time)

1. **Testing → Closed testing → Create track** (or use the default "Alpha" closed track).
2. Upload the **`.aab`** to that track and roll it out.
   - Build one with: **Actions → "Android APK (EAS)" → Run workflow → profile `production`**, then download the `.aab` from the run summary.
3. **Testers tab → add tester emails** — the Gmail addresses your testers use on their
   Android phones (paste a list or attach a Google Group). You need **12+**.
4. Copy the **"Join on the web" opt-in URL** — that's the link you send testers.
5. Note your start date: the **14-day clock** needs all 12+ opted in and staying in
   continuously. Only then can you apply for Production.

**Tips**
- Line up **more than 12** (aim for ~15) in case someone forgets.
- Confirm each person actually installed — Google counts opted-in testers, so
  no-shows can stall the clock.

## Part B — Invite to send testers (copy-paste)

> **Subject: Help me test my math app (2 mins to set up) 🙏**
>
> Hi! I built an Android app — **SeeTheMath**, visual math lessons for grades 6–9 —
> and Google needs a small group of testers before I can publish it. Would love your
> help. Takes 2 minutes:
>
> 1. **Reply with the Gmail address you use on your Android phone** (it must be the one
>    signed into the Play Store on your phone).
> 2. I'll send you a link — tap it, then tap **"Become a tester."**
> 3. Then tap **"Download it on Google Play,"** and install **SeeTheMath** like any normal app.
> 4. **Please keep it installed for the next 2 weeks**, and open it a few times to have a
>    look (try tapping a topic and the "Try It Yourself" mode!).
> 5. One important thing: **please don't leave the test** during those 2 weeks — Google
>    needs everyone to stay in continuously. After that you can keep it or remove it. 🙂
>
> Thank you so much — this genuinely won't work without you!

## After the 14 days

Once you've had 12+ testers opted in for 14 continuous days, Play Console will let you
**apply for Production access**. Fill that in, then promote the release from Closed
testing → Production and submit for review.

See also: `PLAYSTORE.md` (full publishing guide) and `STORE_LISTING.md` (listing copy + assets).
