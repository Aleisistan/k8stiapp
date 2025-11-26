# Etapa 1: Construir la app Angular
# ETAPA 1: Construcción (Build)
FROM node:20-alpine as build-step

WORKDIR /app

COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el código fuente
COPY . .

# Compilamos para producción
# Esto genera una carpeta 'dist' con los archivos HTML/JS/CSS
RUN npm run build 

# ETAPA 2: Servidor Web (Nginx)
FROM nginx:alpine

# Copiamos los archivos compilados de la Etapa 1 a la carpeta de Nginx
# IMPORTANTE: Reemplaza 'nombre-de-tu-app-en-angular-json' por el nombre real de tu carpeta en dist/
COPY --from=build-step /app/dist/*/ /usr/share/nginx/html

# Nginx corre en el puerto 80 por defecto
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
