# RU Social: RU Mine and RU Friends
![logo_3](https://user-images.githubusercontent.com/40678238/202979724-11f499b1-873f-4285-a257-7a82e8ac7324.png)

The date is January 14, 2020. You've come up with a funny idea to make a dating app for your university (at the time, Ryerson University) while working out. It will be called RU Mine (get it?). You message your friends, tell them your idea, and a close friend of yours agrees to make it with you. You tell him, "If the domain is available, I will build it".


It was available.


Thus started the journey to make Ryerson's dating app, which permanently shifted the culture of the school and lead to the development of a social network that impacted thousands of Ryerson students. A story that involves fierce competition, crashing servers, DDoS attacks, sleepless nights, hundreds of thousands of lines of code, and countless stories of love and cheating. This is the story of RU Mine, Ryerson University's dating app turned social media icon.
<br/>
<br/>
## Table of Contents
1. <a href="#1-summary-of-the-monorepo">Summary of the monorepo</a>
2. <a href="#2-missing-code-from-the-monorepo">Missing code from the monorepo</a>
3. <a href="#3-understanding-the-code">Understanding the code</a>
4. <a href="#4-infrastructure">Infrastructure</a>
5. <a href="#5-takeaways">Takeaways</a>
6. <a href="#6-the-story-of-ru-mine">The Story of RU Mine</a>
<br/>

## 1. Summary of the monorepo
The following is a brief summary of the technologies behind each of the individual repos within this large monorepo. The stories associated with each can be found in section 6.
<br/><br/>
### rumine-web
This is the main web directory of the RU Mine website. In this repo is the frontpage, retired frontpage, image render script, managament APIs, the Valentine's Day app, user account management, compression shell scripts, and various other PHP scripts.

<b>Technologies:</b> <i>PHP, HTML, CSS, JavaScript, React, React-Native, BASH, and SQL.</i>
<br/><br/>
### rumine-cupids-arrow-2020
This is RU Mine's first Valentine's Day special, Cupid's Arrow. Cupid's Arrow was a matchmaking service that matched students using a small questionnaire.

<b>Technologies:</b> <i>PHP, React-Native, React, SQL.</i>
<br/><br/>
### rumine-php-backend
These are various PHP scripts used to facilitate aspects of the backend. It includes an admin page to render metrics obtained from the analytics service, the newer image render script, one-off APIs for Spotify and FindMyGroupChats, and a JWT token manager.

<b>Technologies:</b> <i>PHP, HTML, CSS, JS, SQL.</i>
<br/><br/>
### rusocial-java-backend
This is the main backend for RU Mine and RU Friends. The RU Mine backend was originally developed in less than 4 days, and expanded over the course of 2 years to improve performance and integrate new features.

<b>Technologies:</b> <i>Spring-Boot, Java, PostgreSQL, SQL, Neo4J, Cypher Querying Language, Apache Kafka, Snowball Stemmer, Firebase Notifications, APNS, JWTs.</i>
<br/><br/>
### rusocial-frontend
This is the mobile app for RU Mine and RU Friends. The RU Mine frontend was originally developed in less than 6 days, and expanded over the course of 2 years with updates, bug patches, performance improvements, and eventually RU Friends and Group Chats.

<b>Technologies:</b> <i>React-Native, JS, Objective-C, Swift, Java, Kotlin.</i>
<br/><br/>
### rumine-frontend-extra-dependencies
These are modified dependency files created to overwrite select node module files. They improved aspects like chatting, allowed for reactions, prevented crashes on Android, and made the platform more cohesive and performant.

<b>Technologies:</b> <i>React-Native, JS.</i>
<br/><br/>
### rumine-ru-bot-or-not-setup-2021
This is the setup repo for RU Bot or Not, RU Mine's 2021 Valentine's Day special. This collected responses to a set of questions that would be later used in conjunction with LLM generated responses for the final game.

<b>Technologies:</b> <i>React-Native, React, JS, PHP, SQL.</i>
<br/><br/>
### rumine-ru-bot-or-not-end-2021
This is the final game repo for RU Bot or Not, RU Mine's 2021 Valentine's Day special. It made use of pre-generated LLM outputs mixed in with legitimate human responses to allow participating students to try to guess which text-chatter was a human, and which were bots. Winners received the Instagram handle of the human.

<b>Technologies:</b> <i>React-Native, React, JS, PHP, SQL, OpenAI's GPT-2.</i>
<br/><br/>

### rumine-analytics
This was an analytics service spun up in a night to calculate important service metrics to evaluate the health of the platform.

<b>Technologies:</b> <i>Spring-Boot, Java, PostgreSQL, SQL, Neo4J, Cypher Querying Language.</i>
<br/><br/>
### rumine-artwork-contest
This was a Halloween special event to collect artwork from our community.

<b>Technologies:</b> <i>React, React-Native, JS, PHP, SQL.</i>
<br/><br/><br/>
## 2. Missing code from the monorepo
The following are repos containing code associated with RU Social that was not included in this monorepo. Technologies used are included below.
<br/><br/>
### rumine-cupids-arrow-matcher-2020
This was a series of Python scripts used to execute matrix multiplication across our weighting matrices and student responses. The output of these scripts was used as the matches for Cupid's Arrow.

<b>Technologies:</b> <i>Python, NumPy, PostgreSQL, SQL.</i>
<br/><br/>
### rumine-test-profile-generator
This was a PHP script used to create test profiles for Cupid's Arrow and later modified to generate test profiles for the initial version of the app.

<b>Technologies:</b> <i>PHP, SQL.</i>
<br/><br/>
### findmygroupchats
This was a website created in the height of the COVID-19 pandemic to help students find peers in their classes. It had a search bar and let you quickly find the group chats in RU Friends associated with your course.

<b>Technologies:</b> <i>PHP, HTML, CSS, JS, SQL.</i>
<br/><br/>
### rumine-shop
This was our merchandise shop that sold baseball caps, touques (beanies for my American friends), "autographs" from our mascot Pippy, condoms, and "shares' in our company.

<b>Technologies:</b> <i>PHP, HTML, CSS, JS, SQL, Shopify.</i>
<br/><br/>
### rumine-admin-panel
This was a simple HTML webpage that called upon private endpoints to fetch reports, blocks, and other metrics.

<b>Technologies:</b> <i>HTML, CSS, JS.</i>
<br/><br/>
### rumine-django-backend
This was the original backend developed in Python using Django. It was scrapped after a few days for it's poor support for PostgreSQL. It was swapped out for the Spring-Boot backend.

<b>Technologies:</b> <i>Django, Python, PostgreSQL, SQL.</i>
<br/><br/>
### rumine-bash-scripts
These are various BASH scripts used to handle infrastructure like load balancing and starting/stopping JVM processes.

<b>Technologies:</b> <i>BASH.</i>
<br/><br/>
### rumine-apache-http-webserver-configurations
These are the Apache HTTP Webserver configuration files for RU Mine.

<b>Technologies:</b> <i>Apache HTTP Webserver.</i>
<br/><br/>
### social-scoop
This was a publication that was spun up as a derivative project of RU Mine. It featured articles weekly and a podcast bi-weekly.

<b>Technologies:</b> <i>HTML, CSS, JS, RSS.</i>
<br/><br/><br/>
## 3. Understanding the code
It is important to understand that this code was written over the course of 2 years in speed bursts to add new features, fix performance bugs, and hit deadlines our community expected. There are aspects of the code that is hastily written, and if you look close enough you can see a pattern emerge of slowly improving code as time went on.

Initial files involved with RU Mine are written far worse than files involved with RU Friends. There are lots of commented out code in RU Friends where performance improvements were made (most notably is making notifications asynchronous from the REST API call causing it). A lot of these improvements are a function of more time being spent working with Spring-Boot, with which I had no prior experience. Some are just that <i>fuck it, ship it</i> attitude.

Please read my takeaways to see how I think this code holds up today (Spoiler: there's a lot of things I would improve).
<br/><br/>
## 4. Infrastructure
The infrastructure I designed for RU Mine progressively grew more complex, but in doing so fixed many pain points involved with the app. Below are the three stages of infrastructure and architectures that existed in RU Mine's history.
<br/><br/>
### Initial
<b>Machine:</b> <i>Running on a bare metal FreeBSD 11.1 server using 4 shingled magnetic recording (SMR) drives in RAIDz2.</i>

<b>Technologies:</b> <i>ZFS, Apache HTTP Webserver, JVM running Spring-Boot code, vanilla PHP scripts, compression shell scripts, and PostgreSQL.</i>

<b>Services:</b> <i>RU Mine web directory, Cupid's Arrow, first iterations of the RU Social Java backend and RU Social mobile app.</i>
<br/><br/>
### Version 2
<b>Machine:</b> <i>Running on a bare metal FreeBSD 12.1 server using 4 perpendicular magnetic recording (PMR) drives in RAIDz2.</i>

<b>Technologies:</b> <i>ZFS, Apache HTTP Webserver, JVM running Spring-Boot code, vanilla PHP scripts, ImageMagick, PostgreSQL.</i>

<b>Services:</b> <i>RU Mine web directory, second iterations of the RU Social Java backend and RU Social mobile app (pre-RU Friends and groups), RU Mine shop.</i>
<br/><br/>
### Final
<b>Machines:</b> <i>Running on a bare metal FreeBSD 12.1 server using 4 perpendicular magnetic recording (PMR) drives in RAIDz2, high availability proxy to off-site backup server.</i>

<b>Technologies:</b> <i>ZFS, rsync, Apache HTTP Webserver, JVM running Spring-Boot code, vanilla PHP scripts, ImageMagick, PostgreSQL, Neo4J, Apache Kafka, HA-Proxy, etc.d, PGSQL replication, Neo4J replication.</i>

<b>Services:</b> <i>RU Mine web directory, final interations of RU Social Java backend and RU Social mobile app, RU Mine Analytics, RU Bot or Not, Artwork contest, Social Scoop, Admin dashboards, RU Mine shop, FindMyGroupChats.</i>

<br/><br/>
## 5. Takeaways
There are a few key takeaways from this code. First off, this is a very crude and old representation of how I code. This started off as a 10-day sprint to get a working application, frontend and backend, to production. There is a lot a very messy code, especially near the beginning of the backend's journey (RU Mine v1). It's terribly disorganized, and for some reason I was manually creating the JSON for responses. Ridiculous. That's what a mad dash to get something done in a framework you have no experience in will do to you.

Since this I have worked on probably about 25 other Spring-Boot applications. Needless to say my code is a lot more organized and performant; but even despite that, I still find myself regularly coming back to this "golden holy bible" of code. It has proven to be invaluable in my life and I am incredibly thankful it's in my repertoire, even with it's flaws.

Second off, a lot of the code I wrote for the frontends was hastily thrown together (see a pattern?). A lot of performance improvements can be made by just reducing the reptition of code, but when you're on a clock it just has to get done. And it did. Many, many times.

Third, you can always improve your architecture later. Just keep improving it as you need to, the tech debt can be surprisingly easy to get rid of in many cases if you're willing to work at it. Adding major architecture changes can really speed up the platform.

Finally, and this has probably been alluded too throughout this document; Sometimes you just have to ship it. Just get it out there. Refactor it later, if it matters, but just get it out there. The lessons I learned just by getting my code out there and into the hands of thousands of users is absolutely invaluable, and has helped me write code for other projects used by hundreds of thousands, sometimes even millions. Just get your code out there. 
<br/><br/>
<i>Fuck it, ship it.</i>
<br/><br/>
Oh, and, never ever use shingled magnetic recording drives in a server and expect to survive a DDoS attack. It will not work out!
<br/><br/>
## 6. The Story of RU Mine

### The Idea
It's true; I really came up with the idea for RU Mine while working out. I _really did_ tell my friends and agreed to build it, alongside one of my close friends, on the condition that the domain was available. We decided that it would be a dating app made specifically for Ryerson Students, and we would verify their school in the age-old way, using their student email address.

We quickly mapped out some features we wanted this app to have; all-inclusivity, missed connections, mutual courses, private and encrypted private messages. We threw all of these features onto an HTML template and put it up on the internet. Now it was time to see what Ryerson felt about it.
<br/><br/>

### Testing the waters
It was January 17th, the day we decided to launch the site to the Ryerson community through a few Ryerson Instagram pages. Around 12:20pm, the pages that agreed to spread the word fired out our posts. "RU Mine, dating app for Ryerson Students, coming March 2020". The description instructed students that were interested in the platform to visit the link in their bio to sign-up for the waitlist.

This waitlist acted as a great metric to understand if anyone would even download this app. With around 900 waitlist signups by the end of the week and a lot of buzz on Instagram, we decided to go ahead with the plan.
<br/>
<div align="center">
  <img src="https://user-images.githubusercontent.com/40678238/202980358-08cbfdb8-bf1f-4bfa-885e-1f2871c381a2.png" height=300 />
</div>
<br/><br/>

### Stickers
Now we needed to spread the word about RU Mine beyond Instagram. My friend came up with the great idea to plaster stickers around campus with our logo, a small message, and a URL to our site. We bought sticker paper online, printed our stickers at home, cut them in the school's printshop, and began to plaster them around campus one night.

We spent hours running around campus slapping stickers onto anything and everything. Extra attention was given to covering Bumble stickers :) We gave piles of stickers to friends and asked them to plaster them around campus. We finally finished our stack of a few hundred stickers around 9pm, celebrated in the campus bar, and prepared the post for the next morning.

That next morning we posted a call out; "If you take a photo of our stickers and post it, you will be entered into a contest to win movie tickets". Our followers went out and found stickers all around campus, and posted pictures for that entire week. Students that had no idea what "RU Mine" was and why there were stickers everywhere were even intrigued enough to follow.

_Success._

<p align="center" float="left">
  <img src="https://user-images.githubusercontent.com/40678238/202981041-3be34a66-b3bd-4711-9ad6-effeaf028c1b.png" height=250 />
  <img src="https://user-images.githubusercontent.com/40678238/202981078-4be12bba-575d-42b4-9444-3524b665b77f.png" height=250 />
  <img src="https://user-images.githubusercontent.com/40678238/202981052-2b24d82e-bb06-4ba5-b3b2-231a7c19c9d2.png" height=250 />
  <img src="https://user-images.githubusercontent.com/40678238/202981069-e886154c-f5c0-4622-af20-65d9e71d17ea.png" height=250 />
</p>
<br/><br/>

### Press
Around this time, we were contacted by a few student newspapers that wanted to know who we were and what in the world RU Mine was. We accepted and did our first interview the day after our sticker extravaganza. It went to print and was posted online on January 22nd. We discussed our progress, our plans, explained who we were, and why Ryerson should be excited about it.

We were also approached by a larger student news outlets, which interviewed us a few days after our initial student-news debut. That student journalist asked us some good questions about our algorithm, how we plan to diversify ourselves from the likes of Tinder and Bumble, what students can expect, and if we had ever heard of an Instagram page that was planning to do a similar match-making thing.

We hadn't.
<br/><br/>

### Competition
We got back to our desks at the library and quickly tried to figure out what this Instagram match-making page was. It was *planning* (key word is _planning_) to do a "missed connections" type of thing over Instagram posts. They were already making some bold statements that we had somehow copied their idea. Crazy, but expected.

We did what any sane business people would do. We purchased domains that were similar to ours and fit the niche we were targeting, made it clear that we were separate, and continued on our way.

The compeition was not a fan of that. They approached the reporter from the second news outlet and explained to the reporter that we had infringed on their idea, and we were stealing the audience they had grown (an audience size in which we had eclipsed a week prior). The reporter asked us for comment, to which we told the reporter that this is just business, and the other page had not started yet, so how could we possibly copy them?

That article never ended up being printed unfortunately. It would've helped us at the time, but we continued on.

_That's it from the compeition, right?_

Of course not. In retaliation to us, they had purchased domains similar to ours, started an online presence and vowed to create an app "better than RU Mine" (which had not existed yet). As with any and all copycats, it fizzled into oblivian and was forgotten about.
<br/><br/>

### Marketing
<div align="center">
  <img src="https://user-images.githubusercontent.com/40678238/202980670-3429c3da-95ac-47dd-8858-9179b50c8ea1.png" height=300 />
</div>

### Cupid's Arrow, 2020 Valentine's Day Special
<div align="center">
  <img src="https://user-images.githubusercontent.com/40678238/202980449-2a333b06-23cb-4bc5-8ea3-edaeced247ef.png" height=300 />
</div>

### Penguins at Work

### Meetups and Partnerships

### COVID-19

### Python Development

### The Switch to Java

### Mobile App Development

### App Store Approvals

### Night of the Release

<p align="center" float="left">
  <img src="https://user-images.githubusercontent.com/40678238/202981354-6c18b045-09b4-47db-94f5-e58657e06174.png" height=300 />
  <img src="https://user-images.githubusercontent.com/40678238/202981475-f25c614c-e087-4b6c-bee5-079687e45c01.png" height=300 />
</p>

### Putting Out Fires

### JVM Overload

### Smooth Sailing and Milestones
<div align="center">
  <img src="https://user-images.githubusercontent.com/40678238/202981851-773d3dfb-251e-4c11-a5a5-4f53fe0600a7.png" height=300 />
</div>

### DDoS Attack

### Crashing Servers

### Version 2
<p float="left" align="center">
  <img src="https://user-images.githubusercontent.com/40678238/202982414-f4671991-237e-4e22-a12e-be05dfe85da6.jpg" height=300 />
  <img src="https://user-images.githubusercontent.com/40678238/202982427-6ebde867-1035-4e2f-8b2f-054cbcba2fd6.jpg" height=300 />
  <img src="https://user-images.githubusercontent.com/40678238/202982434-91afbba9-abda-49d0-b05c-daa7bfc39e1d.jpg" height=300 />
  <img src="https://user-images.githubusercontent.com/40678238/202982445-465fe2d0-4a62-4e1d-887c-9e02783d0b97.jpg" height=300 />
  <img src="https://user-images.githubusercontent.com/40678238/202982462-7158f9c3-d1d6-4095-b6aa-2cab46e2de91.jpg" height=300 />
  <img src="https://user-images.githubusercontent.com/40678238/202982472-0a5cecd2-d162-48d8-8d2b-39397abb6e46.jpg" height=300 />
</p>

### Merchandise
<div align="center">
  <img src="https://user-images.githubusercontent.com/40678238/202982647-a8520ed1-6218-4d76-ad22-360d22f1deb3.jpg" height=300 />
</div>

### RU Friends
<p float="left" align="center">
  <img src="https://user-images.githubusercontent.com/40678238/202982738-beab2be8-6577-4535-a211-4a0d3dad2a17.jpg" height=300 />
  <img src="https://user-images.githubusercontent.com/40678238/202982824-66687554-a6d4-47af-aec5-bdbdc89711d4.jpg" height=300 />
</p>


### Groups and Group Chats
<div align="center">
  <img src="https://user-images.githubusercontent.com/40678238/202983029-54feed40-9f10-4fe2-8960-ba45dbaac2d7.jpg" height=300 />
</div>

### Social Scoop
<div align="center">
  <img src="https://user-images.githubusercontent.com/40678238/202983504-be659b04-86fc-49fb-95fb-a49884fed3b0.jpg" height=300 />
</div>

### Press (Again)

### RU Bot or Not, Valentine's Day 2021 Special
<p float="left" align="center">
  <img src="https://user-images.githubusercontent.com/40678238/202983106-40f8901a-13ae-40ea-bfb5-e7120cf19434.jpg" height=300 />
  <img src="https://user-images.githubusercontent.com/40678238/202983336-4dc6c3cf-84e9-4992-9094-82cbf838f239.jpg" height=300 />
  <img src="https://user-images.githubusercontent.com/40678238/202983117-8007eccc-a3c1-4b8e-a7e0-0ca9e5c7008f.jpg" height=300 />
</p>

### The Final Line
<div align="center">
<img src="https://user-images.githubusercontent.com/40678238/202983636-d6b62c3b-4a3e-453f-8b56-3323841eb2e0.jpg" height=300 />
</div>
