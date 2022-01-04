This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

# Web Frontend

this is the webfrontend of the password manager, it allows the user to add and remove passwords from the server. Currently there is no client side encryption and encryption is handled on the serverside

## Getting Started

first bit of setup is to point the request utils to your backend. This can be done by changing the value of the string api_url in request-utils.tsx.

Make sure to install all packages/dependancies then you can run the development enviorment if the backend server is setup.

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the password manager's landing page


