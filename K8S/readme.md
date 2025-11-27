# 🚀 Infraestructura Full Stack en Kubernetes (Local) con GitOps

Este repositorio contiene la configuración de infraestructura para desplegar una aplicación Full Stack (NestJS + Frontend + Postgres) en un entorno local utilizando **Docker Desktop** y **Kubernetes**, orquestado mediante **Argo CD** y con capacidad de autoescalado (**HPA**).

![Kubernetes](https://img.shields.io/badge/Orquestación-Kubernetes-blue)
![ArgoCD](https://img.shields.io/badge/GitOps-Argo%20CD-orange)
![Postgres](https://img.shields.io/badge/Database-PostgreSQL-336791)
![Status](https://img.shields.io/badge/Status-WIP-yellow)

---

## ⚠️ Estado Actual del Proyecto (Known Issues)

El despliegue de infraestructura es exitoso, pero existen limitaciones funcionales pendientes de resolución:

* ✅ **Despliegue:** Todos los servicios (Frontend, Backend, DB, Adminer) inician en estado `Running`.
* ✅ **Red Interna:** El Backend resuelve correctamente el DNS `postgres-service`.
* ✅ **Persistencia:** La base de datos mantiene los datos tras reinicios (PVC Configurado).
* ✅ **Autoescalado:** El HPA escala los pods correctamente bajo estrés.
* ⚠️ **Funcionalidad de Registro:**
    * **Problema:** No es posible crear usuarios desde el Frontend actualmente.
    * **Diagnóstico:** Aunque hay conexión a la DB, la operación de escritura falla (posible desincronización de esquemas TypeORM o bloqueo de credenciales CORS).
    * **Workaround:** Se pueden verificar conexiones creando tablas manualmente desde Adminer.

---

## ☀️ Ciclo de Vida Diario (Start / Stop)

Instrucciones para detener el trabajo y retomarlo al día siguiente sin perder configuración.

### 🛑 Al terminar el día (Stop)
1.  Cierra la aplicación **Docker Desktop** (Click derecho en el icono de la barra de tareas -> *Quit Docker Desktop*).
2.  Apaga tu PC.
    * *Nota:* No borres los recursos con `kubectl delete`. Kubernetes guardará el estado de los pods y el disco de la base de datos.

### ▶️ Al iniciar el día (Start)
1.  Abre **Docker Desktop** y espera a que el icono de Kubernetes esté en verde.
2.  Verifica que los pods revivieron automáticamente:
    ```powershell
    kubectl get pods
    ```
3.  **¡IMPORTANTE!** Los túneles de acceso se cierran al apagar la PC. **Debes ejecutar estos comandos cada mañana** para acceder a las herramientas:

    * **Para Argo CD:**
        ```powershell
        kubectl port-forward svc/argocd-server -n argocd 8081:443
        ```
    * **Para Adminer (Base de Datos):**
        ```powershell
        kubectl port-forward svc/adminer-service 8080:8080
        ```

---

## 🛠️ Prerrequisitos

* **Docker Desktop** (Kubernetes habilitado en Settings).
* **PowerShell** (Terminal recomendada).
* **Git**.

---

## 🚀 Guía de Instalación desde Cero

### 1. Construcción de Imágenes Locales
Construimos las imágenes directamente en el registro de Docker Desktop para evitar subirlas a la nube.

```powershell
# Backend
cd backend
docker build -t mi-backend:v1 .

# Frontend
cd ../frontend
docker build -t mi-frontend:v1 .

---
### 2. Configuración del Servidor de Métricas
Docker Desktop no incluye métricas por defecto. Necesarias para que el Autoescalado (HPA) funcione. 

# 1. Instalar componentes oficiales
kubectl apply -f [https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml](https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml)

# 2. Aplicar parche de seguridad para Docker Desktop (Permite certificados inseguros locales)
kubectl patch -n kube-system deployment metrics-server --type=json -p "[{\"op\":\"add\",\"path\":\"/spec/template/spec/containers/0/args/-\",\"value\":\"--kubelet-insecure-tls\"}]"

### 3. Instalación de Argo CD (GitOps)
Instalamos el controlador de Argo CD para que vigile nuestro repositorio.

# Crear namespace e instalar
kubectl create namespace argocd
kubectl apply -n argocd -f [https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml](https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml)

# Esperar a que los pods inicien y abrir túnel de acceso (Puerto 8081) el 8080 esta ocupado con adminer
kubectl port-forward svc/argocd-server -n argocd 8081:443

Credenciales de acceso:

URL: https://localhost:8081

Usuario: admin

Contraseña: Ejecutar el siguiente comando para desencriptarla:

kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | % { [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($_)) }

### 4. Configurar la Aplicación en Argo CD
Ir a + NEW APP.

Source: Poner la URL de este repositorio github y path k8s.

Destination: Cluster https://kubernetes.default.svc y namespace default.

Sync Policy: Automatic (Self Heal + Prune).


### 🔥 Pruebas de Estrés y Autoescalado (HPA)

Para verificar que el sistema escala de 1 a 10 pods, incluimos un archivo de generación de carga.

**1. Activar Monitorización:**
Abre una terminal nueva y déjala corriendo para ver los cambios en vivo:
```powershell
kubectl get hpa -w

2. Iniciar el Ataque: Desplegamos el pod generador de carga usando el archivo incluido en el repositorio:

PowerShell

kubectl apply -f k8s/load-generator.yaml


3. Resultado: En aproximadamente 60 segundos, verás en Argo CD o en la terminal cómo las réplicas suben progresivamente hasta llegar a 10 pods.

4. Detener prueba: Para detener el ataque, simplemente borra el pod:

PowerShell

kubectl delete -f k8s/load-generator.yaml


💾 Acceso a Base de Datos y Persistencia
El proyecto incluye un volumen persistente (PVC). Los datos sobreviven a reinicios del clúster.

Acceso GUI: http://localhost:8080 (Adminer).

Servidor: postgres-service (¡Importante: usar nombre interno, no localhost!).

Usuario: postgres

Contraseña: secret123! (o ver archivo full_stack.yaml).

Frontend: http://localhost:4200

Argo CD: https://localhost:8081

Backend API	http://localhost:3000
