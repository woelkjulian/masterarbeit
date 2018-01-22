FROM node:boron

ADD . /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g tsc typescript

RUN npm install

RUN tsc 

EXPOSE 3000
CMD ["npm", "start"]
