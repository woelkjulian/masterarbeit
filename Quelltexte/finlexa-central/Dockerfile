FROM node:boron

ADD . /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g tsc typescript

RUN npm install

RUN tsc 

EXPOSE 3100
CMD ["npm", "start"]
