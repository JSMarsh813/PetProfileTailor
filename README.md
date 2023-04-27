# Pet Profile Tailor

## Inspiration Behind and Introduction to Project:

I worked as an adoption counselor in animal shelters for ~5 years and although pet profiles are vital to catch adopters attention and boost adoption rates, there's only so much creativity a person can have at the crack of dawn. Coffee can only do so much 😛 

So I was inspired to create this site which empowers animal lovers to help adoption counselors create impactful, fun, and tailor-fitted adoption profiles! After signing up, users can submit new names and descriptions,save favorites and follow other users. Users can easily search and filter through community submitted names and descriptions.

[PPT1-1.webm](https://user-images.githubusercontent.com/101692334/233764485-49bfb68f-8504-4c31-855e-a74ba5a19b25.webm)

[PPT1-3.webm](https://user-images.githubusercontent.com/101692334/233764888-1dd7e3b2-1208-481c-9de1-8d591e312373.webm)

## How It's Made:

Next.js, React, Next-Auth, JavaScript, Tailwindcss, CSS, HTML5, MongoDB, Mongoose, Cloudinary, Node Mailer, SendGrid, SWR

##Optimizations:

## Potential Future Optimizations:

1. Add SWR to the profile pages
2. Although it currently works for keyboard users, I want to improve the accessiblity for screenreaders
3. Add BYTE, a virtual chat gpt dog that helps people find names or built pet profiles
4. Add a messaging feature

## Lessons Learned

1. Problem:

When trying to install npm install -D @tailwindcss/forms I kept Getting an error code:

npm ERR! code EWORKSPACESCONFIG npm ERR! workspaces config expects an Array

Result: Tried a few things after googling, but what ended up fixing it was deleting the workspaces in my package.json and redoing the npm install -D @tailwindcss/forms"

2. Problem: Needed to install multiple packages for a tailwind component

I kept getting "module not found errors" but after installing the modules with npm they worked.
