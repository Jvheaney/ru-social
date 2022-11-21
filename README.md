# RU Social

The date is January 14, 2020. You've come up with a funny idea to make a dating app for your university (at the time, Ryerson University) while working out. It will be called RU Mine. You message your friends, tell them your idea, and a close friend of yours agrees to make it with you. You tell him, "If the domain is available, I will build it".


It was available.


Thus started the journey to make Ryerson's dating app, which permanently shifted the culture of the school and lead to the development of a social network that impacted thousands of Ryerson students. A story that involves fierce competition, crashing servers, DDoS attacks, sleepless nights, hundreds of thousands of lines of code, and countless stories of love and cheating. This is the story of RU Mine, Ryerson University's dating app turned social media icon.

## Table of Contents
1. Summary of the monorepo
2. Missing code from the monorepo
3. Understanding the code
4. Infrastructure
5. Takeaways
6. The Story of RU Mine

## 1. Summary of the monorepo
The following is a brief summary of the technologies behind each of the individual repos within this large monorepo. The stories associated with each can be found in section 6.

### rumine-web
This is the main web directory of the RU Mine website. In this repo is the frontpage, retired frontpage, image render script, managament APIs, the Valentine's Day app, user account management, compression shell scripts, and various other PHP scripts.

Technologies used: PHP, HTML, CSS, JavaScript, React, React-Native, BASH, and SQL.

### rumine-cupids-arrow-2020
This is RU Mine's first Valentine's Day special, Cupid's Arrow. Cupid's Arrow was a matchmaking service that matched students using a small questionnaire.

Technologies: PHP, React-Native, React, SQL.

### rumine-php-backend
These are various PHP scripts used to facilitate aspects of the backend. It includes an admin page to render metrics obtained from the analytics service, the newer image render script, one-off APIs for Spotify and FindMyGroupChats, and a JWT token manager.

Technologies: PHP, HTML, CSS, JS, SQL.

### rusocial-java-backend
This is the main backend for RU Mine and RU Friends. The RU Mine backend was originally developed in less than 4 days, and expanded over the course of 2 years to improve performance and integrate new features.

Technologies: Spring-Boot, Java, PostgreSQL, SQL, Neo4J, Cypher Querying Language, Apache Kafka, Snowball Stemmer, Firebase Notifications, APNS, JWTs.

### rusocial-frontend
This is the mobile app for RU Mine and RU Friends. The RU Mine frontend was originally developed in less than 6 days, and expanded over the course of 2 years with updates, bug patches, performance improvements, and eventually RU Friends and Group Chats.

Technologies: React-Native, JS, Objective-C, Swift, Java, Kotlin.

### rumine-frontend-extra-dependencies
These are modified dependency files created to overwrite select node module files. They improved aspects like chatting, allowed for reactions, prevented crashes on Android, and made the platform more cohesive and performant.

Technologies: React-Native, JS.

### rumine-ru-bot-or-not-setup-2021
This is the setup repo for RU Bot or Not, RU Mine's 2021 Valentine's Day special. This collected responses to a set of questions that would be later used in conjunction with LLM generated responses for the final game.

Technologies used: React-Native, React, JS, PHP, SQL.

### rumine-ru-bot-or-not-end-2021
This is the final game repo for RU Bot or Not, RU Mine's 2021 Valentine's Day special. It made use of pre-generated LLM outputs mixed in with legitimate human responses to allow participating students to try to guess which text-chatter was a human, and which were bots. Winners received the Instagram handle of the human.

Technologies used: React-Native, React, JS, PHP, SQL, OpenAI's GPT-2.

### rumine-analytics
This was an analytics service spun up in a night to calculate important service metrics to evaluate the health of the platform.

Technologies: Spring-Boot, Java, PostgreSQL, SQL, Neo4J, Cypher Querying Language.

### rumine-artwork-contest
This was a Halloween special event to collect artwork from our community.

Technologies: React, React-Native, JS, PHP, SQL.


## 2. Missing code from the monorepo
The following are repos containing code associated with RU Social that was not included in this monorepo. Technologies used are included below.

### rumine-cupids-arrow-matcher-2020

### rumine-test-profile-generator

### findmygroupchats

### rumine-shop

### rumine-admin-panel

### rumine-django-backend

### rumine-bash-scripts

### rumine-apache-http-webserver-configurations

### social-scoop

## 3. Understanding the code

## 4. Infrastructure

### Initial

### Version 2

### Final

## 5. Takeaways

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

### Press

### RU Bot or Not, Valentine's Day 2021 Special

### The Final Line
