FROM mcr.microsoft.com/devcontainers/base:jammy

# Copy Zscaler certificate if it exists (wildcard prevents build failure)
COPY ./zscaler.cr[t] /tmp/

# Install ca-certificates and handle Zscaler cert if present
RUN apt-get update && apt-get install -y ca-certificates && \
    if [ -f /tmp/zscaler.crt ]; then \
      cp /tmp/zscaler.crt /usr/local/share/ca-certificates/zscaler.crt && \
      update-ca-certificates; \
    fi

RUN apt-get update && apt-get install -y gh xdg-utils php-cli && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN curl -sS https://accounts.magento.cloud/cli/installer | php
ENV PATH    $PATH:$HOME/.magento-cloud/bin

USER vscode

ARG NODE_VERSION

# Install nvm and Node.js
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash && \
    export NVM_DIR="$HOME/.nvm" && \
    [ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && \
    nvm install $NODE_VERSION && \
    nvm use $NODE_VERSION 

ENV npm_config_registry=https://registry.yarnpkg.com

ENV NODE_PATH $NVM_DIR/versions/node/$NODE_VERSION/lib/node_modules
ENV PATH      $NVM_DIR/versions/node/$NODE_VERSION/bin:$PATH

# Conditionally set Node/npm CA config if Zscaler cert was installed
RUN export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && \
    if [ -f /usr/local/share/ca-certificates/zscaler.crt ]; then \
      npm config set cafile /etc/ssl/certs/ca-certificates.crt && \
      npm config set strict-ssl true && \
      echo "export NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt" >> $HOME/.bashrc; \
    fi

# Set NVM environment for subsequent RUN commands
ENV NVM_DIR="/home/vscode/.nvm"
ENV PATH="$NVM_DIR/versions/node/$NODE_VERSION/bin:$PATH"

RUN . "$NVM_DIR/nvm.sh" && npm install -g npm@latest  

RUN . "$NVM_DIR/nvm.sh" && npm install -g @adobe/aio-cli
    
RUN . "$NVM_DIR/nvm.sh" && aio telemetry yes && aio plugins:install @adobe/aio-cli-plugin-api-mesh 

RUN . "$NVM_DIR/nvm.sh" && aio plugins:install https://github.com/adobe-commerce/aio-cli-plugin-commerce

# Clean up temp files
RUN sudo rm -f /tmp/zscaler.crt

