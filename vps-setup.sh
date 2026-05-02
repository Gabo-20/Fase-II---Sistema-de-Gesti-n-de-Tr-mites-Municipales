set -e

echo "── Actualizando sistema ──"
apt update && apt upgrade -y

echo "── Instalando Docker ──"
apt install -y ca-certificates curl gnupg
install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
chmod a+r /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
  https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" \
  > /etc/apt/sources.list.d/docker.list
apt update
apt install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

echo "── Instalando Git ──"
apt install -y git

echo "── Creando usuario deploy ──"
useradd -m -s /bin/bash deploy
usermod -aG docker deploy

echo "── Configurando SSH para el pipeline ──"
mkdir -p /home/deploy/.ssh
chmod 700 /home/deploy/.ssh

chmod 600 /home/deploy/.ssh/authorized_keys
chown -R deploy:deploy /home/deploy/.ssh

echo "── Clonando repositorio ──"
mkdir -p /opt/tramites-municipales
git clone https://github.com/Gabo-20/Fase-II-Sistema-de-Gestion-de-Tramites-Municipales.git /opt/tramites-municipales
chown -R deploy:deploy /opt/tramites-municipales

echo ""
echo "✔ Setup completo."
echo "Próximo paso: crea /opt/tramites-municipales/.env con las variables reales."
