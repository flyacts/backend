FROM node:14.15.0-buster AS base

USER node

WORKDIR /opt/backend

COPY --chown=node:node package.json package-lock.json tsconfig.json /opt/backend/
COPY --chown=node:node src /opt/backend/src/
COPY --chown=node:node tests /opt/backend/tests/
COPY --chown=node:node scripts /opt/backend/scripts/

RUN npm clean-install && \
    npm run build && \
    npm run css-build


FROM node:14.15.0-buster AS backend

USER node

WORKDIR /opt/backend

COPY --chown=node:node ormconfig.json /opt/backend/
COPY --chown=node:node config /opt/backend/config/
COPY --chown=node:node --from=base /opt/backend/package* /opt/backend/
COPY --chown=node:node --from=base /opt/backend/dist/src /opt/backend/dist
COPY --chown=node:node --from=base /opt/backend/src/migrations/*.sql /opt/backend/dist/migrations/

RUN npm clean-install --production && \
    rm -Rf /home/node/.npm

ENTRYPOINT [ "/usr/local/bin/npm", "run" ]
