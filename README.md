## Overview ##
This is a SQL based real estate management system.

## SQL Database Design ##
- **[ER Diagram](./ER-Diagram.pdf)**
- **[Relational Design](./Relational-Design.pdf)**

## Routes  ##
Navigate to the following routes to preview the pages directly (I am not preventing page access as per auth for now) :-
<ul>
  <li>
    <a href="https://real-estate-management-system.vercel.app/buyer" target="_blank">Buyer Page</a>
  </li>
  <li>
    <a href="https://real-estate-management-system.vercel.app/seller/100" target="_blank">Seller Page</a>
  </li>
  <li>
    <a href="https://real-estate-management-system.vercel.app/agent/1000" target="_blank">Agent Page</a>
  </li>
  <li>
    <a href="https://real-estate-management-system.vercel.app/office" target="_blank">Admin Page</a>
  </li>
  <li>
    <a href='https://real-estate-management-system.vercel.app/office/1000'>Sample Report</a>
  </li>
</ul>

**Note** 
- Documentation is in progress. Checkout the [Wiki](https://github.com/mynameisankit/real-estate-management-system/wiki) of the project for any updates.
- The project is still under development and breaking changes / UI and UX improvements will be made gradually.

## Tech Stack ##
- Next.js
- React.js
- MySQL
- Node.js
- Material-UI
- Axios (Will be changed to SWR library for data fetching)

## Install Dependencies ##
```bash
$ cd real-estate-managament-system
# or
$ cd your-folder-name

# using yarn or npm
$ yarn 
# or
$ npm install
```

## Getting Started (Development Mode) ##

First, run the development server:

```bash
$ npm run dev
# or
$ yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file. The project will be documented soon.

API routes can be accessed on `http://localhost:3000/api/route_name` where `route_name` is the endpoint of the api.


## Production Build ##
```bash
$ yarn build
# or
$ npm run build
# or
$ pnpm run build
```

## Some Screenshots ##
<img src='/docs/log-in.png' alt='Log-In Page' />
<img src='/docs/properties-list.png' alt='List of Properties' />
<img src='/docs/report-1.png' alt='Agent Report - 1' />
<img src='/docs/report-2.png' alt='Agent Report - 2' />
