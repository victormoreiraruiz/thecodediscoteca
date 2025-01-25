# The Code NightClub

## Breve descripción
Esta aplicación permite la compra y venta de entradas para eventos, así como la creación de nuevos eventos. Los usuarios pueden reservar salas, realizar compras de entradas con QRs y realizar pedidos en eventos indicando su mesa. Además, cuenta con herramientas para la gestión empresarial, incluyendo control de usuarios, eventos, stocks y análisis de ingresos.

## Funcionalidades
- **Gestión de salas**: Reservar y cancelar.
- **Compra de entradas**: Generación de códigos QR.
- **Devolución en caso de cancelación**: Con notificaciones al usuario.
- **Sistema de fidelidad**: Fomenta la compra mediante sorteos.
- **Sistema de roles**: Cliente, administrador, promotor y camarero.
- **Pedidos durante eventos activos**: Indicación de la mesa correspondiente.
- **Pagos en línea**: Integración con PayPal.
- **Panel de control**:
  - Estadísticas de los eventos (promotor).
  - Gestión empresarial (administrador).
  - Estadísticas de comandas (camarero).

## Tecnologías Utilizadas
- **Frontend**: React.js, CSS, Tailwind.
- **Backend**: Laravel.
- **Comunicación**: Inertia.js.
- **Lenguajes**: PHP, JavaScript, HTML5.
- **Base de Datos**: PostgreSQL.
- **Otros**: SweetAlert2, Calendar.js, Day.js.

## Instalación

### Requisitos previos
#### PHP :

sudo apt install -y software-properties-common apt-transport-https ca-certificates lsb-release
sudo add-apt-repository ppa:ondrej/php
sudo apt update
sudo apt install -y php php-{bcmath,bz2,intl,gd,mbstring,mysql,zip,xml,curl}


#### Composer :

php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
sudo php composer-setup.php --install-dir=/usr/local/bin --filename=composer


#### Node.js y npm :

curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs


#### Git :

sudo apt update
sudo apt install git -y


#### Postgresql :

sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'
wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo apt update
sudo apt install -y postgresql
sudo -u postgres psql
CREATE USER thecodediscoteca WITH PASSWORD 'thecodediscoteca';
CREATE DATABASE thecodediscoteca;
ALTER DATABASE thecodediscoteca OWNER TO thecodediscoteca;
GRANT ALL PRIVILEGES ON DATABASE thecodediscoteca TO thecodediscoteca;


### Configuración del Proyecto
#### Clonar el repositorio :

git clone https://github.com/victormoreiraruiz/thecodediscoteca.git
cd thecodediscoteca
Renombra el archivo "copia" como .env


#### Instalar dependencias :

composer install
composer dump-autoload
npm install


#### Configurar base de datos :

sudo apt install php-pgsql -y
php artisan migrate
php artisan storage:link


#### Iniciar el proyecto :

npm run dev
php artisan serve
Accede a la URL proporcionada por el comando php artisan serve.

### Autor: 

Desarrollado por Víctor Manuel Moreira Ruiz.
GitHub: victormoreiraruiz
Para IES Doñana 2024/25.
### Licencia: 

Este proyecto está bajo la licencia MIT.