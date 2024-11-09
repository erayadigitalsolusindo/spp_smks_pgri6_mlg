# Set Alpine version as a build argument
ARG ALPINE_VERSION=3.20
FROM alpine:${ALPINE_VERSION}

# Label untuk pemeliharaan dan deskripsi
LABEL Maintainer="Mochmad Aries Setyawan <seira@erayadigital.co.id>"
LABEL Description="Container for Laravel Octane SPP PGRI 6 Malang"

# Install Composer from official composer image
FROM composer:latest AS composer

# Setup document root
WORKDIR /var/www/html

# Install required packages and PHP extensions
RUN apk add --no-cache \
  curl \
  php83 \
  php83-ctype \
  php83-curl \
  php83-dom \
  php83-fileinfo \
  php83-fpm \
  php83-gd \
  php83-intl \
  php83-mbstring \
  php83-mysqli \
  php83-opcache \
  php83-openssl \
  php83-phar \
  php83-session \
  php83-tokenizer \
  php83-xml \
  php83-xmlreader \
  php83-xmlwriter \
  php83-simplexml \
  php83-pdo_mysql \
  php83-sqlite3 \
  php83-pdo_sqlite \
  php83-pdo \
  php83-pear \
  php83-redis \
  php83-pcntl \
  php83-posix \
  php83-bcmath \
  php83-sockets \
  php83-sodium \
  supervisor \
  nginx \
  autoconf \
  automake \
  make \
  gcc \
  g++ \
  libtool \
  pkgconfig \
  php83-dev

# Install OpenSwoole via PECL
RUN pecl install openswoole

# Configure PHP-FPM
ENV PHP_INI_DIR=/etc/php83
COPY config/php.ini ${PHP_INI_DIR}/conf.d/custom.ini

# Configure supervisord
COPY config/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Make sure files/folders needed by the processes are accessible when they run under the nobody user
RUN chown -R nobody:nobody /var/www/html /run

# Composer dependencies
COPY --from=composer /usr/bin/composer /usr/bin/composer

# Add composer json and Laravel Octane config
COPY --chown=nobody:nobody source/composer.json /var/www/html/composer.json
COPY --chown=nobody:nobody source/artisan /var/www/html/artisan
COPY --chown=nobody:nobody source/bootstrap/ /var/www/html/bootstrap/
COPY --chown=nobody:nobody source/routes/ /var/www/html/routes/
COPY --chown=nobody:nobody source/config/ /var/www/html/config/
COPY --chown=nobody:nobody source/storage/ /var/www/html/storage/

# Add application code
COPY --chown=nobody:nobody source/ /var/www/html/

# Run composer install to install the dependencies
RUN composer install --optimize-autoloader --no-interaction

# Switch to use a non-root user
USER nobody

# Expose the port nginx is reachable on
EXPOSE 8080

# Let supervisord start nginx & php-fpm
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

# Configure a healthcheck to validate that everything is up&running
HEALTHCHECK --timeout=10s CMD curl --silent --fail http://127.0.0.1:8080/up || exit 1
