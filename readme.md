# 🚀 Infraestructura Full Stack en Kubernetes (Local) con GitOps

Este repositorio contiene la configuración de infraestructura para desplegar una aplicación Full Stack (NestJS + Frontend + Postgres) en un entorno local utilizando **Docker Desktop** y **Kubernetes**, orquestado mediante **Argo CD** y con capacidad de autoescalado (**HPA**).

![Kubernetes](https://img.shields.io/badge/Orquestación-Kubernetes-blue)
![ArgoCD](https://img.shields.io/badge/GitOps-Argo%20CD-orange)
![Postgres](https://img.shields.io/badge/Database-PostgreSQL-336791)
![Status](https://img.shields.io/badge/Status-WIP-yellow)

---

## ✅ Estado Actual del Proyecto (Known Issues)

El despliegue de infraestructura es exitoso, pero existen limitaciones funcionales pendientes de resolución:

* ✅ **Despliegue:** Todos los servicios (Frontend, Backend, DB, Adminer) inician en estado `Running`.
* ✅ **Red Interna:** El Backend resuelve correctamente el DNS `postgres-service`.
* ✅ **Persistencia:** La base de datos mantiene los datos tras reinicios (PVC Configurado).
* ✅ **Autoescalado:** El HPA escala los pods correctamente bajo estrés.
* ⚠️ **Funcionalidad de Registro:** ✅ "solved"
    * **Problema:** No es posible crear usuarios desde el Frontend actualmente.✅ "solved"
    * **Diagnóstico:** Aunque hay conexión a la DB, la operación de escritura falla (posible desincronización de esquemas TypeORM o bloqueo de credenciales CORS).✅ "solved"
    * **Workaround:** Se pueden verificar conexiones creando tablas manualmente desde Adminer.✅ "solved" 
### POST https://localhost:3000/users net::ERR_SSL_PROTOCOL_ERROR

El problema era una sola letra: la "s".

Estás intentando conectar por HTTPS (Seguro), pero tu Backend en local (NestJS) está corriendo en HTTP (Normal). 
Es como intentar saludar de mano a alguien que te está dando un abrazo; el protocolo no coincide y la conexión se rompe antes de empezar.
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
```
---

### 2. Configuración del Servidor de Métricas
Docker Desktop no incluye métricas por defecto. Necesarias para que el Autoescalado (HPA) funcione. 

#### 1. Instalar componentes oficiales

```powershell
kubectl apply -f [https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml](https://github.com/kubernetes-sigs/metrics-server/releases/latest/download/components.yaml)

```

#### 2. Aplicar parche de seguridad para Docker Desktop (Permite certificados inseguros locales)
```powershell
kubectl patch -n kube-system deployment metrics-server --type=json -p "[{\"op\":\"add\",\"path\":\"/spec/template/spec/containers/0/args/-\",\"value\":\"--kubelet-insecure-tls\"}]"
```
---

## 3. Instalación de Argo CD (GitOps)
Instalamos el controlador de Argo CD para que vigile nuestro repositorio.

### Crear namespace e instalar

```powershell
kubectl create namespace argocd
kubectl apply -n argocd -f [https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml](https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml)
```

#### Esperar a que los pods inicien y abrir túnel de acceso (Puerto 8081) el 8080 esta ocupado con adminer

```powershell
kubectl port-forward svc/argocd-server -n argocd 8081:443
```
#### Credenciales de acceso:

URL: https://localhost:8081

Usuario: admin

Contraseña: Ejecutar el siguiente comando para desencriptarla:

```powershell
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | % { [System.Text.Encoding]::UTF8.GetString([System.Convert]::FromBase64String($_)) }
```

### 4. Configurar la Aplicación en Argo CD
Ir a + NEW APP.

Source: Poner la URL de este repositorio github y path k8s.

Destination: Cluster https://kubernetes.default.svc y namespace default.

Sync Policy: Automatic (Self Heal + Prune).


### 🔥 Pruebas de Estrés y Autoescalado (HPA)

Para verificar que el sistema escala de 1 a 10 pods, incluimos un archivo de generación de carga.

#### 1. Activar Monitorización:
Abre una terminal nueva y déjala corriendo para ver los cambios en vivo:
```powershell
kubectl get hpa -w
```
#### 2. Iniciar el Ataque: Desplegamos el pod generador de carga usando el archivo incluido en el repositorio:

```powershell
kubectl apply -f k8s/load-generator.yaml
```
#### 3. Resultado: En aproximadamente 60 segundos, verás en Argo CD o en la terminal cómo las réplicas suben progresivamente hasta llegar a 10 pods.

#### 4. Detener prueba: Para detener el ataque, simplemente borra el pod:

```powershell
kubectl delete -f k8s/load-generator.yaml
```
---
## Error de KUBECTL al querer ver los logs del backend
```powershell
kubectl logs -l app=backend -f 
error: you are attempting to follow 10 log streams, but maximum allowed concurrency is 5, use --max-log-requests to increase the limit
```
### 😂 El monstruo que creaste sigue vivo!
Ese error aparece porque tu prueba de estrés funcionó demasiado bien. El Autoescalado (HPA) subió tu backend a 10 réplicas, y ahora kubectl te dice: "Oye, no puedo vigilar 10 canales de televisión al mismo tiempo, el límite es 5".
Intentar depurar un error buscando en 10 logs diferentes es una locura. Vamos a volver a la calma (escalar a 1 solo pod) para que sea fácil encontrar el error.

### Argo CD intenta mantener la sincronización con Git. Si borras el HPA en la interfaz, pero tienes activado el "Auto-Sync", ¡Argo CD lo volverá a crear en 2 segundos!

Aquí te explico cómo hacerlo correctamente para "pausar" el autoescalado y quedarte con 1 solo pod para depurar:

#### Paso 1: Desactivar el Auto-Sync (Pausar el "piloto automático") ⏸️
Si no haces esto, Argo peleará contigo.

Entra a tu aplicación en Argo CD.

Arriba en la cabecera, busca el botón APP DETAILS.

En la sección SYNC POLICY, si dice "Enable Auto-Sync", dale al botón DISABLE (o quita el check).

Ahora Argo CD dejará de corregir tus cambios manuales.

#### Paso 2: Borrar el HPA desde la Interfaz 🗑️
En el mapa visual (Tree o Network), busca el cuadradito o hexágono que dice hpa backend-hpa.

Haz clic sobre él.

Dale al botón DELETE (o a los 3 puntitos -> Delete).

Escribe el nombre para confirmar o dale OK.

Ahora el "jefe" del autoescalado se ha ido.

#### Paso 3: Bajar las réplicas manualmente 📉
Ahora que no hay HPA ni Auto-Sync, tú mandas.

Busca el recuadro del Deployment backend.

Haz clic sobre él.

Busca la opción Edit (o a veces hay una pestaña directa que dice "Scale" o en los 3 puntitos).

Cambia replicas: 10 por replicas: 1.

Dale a Save.

¡Listo! Verás en pantalla cómo los pods se ponen en rojo (terminating) y desaparecen hasta quedar solo 1.

#### ¿Cómo volver a la normalidad?
Cuando termines de depurar:

Ve a APP DETAILS y activa de nuevo el Auto-Sync.

Argo CD verá que en Git existe el HPA y que faltan réplicas.

Automáticamente creará el HPA y dejará todo como estaba.


---
## ⚠️ Si el archivo load-generator.yaml está dentro de la carpeta k8s/ y haces git push, Argo CD lo interpretará como parte de tu aplicación oficial.

### Argo CD detectará el archivo: Verá que hay un nuevo recurso llamado Pod/load-generator.
Lo ejecutará eternamente: Argo CD tiene la misión de mantener el estado deseado. Si el generador se detiene, Argo CD podría intentar reiniciarlo (aunque tenga restartPolicy: Never, Argo verá que el pod "Completed" ensucia el estado y podría marcarlo como OutOfSync o tratar de recrearlo si cambias algo).

### Ataque Infinito: Tu backend estará bajo ataque las 24 horas del día.

Escalado Permanente: Tu HPA mantendrá las 10 réplicas encendidas siempre, consumiendo toda la CPU de tu máquina innecesariamente.

### ❌ Lo que NO debes hacer
No metas el load-generator.yaml dentro de la carpeta k8s/ si esa es la carpeta que vigila Argo CD.

### ✅ La Mejor Práctica (Cómo organizarlo)
Debes separar lo que es Infraestructura Real de lo que son Herramientas de Prueba.

Mueve el archivo a una carpeta separada que Argo CD ignore.

Tu estructura de carpetas recomendada:

Plaintext
mi-proyecto/
│
├── backend/
├── frontend/
│
├── k8s/               <-- Argo CD vigila SOLO esta carpeta
│   ├── full_stack.yaml
│   ├── backend-hpa.yaml
│   └── (AQUÍ NO PONGAS EL GENERADOR)
│
└── tests/             <-- Crea esta carpeta nueva
    └── load-generator.yaml

### Cuando tú quieras hacer la prueba manual, ejecutas el comando desde tu terminal apuntando a esa carpeta:

```PowerShell
# Solo cuando tú quieras atacar:
kubectl apply -f tests/load-generator.yaml

# Cuando quieras parar:
kubectl delete -f tests/load-generator.yaml

```
Resumen: Argo CD es para lo que debe estar siempre vivo. Los tests de carga son temporales, así que ejecútalos a mano desde una carpeta aparte (tests/ o scripts/).

### 💾 Acceso a Base de Datos y Persistencia
El proyecto incluye un volumen persistente (PVC). Los datos sobreviven a reinicios del clúster.

Acceso GUI: http://localhost:8080 (Adminer).

Servidor: postgres-service (¡Importante: usar nombre interno, no localhost!).

Usuario: postgres

Contraseña: secret123! (o ver archivo full_stack.yaml).

Frontend: http://localhost:4200

Argo CD: https://localhost:8081

Backend API	http://localhost:3000
