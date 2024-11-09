ARG ALPINE_VERSION=3.20
FROM alpine:${ALPINE_VERSION}
LABEL Maintainer="Ach Rozikin <geronimo794@gmail.com>"
LABEL Description="Container for Laravel Octane, with swoole & PHP 8.3 based on Alpine Linux."
# Setup document root
WORKDIR /var/www/html

# Install packages and remove default server definition
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
  supervisor

RUN apk add --no-cache \
  autoconf \
  automake \
  make \
  gcc \
  g++ \
  libtool \
  pkgconfig \
  php83-dev

# Add specific dev packages based on your extension (e.g., libmcrypt-dev)
RUN pecl install openswoole

RUN apk add --no-cache php83-pcntl php83-posix
RUN apk add --no-cache php83-bcmath php83-sockets

# Configure PHP-FPM
ENV PHP_INI_DIR=/etc/php83
COPY config/php.ini ${PHP_INI_DIR}/conf.d/custom.ini

# Configure supervisord
COPY config/dev/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Make sure files/folders needed by the processes are accessable when they run under the nobody user
RUN chown -R nobody.nobody /var/www/html /run

# Switch to use a non-root user from here on
USER nobody

# Add application
# COPY --chown=nobody src/ /var/www/html/

# Expose the port nginx is reachable on
EXPOSE 8080

# Let supervisord start nginx & php-fpm
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

# Configure a healthcheck to validate that everything is up&running
HEALTHCHECK --timeout=10s CMD curl --silent --fail http://127.0.0.1:8080/ || exit 1

#######################
# EOF From Dockerfile #
#######################
USER root

RUN apk add --no-cache \
  nodejs npm

USER nobody


