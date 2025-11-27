# 📈 Documentación de Autoescalado (`backend-hpa.yaml`)

Este archivo define las reglas del **Horizontal Pod Autoscaler (HPA)**. Su función es monitorear constantemente el consumo de recursos del Backend y aumentar o disminuir la cantidad de réplicas (Pods) automáticamente.

---

## Desglose de la Configuración

```yaml
apiVersion: autoscaling/v1
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
spec:
  # ... (Ver detalles abajo)

```
###  1. El Objetivo (scaleTargetRef)
```yaml
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend   # <--- Conecta el HPA con el Deployment llamado "backend"
```
Función: Le dice al autoscalador: "Tú eres el guardaespaldas de la aplicación llamada backend". Si cambias el nombre del Deployment en full_stack.yaml, debes cambiarlo aquí también.

### 2. Los Límites (minReplicas / maxReplicas)
```yaml
  minReplicas: 1
  maxReplicas: 10
```
minReplicas: 1: Incluso si nadie está usando la app, siempre habrá al menos 1 pod encendido para responder de inmediato.

maxReplicas: 10: Este es el "freno de seguridad". Si el tráfico es brutal, Kubernetes creará hasta 10 pods, pero no más, para evitar consumir toda la memoria de tu computadora (o presupuesto en la nube).

### 3. El Gatillo (targetCPUUtilizationPercentage)
```yaml
  targetCPUUtilizationPercentage: 15
Significado: "Si el promedio de CPU de los pods actuales supera el 15% de su capacidad reservada, ¡crea más pods!"
```
Por qué 15%: Este valor es intencionalmente bajo para entornos de prueba/demo.

En un entorno real de producción, este valor suele ser 70% u 80%.

Lo configuramos al 15% para poder ver el escalado fácilmente con una prueba de estrés ligera (load-generator).

### ⚠️ Requisito Técnico Obligatorio
Para que este archivo funcione, el Deployment del backend (en full_stack.yaml) DEBE tener definida la sección resources.requests.cpu.

¿Cómo funciona la matemática?

En el Deployment definimos request: cpu: "100m".

El HPA vigila esa cifra.

El 15% de 100m es 15m.

Si el pod usa más de 15m de CPU, el HPA ordena el escalado inmediato.
