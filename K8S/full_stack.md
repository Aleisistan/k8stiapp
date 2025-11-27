# 🏛️ Documentación de Infraestructura (`full_stack.yaml`)

Este archivo es el corazón de nuestro despliegue en Kubernetes. Define todos los recursos necesarios para ejecutar la aplicación Full Stack, 
conectarlos entre sí y asegurar la persistencia de datos.

A continuación, se explica cada componente paso a paso.

---

## 1. Configuración y Secretos (La base)  Por qué es importante: Permite cambiar la configuración de la base de datos en un solo lugar y que se propague al Backend y a la Base de Datos.

Antes de levantar contenedores, definimos las variables de entorno que compartirán.

### 🔹 ConfigMap (`db-config`)
Almacena datos de configuración **no confidenciales**.
```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: db-config
data:
  DB_HOST: postgres-service  # <--- CRÍTICO: Es el DNS interno para hallar la DB
  POSTGRES_DB: sticct        # Nombre de la base de datos a crear
  POSTGRES_USER: postgres    # Usuario por defecto
```
---
### Secret (db-secret) Almacena datos confidenciales (contraseñas). Por qué es importante: Kubernetes encripta estos valores (o los ofusca en base64) para que no sean legibles a simple vista.
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
stringData:
  POSTGRES_PASSWORD: "secret123!" # Contraseña real
```
---
## 2. Persistencia de Datos (El Disco Duro) Función: Crea un "disco virtual" independiente de los Pods. Si el Pod de Postgres muere o se reinicia, este disco NO se borra, garantizando que tus usuarios y datos sobrevivan.

###🔹 PersistentVolumeClaim (postgres-pvc)
Aquí solicitamos "espacio físico" en el disco al clúster.
```yaml
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
spec:
  accessModes:
    - ReadWriteOnce   # Solo la DB puede escribir aquí
  resources:
    requests:
      storage: 1Gi    # Reservamos 1 GB
```
---

## 3. Capa de Datos (PostgreSQL)
###🔹 Deployment (postgres)
Define cómo corre el motor de base de datos.

Env: Inyecta las variables desde db-config y db-secret.

VolumeMounts: Aquí ocurre la magia de la persistencia. Monta el PVC (postgres-storage) en la ruta interna /var/lib/postgresql/data.

###🔹 Service (postgres-service) Función: Le da una IP estable a la base de datos. El Backend se conecta a postgres-service:5432.
Es el "Router" interno.
```yaml
kind: Service
metadata:
  name: postgres-service # Este nombre se usa en el Backend como 'host'
spec:
  ports:
    - port: 5432
```
## 4. Backend API (NestJS)
###🔹 Deployment (backend)
Aquí corre tu lógica de negocio.

Replicas: Está comentado (# replicas: 3) intencionalmente.

Razón: Usamos HPA (Autoescalado). Si definimos un número fijo aquí, Argo CD pelearía con el HPA (uno quiere 3, el otro quiere 10). Al comentarlo, dejamos que el HPA decida.

ImagePullPolicy: Never: Obliga a Kubernetes a usar la imagen construida localmente en tu PC (docker build), en lugar de intentar bajarla de internet.

Resources:
```yaml
resources:
  requests:
    cpu: "100m"  # Necesario para que el HPA calcule el % de uso
  limits:
    cpu: "200m"  # Evita que un error consuma toda tu PC
```
Env: Mapea manualmente las variables del ConfigMap/Secret a las variables que espera NestJS.

###🔹 Service (backend-service)
Exposición externa.

Type: LoadBalancer: En Docker Desktop, esto expone el puerto 3000 directamente en localhost.

Acceso: Puedes entrar desde tu navegador o Postman en http://localhost:3000.

---

## 5. Frontend (Angular/React)
###🔹 Deployment (frontend)
Servidor web para la interfaz de usuario.

Image: mi-frontend:v1 (Local).

Port: 4200.

###🔹 Service (frontend-service)
Type: LoadBalancer: Expone la web en http://localhost:4200.

Flujo: Usuario -> localhost:4200 -> Service -> Pod Frontend.

---
## 6. Herramientas de Gestión (Adminer)
###🔹 Deployment & Service (adminer)
Una interfaz web ligera para gestionar la base de datos visualmente.

Acceso: http://localhost:8080.

Conexión: Desde aquí te conectas al postgres-service.
