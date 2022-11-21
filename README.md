# RU Social

The date is January 14, 2020. You've come up with a funny idea to make a dating app for your university (at the time, Ryerson University) while working out. It will be called RU Mine. You message your friends, tell them your idea, and a close friend of yours agrees to make it with you. You tell him, "If the domain is available, I will build it".


It was available.


Thus started the journey to make Ryerson's dating app, which permanently shifted the culture of the school and lead to the development of a social network that impacted thousands of Ryerson students. A story that involves fierce competition, crashing servers, DDoS attacks, sleepless nights, hundreds of thousands of lines of code, and countless stories of love and cheating. This is the story of RU Mine, Ryerson University's dating app turned social media icon.
<br/>
<br/>
## Table of Contents
1. Summary of the monorepo
2. Missing code from the monorepo
3. Understanding the code
4. Infrastructure
5. Takeaways
6. The Story of RU Mine
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

### Testing the waters

### Stickers

### Press

### Competition

### Marketing

### Cupid's Arrow, 2020 Valentine's Day Special

### Penguins at Work

### Meetups and Partnerships

### COVID-19

### Python Development

### The Switch to Java

### Mobile App Development

### App Store Approvals

### Night of the Release

### Putting Out Fires

### JVM Overload

### Smooth Sailing

### DDoS Attack

### Crashing Servers

### Version 2

### Merchandise

### RU Friends

### Groups and Group Chats

### Social Scoop

### Press (Again)

### RU Bot or Not, Valentine's Day 2021 Special

### The Final Line
