### Hexlet tests and linter status:

[![Github Action](https://github.com/Mabby20/frontend-project-11/actions/workflows/node-check.yml/badge.svg)](https://github.com/Mabby20/frontend-project-11/actions/workflows/node-check.yml)
[![Maintainability](https://api.codeclimate.com/v1/badges/d4d0d546b9ec61511a4a/maintainability)](https://codeclimate.com/github/Mabby20/frontend-project-11/maintainability)
[![Actions Status](https://github.com/Mabby20/frontend-project-11/workflows/hexlet-check/badge.svg)](https://github.com/Mabby20/frontend-project-11/actions)

![img.png](img.png)
## Rss Reader

**Rss Reader** is a service for aggregating RSS feed that allows convenient reading of various sources such as blog and news
sites. The service allows users to add an unlimited number of RSS feeds and automatically update them, adding new entries
to the common stream.

The project is based on the MVC design patterns and provides users with a convenient interface for reading RSS feeds.
The project implements working with pure DOM, selectors, and events, as well as generating HTML using the DOM API.

One of the key features of the service is proper form handling, including blocking during submission, displaying
progress, setting focus, and validating data. The project also uses asynchronous JavaScript and works with promises.

Webpack is used to build the project, and deployment to production is done using Vercel. The project has a user-friendly
interface and allows the user to conveniently read RSS feeds and mark them as read.

### Stack

>- Native JavaScript (ES6)
>- Pure DOM + HTML
>- MVC development
>- Bootstrap + styles
>- Axios
>- Yup validation
>- i18next
>- webpack
>- Vercel deployment

### Setup

> 1. Clone this repo by SSH key:  
```bash
git clone git@github.com:Mabby20/frontend-project-11.git
```
> 2. Install depencies:  
```bash
make install
```
> 3. Start the local server::
```bash
make develop
```
> 4. Open the app in a browser:
```
http://localhost:8080/
```
### How to use:

- Insert a valid RSS link into the input field.
- Click the "Add" button.
- A list of sources will appear on the right, and a list of posts on the left.
- Click on the "View" button to preview the description.
- Posts are updated automatically in real time.

### DEMO: [RSS-aggregator]()
