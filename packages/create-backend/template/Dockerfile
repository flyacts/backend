FROM node:10.9

WORKDIR /opt/flyacts-backend
EXPOSE 3000

RUN mkdir -p /opt/flyacts-backend && chown node /opt/flyacts-backend


COPY src /opt/flyacts-backend/src/
COPY config /opt/flyacts-backend/config/
COPY tsconfig.json ormconfig.json package* /opt/flyacts-backend/
RUN chown -R node /opt/flyacts-backend

USER node
RUN npm ci && npm run build && rm -R src

ENTRYPOINT [ "/usr/local/bin/npm", "run" ]
