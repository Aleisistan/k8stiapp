# 🧨 Documentación del Generador de Carga (`load-generator.yaml`)

Este archivo define un **Pod temporal** (de un solo uso) cuya única función es generar tráfico masivo artificial hacia el Backend. Su objetivo es aumentar el consumo de CPU para disparar el **Horizontal Pod Autoscaler (HPA)**.

---

## Desglose Técnico del Pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: load-generator
spec:
  # ...
```
### 1. La Imagen (busybox)
```yaml
    image: busybox
    imagePullPolicy: IfNotPresent
```
Qué es: Busybox es una imagen extremadamente ligera (menos de 5MB) que contiene las herramientas básicas de UNIX.

Por qué se usa: No necesitamos un sistema operativo completo ni librerías pesadas. Solo necesitamos una terminal y el comando wget.

## 2. El Script de Ataque (command & args)
Aquí reside la lógica de la prueba de estrés. Se ejecuta un script de Shell (/bin/sh) en bucle infinito.

```powershell

while true; do
  wget -q -O- http://backend-service:3000 || true
  sleep 0.01
done
```
while true; do ... done: Crea un bucle que nunca termina (hasta que borras el pod).

wget -q -O- http://backend-service:3000:

wget: Herramienta para descargar contenido web. Aquí actúa como un "usuario visitando la web".

-q: (Quiet) Modo silencioso para no llenar los logs de basura.

-O-: Descarga el contenido y lo tira al vacío (no guarda archivos), solo nos importa la conexión.

http://backend-service:3000: Punto Clave. Ataca al servicio interno de Kubernetes, no sale a internet ni usa localhost.

|| true: (O vital). Significa "Si el comando falla, continúa igual".

Importancia: Cuando el servidor se sature, empezará a rechazar conexiones (Connection Refused). Sin esto, el script se detendría al primer error. Con esto, el ataque continúa sin piedad.

sleep 0.01: Hace una pausa de 10 milisegundos entre petición y petición. Genera aproximadamente 100 peticiones por segundo desde un solo pod.

## 3. Política de Reinicio (restartPolicy)
```yaml
  restartPolicy: Never

```
Función: Le dice a Kubernetes: "Si este pod se detiene o falla, NO intentes revivirlo".

Razón: Es un pod de prueba manual. Cuando terminamos el test y lo borramos, no queremos que el Clúster intente recrearlo.

## 📖 Cómo usar este archivo
### 1. Iniciar la prueba (Atacar): Al aplicar este archivo, el pod nace y comienza a disparar peticiones inmediatamente.

```PowerShell

kubectl apply -f k8s/load-generator.yaml
```
### 2. Verificar el efecto: Observa cómo sube el uso de CPU en el HPA.

```PowerShell

kubectl get hpa -w
```
### 3. Detener la prueba: Simplemente elimina el pod. El tráfico cesará al instante.

```PowerShell

kubectl delete -f k8s/load-generator.yaml
```
