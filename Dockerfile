#Partimos de una imagen 
FROM node:20-alpine

#creamos una carpeta de trabajo interna
WORKDIR /app

#copiamos solo los archivos de dependencias primero
COPY package*.json ./

#instalamos las dependencias
RUN npm install

#copiamos el resto de nuestro codigo (src, app.js)
COPY . .

#exponemos el puerto que usa nuestra API
EXPOSE 3000

#comando para prender el servidor
CMD ["npm", "start"]
