FROM node:lts-alpine

# Set MongoDB connection URL
ENV EXPRESS_MONGODB_URL="mongodb://mongodb:27017/express_data_encryption"

RUN mkdir /app
WORKDIR /app
COPY ./dist .
EXPOSE 8000
CMD ["npm", "run", "start"]
