---
layout: post
title: "IST Summer Internships (ISTSI) - an Internship Programme by and for Students"
description: ""
thumb_image: "istsi/istsi.org.png"
tags: [internships, student society]
---

**Update**: A full list of the minor changes since publishing can be seen [here](https://github.com/migueldemoura/migueldemoura.com/commits/master/_posts/2018-02-27-ist-summer-internships-istsi.md).

One of the most common critiques regarding engineering courses is that they aren't "practical enough". Four years after starting my studies I can see some substance to that statement. The curriculum nails the theoretical foundations, but pragmatic applications to the taught concepts are, at times, still lacking. This appears not to be a mere student sentiment, given some feedback I've received from HR managers regarding below-average performance in certain soft skills like communication and proactivity by fresh out of college engineers. My faculty, [Instituto Superior Técnico (IST)](https://tecnico.ulisboa.pt), attempts to address this issue by fostering an environment where student groups can create opportunities to advance these skills.

This setting allowed a fresh initiative to be born by some course-specific student societies in partnership with [TT@Técnico](https://tt.tecnico.ulisboa.pt) - the [IST Summer Internships](https://istsi.org), with the aim of filling this wildly perceived gap. With this programme, the students working at these societies would reach out to companies relevant to their field of study and attempt to compile a list of summer internship vacancies for their colleagues to apply.


## First Editions

A few years after its inception, I joined my course's student society, [NEECIST](https://neecist.org), close to the end of the second semester - the stage where the majority of the work is done for the ISTSI. At the time, we would receive candidate applications by email, parse and verify their contents and only then add everything to separate folders which would afterwards be zipped and sent to each individual company. A lot of work, and one inexcusable for engineering students.

Holding firsthand experience with the previous bottleneck of having to process hundreds of emails manually, I decided to step up my contribution and create a tightly integrated submission platform where students would apply. One that would simplify our work and allow us to pursue more internship vacancies and more companies. That first prompted me to dive into the world of Web Development. Constrained by my faculty's web services, I learned PHP and the usual suspects of the front-end paradigm and eventually released the, now superseded, submission platform. This second year was a lot easier, as we only needed to collect a list of companies and internship proposals to seed the application's database. The rest was automated, allowing us to provide better support, increase user engagement and drive adoption - all things that would make a sales executive scream with joy.


## 2017 Edition

{% include image.html path="istsi/istsi.org.png"
   alt="ISTSI homepage at istsi.org." caption-no="1" caption="ISTSI homepage at istsi.org."
%}

Having worked in both corporate contact and dev ops, it was time to be more ambitious and lead this promising project. Unlike previous editions, I wanted **every society to fully work together**, to share the same brand, communication channels and to run the same web services and submission process. It meant a stronger presence, a massive reduction in allocated resources and an opportunity to achieve something bigger - one of the most important occasions of the college year.

To attain this I rebuilt the whole platform, increased the feature set and created a solid foundation for future maintainers. This allowed me to learn about server administration, information security, deployment methods and containerization via Docker and related tools. Whilst managing the infrastructure was a time-consuming task by itself, the most crucial and demanding aspect was ensuring perfect cooperation between societies at every stage, allowing all elements to excel at their designated roles. To ease my society's team workload, and like previous editions, I also reached out and attended meetings with various HR departments. Everything but graphic design. Not that great with that one fella.

It was a very gratifying experience, however, and I couldn't be happier with the results.

{% include image.html path="istsi/applicants.png"
   alt="Applicant growth by year." caption-no="2" caption="Applicant growth by year."
%}
{% include image.html path="istsi/applications.png"
   alt="Application growth by year." caption-no="3" caption="Application growth by year."
%}

This past year saw unprecedented growth on all indices, with the programme reaching between 5300 and 6500 IST students. Out of those, 938 logged in and 580 applied to at least one vacancy - a whopping YOY increase of 51%. The number of applications also jumped to 3577, again a massive YOY increase of 175%.

{% include image.html path="istsi/companies.png"
   alt="Company growth by year." caption-no="4" caption="Company growth by year."
%}

We also managed to attract a lot more companies this time. It should be noted that we only accept those willing to use our simplified platform, meaning that several multinationals that force students to use non-transparent, complicated and invasive systems were rejected.

{% include image.html path="istsi/companies-societies.png"
   alt="Companies per Society per Year." caption-no="5" caption="Companies per Society per Year. The rings, from inner to outer, pertain to the {2015, 2016, 2017} editions, respectively. The highlighted blue slices represent the share of my society, NEECIST."
%}

The above visualization shows how the programme has been growing (number of participating companies) and how many societies have joined since 2015.

Barring the increased offer count, our growth was essentially the product of 3 factors:

* A unified submission platform now available to all courses, which greatly reduced the amount of effort needed to apply - a bigger net with which to retain students who would otherwise be lost along the way;
* New societies and their respective courses were added to the programme, expanding the pool of students that could take advantage of this opportunity;
* A superior, unified marketing campaign.


### Tips for Future Applicants

{% include image.html path="istsi/applications-applicants-days.png"
   alt="Applicants and Applications per Day." caption-no="6" caption="Applicants and Applications per Day. 'Weekend' is abbreviated to (W) and 'holiday' to (H). The sum of applicants in each day is higher than the total applicant count as some students applied to different proposals on different days."
%}

In the chart above, we can see the distribution of applicants and applications along the 2 week period.  Having said this, it is fairly obvious that students love to do everything at the last minute. Since this pattern repeats every year, we also allowed submissions until 1/5 2AM (2 extra hours). Don't take this for granted.

Finally, many students sent the same Cover Letter and CV to every internship proposal. With a simple `sha256sum(filename)` and without opening the file itself it is pretty obvious that at least `~43%` of students who submitted more than one application sent the same CL to every proposal (and we're not even counting those that just change the "Dear HR of Company X"). As expected, the number goes to `~97%` if we look at CVs instead. Generic cover letters aren't very useful and don't show why the student is interested in what the company is and does. Not customizing your CV is also a mistake, especially if you stumble upon an [ATS](https://en.wikipedia.org/wiki/Applicant_tracking_system), as different proposals may ask for different skills and the CV ought to make it clear that the applicant is a match. Rubbing pages of everything you've done is probably not the best strategy either.


### Information Security & Privacy

Since this is my blog, I feel this should be addressed:

* All student data in our hands was only accessible to me, the server admin, via SSH on a reasonably secure server and **has been fully erased** after the last contract was signed;
* Companies downloaded the student data directly from the platform, unlike previous editions;
* Since I used the [FenixEdu OAuth2 API](https://fenixedu.org/dev), students who have agreed to login will have a dangling [app authorization on Fenix](https://fenix.tecnico.ulisboa.pt/personal/external-applications/#/authorizations). Unlike other IST apps, OAuth tokens were never persisted. Only the absolute minimum needed information was collected from this API, as can be seen in the [platform source code](https://github.com/migueldemoura/istsi/blob/master/app/src/ISTSI/Controllers/Auth/Fenix.php#L42-L50) and explained in our [terms and conditions](https://istsi.org/files/regulamento.pdf);
* The students that were accepted into any given proposal had part of the above information sent to TT@Técnico so the tri-party contract could be written.

I encourage developers of the other popular IST apps to adopt similar strategies.


### Acknowledgements

All this was possible thanks to an **incredible team of student volunteers from a multitude of courses**, all working together to make our education better and to ease the contact with the enterprise world. A special thank you also goes out to the TT@Técnico team, which provided crucial support by handling legal contracts between all parties involved. As part of my role as a Microsoft Student Partner (MSP), I was also kindly given a considerable amount of monthly Azure credits by Microsoft, which was extremely useful for hosting a subset of our infrastructure.


## Future steps

After this edition, and the commitment shown by Técnico to help us improve this programme, we will be moving our infrastructure to the hands of the faculty, allowing our team to focus solely on increasing the internship offers and providing better guidance and support to students.

Going forward to this next year, I'll be ensuring a smooth transition and integrating the new team members. Having just welcomed the remaining student societies, including some from another campus, it is safe to say the next move could be to expand into other universities, perhaps taking advantage of already in-place, successful partnerships.

We believe our effort has and will help our peers secure a better job, discover their passion and be somewhat less nervous on their post college, no longer first, job interview.
