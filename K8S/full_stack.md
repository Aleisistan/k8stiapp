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

---
### Secret (db-secret) Almacena datos confidenciales (contraseñas).
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-secret
type: Opaque
stringData:
  POSTGRES_PASSWORD: "secret123!" # Contraseña real
