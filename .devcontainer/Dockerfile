FROM mcr.microsoft.com/devcontainers/base:jammy

COPY ./zscaler.cr[t] /usr/local/share/ca-certificates/zscaler.crt
RUN apt-get update && apt-get install -y ca-certificates \
    && update-ca-certificates

RUN sudo apt-get update && sudo apt-get install -y gh xdg-utils php-cli && \
    sudo apt-get clean && \
    sudo rm -rf /var/lib/apt/lists/*

RUN curl -sS https://accounts.magento.cloud/cli/installer | php
ENV PATH    $PATH:$HOME/.magento-cloud/bin

USER vscode

ARG NODE_VERSION

RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash && \
    export NVM_DIR="$HOME/.nvm" && \
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" && \
    nvm install $NODE_VERSION && \
    nvm use $NODE_VERSION && \
    npm config set registry https://registry.yarnpkg.com && \
    npm install -g npm@latest

ENV NODE_PATH $NVM_DIR/versions/node/$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/$NODE_VERSION/bin:$PATH

ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt
RUN npm config set cafile /etc/ssl/certs/ca-certificates.crt \
    && npm config set strict-ssl true

ENV npm_config_registry=https://registry.yarnpkg.com

RUN export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh" && \
    npm install -g @adobe/aio-cli
    
RUN export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh" && \
    aio telemetry yes && \
    aio plugins:install @adobe/aio-cli-plugin-api-mesh 

RUN export NVM_DIR="$HOME/.nvm" && \. "$NVM_DIR/nvm.sh" && \
    aio telemetry yes && \
    aio plugins:install @adobe/aio-cli-plugin-api-mesh && \
    aio plugins:install https://github.com/adobe-commerce/aio-cli-plugin-commerce

